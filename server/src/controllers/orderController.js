const mongoose = require("mongoose");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const Customer = require("../models/Customer");
const Settings = require("../models/Settings");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");

async function nextOrderNumber() {
  const latest = await Order.findOne()
    .sort({ createdAt: -1 })
    .select("orderNumber")
    .lean();
  let next = 1;
  if (latest?.orderNumber) {
    const match = String(latest.orderNumber).match(/(\d+)$/);
    if (match) next = Number(match[1]) + 1;
  } else {
    next = (await Order.countDocuments()) + 1;
  }
  return `SL-${String(next).padStart(5, "0")}`;
}

async function nextCustomerId() {
  const count = await Customer.countDocuments();
  return `CUS-${String(count + 1).padStart(5, "0")}`;
}

function normalizeImagePath(image) {
  if (!image) return "";
  let normalized = image;
  try {
    if (normalized.startsWith("http")) {
      normalized = new URL(normalized).pathname;
    }
  } catch {
    /* keep as-is */
  }
  return normalized;
}

async function upsertCustomerFromOrder({
  customer,
  shippingAddress,
  total,
  userId,
}) {
  const phone = String(customer.phone || "").trim();
  const email = customer.email ? String(customer.email).toLowerCase().trim() : "";

  let record =
    (await Customer.findOne({ phone })) ||
    (email ? await Customer.findOne({ email }) : null);

  const now = new Date();

  if (!record) {
    record = await Customer.create({
      customerId: await nextCustomerId(),
      name: customer.name,
      phone,
      email:
        email ||
        `${phone.replace(/\D/g, "") || "guest"}@customers.stitchlane.local`,
      address: shippingAddress.address || "",
      city: shippingAddress.city || "",
      postalCode: shippingAddress.postalCode || "",
      totalOrders: 1,
      totalSpent: total,
      firstOrderAt: now,
      lastOrderAt: now,
      user: userId,
      status: "active",
    });
    return record;
  }

  record.name = customer.name || record.name;
  if (email) record.email = email;
  record.address = shippingAddress.address || record.address;
  record.city = shippingAddress.city || record.city;
  if (shippingAddress.postalCode) {
    record.postalCode = shippingAddress.postalCode;
  }
  record.totalOrders = (record.totalOrders || 0) + 1;
  record.totalSpent = (record.totalSpent || 0) + total;
  if (!record.firstOrderAt) record.firstOrderAt = now;
  record.lastOrderAt = now;
  if (userId) record.user = userId;
  await record.save();
  return record;
}

async function adjustStock(product, sizeName, quantityDelta) {
  if (product.sizes?.length && sizeName) {
    const idx = product.sizes.findIndex(
      (s) => s.name.toLowerCase() === String(sizeName).toLowerCase()
    );
    if (idx >= 0) {
      const next = product.sizes[idx].stock + quantityDelta;
      if (next < 0) {
        throw new ApiError(400, `Insufficient stock for ${product.name} (${sizeName})`);
      }
      product.sizes[idx].stock = next;
      product.stock = product.sizes.reduce((sum, s) => sum + (s.stock || 0), 0);
      await product.save();
      return;
    }
  }

  const next = (product.stock || 0) + quantityDelta;
  if (next < 0) {
    throw new ApiError(400, `Insufficient stock for ${product.name}`);
  }
  product.stock = next;
  await product.save();
}

exports.createOrder = asyncHandler(async (req, res) => {
  const { customer, shippingAddress, items, paymentMethod } = req.body;

  if (!customer?.name || !customer?.phone) {
    throw new ApiError(400, "Customer name and phone are required");
  }
  const email = String(customer.email || "")
    .trim()
    .toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, "A valid email address is required");
  }
  customer.email = email;
  if (!shippingAddress?.address || !shippingAddress?.city) {
    throw new ApiError(400, "Shipping address and city are required");
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Cart items are required");
  }

  // Soft duplicate guard: identical cart signature for same phone within 20s
  const cartSignature = items
    .map((i) =>
      [
        i.slug || i.id || "",
        i.size || "",
        i.color || "",
        Math.max(1, Number(i.quantity) || 1),
      ].join(":")
    )
    .sort()
    .join("|");
  const recent = await Order.findOne({
    "customer.phone": String(customer.phone).trim(),
    createdAt: { $gte: new Date(Date.now() - 20 * 1000) },
  }).sort({ createdAt: -1 });
  if (recent) {
    const recentSignature = recent.items
      .map((i) =>
        [i.slug || "", i.size || "", i.color || "", i.quantity].join(":")
      )
      .sort()
      .join("|");
    if (recentSignature === cartSignature) {
      return sendResponse(res, 200, recent, "Order already placed");
    }
  }

  const settings =
    (await Settings.findOne()) || { deliveryCharge: 250, codEnabled: true };
  if (!settings.codEnabled) throw new ApiError(400, "COD is currently disabled");

  const lineItems = [];
  let subtotal = 0;
  const stockUpdates = [];

  for (const item of items) {
    const key = item.slug || item.id;
    const query = mongoose.Types.ObjectId.isValid(key)
      ? { $or: [{ slug: key }, { _id: key }], status: "active" }
      : { slug: key, status: "active" };
    const product = await Product.findOne(query);
    if (!product) throw new ApiError(400, `Product not found: ${key}`);

    const quantity = Math.max(1, Number(item.quantity) || 1);

    const POUCH_DESIGN_PRICES = {
      "Simple Roti Pouch": 800,
      "Roti Pouch with Lace Design": 1000,
    };

    let sizeName = String(item.size || "").trim();
    let unitPrice;

    if (product.sizes?.length) {
      // Bags: size must come from cart selection (Small / Medium / Large)
      if (!sizeName || !["Small", "Medium", "Large"].includes(sizeName)) {
        throw new ApiError(
          400,
          `Please select a bag size in your cart for ${product.name}`
        );
      }
      const sizeOpt = product.resolveSize(sizeName);
      if (!sizeOpt) {
        throw new ApiError(400, `Invalid size for ${product.name}`);
      }
      sizeName = sizeOpt.name;
      unitPrice = sizeOpt.price;
      if (sizeOpt.stock < quantity) {
        throw new ApiError(
          400,
          `Insufficient stock for ${product.name} (${sizeOpt.name})`
        );
      }
    } else {
      // Roti pouches: design selected in cart, or fall back to product type
      if (!sizeName) sizeName = product.size || "";
      if (POUCH_DESIGN_PRICES[sizeName] != null) {
        unitPrice = POUCH_DESIGN_PRICES[sizeName];
      } else if (/lace/i.test(sizeName) || /lace/i.test(product.name || "")) {
        sizeName = "Roti Pouch with Lace Design";
        unitPrice = 1000;
      } else if (/simple/i.test(sizeName) || product.size === "Simple Roti Pouch") {
        sizeName = "Simple Roti Pouch";
        unitPrice = 800;
      } else {
        unitPrice = product.price;
      }
      if (product.stock < quantity) {
        throw new ApiError(400, `Insufficient stock for ${product.name}`);
      }
    }

    let colorName = item.color || "";
    if (product.colors?.length) {
      const matched = colorName ? product.resolveColor(colorName) : null;
      if (matched) {
        colorName = matched.name;
      } else if (colorName) {
        // Keep cart-provided label even if not in catalog config
      } else {
        colorName = "";
      }
    }
    const colorOpt = colorName ? product.resolveColor(colorName) : null;

    let selectedImage = product.image;
    if (colorOpt?.image) {
      selectedImage = colorOpt.image;
    } else if (item.image) {
      const normalized = normalizeImagePath(item.image);
      if (
        product.gallery.includes(normalized) ||
        product.image === normalized
      ) {
        selectedImage = normalized;
      }
    }

    lineItems.push({
      product: product._id,
      slug: product.slug,
      name: product.name,
      image: selectedImage,
      size: sizeName || product.size || "",
      color: colorName || "",
      price: unitPrice,
      quantity,
    });
    subtotal += unitPrice * quantity;
    stockUpdates.push({ product, sizeName, quantity });
  }

  const shippingFee = Number(settings.deliveryCharge ?? 250);
  const total = subtotal + shippingFee;
  const orderNumber = await nextOrderNumber();

  for (const update of stockUpdates) {
    await adjustStock(update.product, update.sizeName, -update.quantity);
  }

  let user = await User.findOne({ phone: customer.phone });
  if (!user && customer.email) {
    user = await User.findOne({ email: customer.email.toLowerCase() });
  }
  if (!user) {
    user = await User.create({
      name: customer.name,
      email:
        customer.email?.toLowerCase() ||
        `${String(customer.phone).replace(/\D/g, "")}@customers.stitchlane.local`,
      phone: customer.phone,
      password: `Temp${String(customer.phone).slice(-4)}!aA9`,
      role: "customer",
    });
  } else {
    user.name = customer.name || user.name;
    if (customer.email) user.email = customer.email.toLowerCase();
    await user.save();
  }

  const customerRecord = await upsertCustomerFromOrder({
    customer,
    shippingAddress,
    total,
    userId: user._id,
  });

  const order = await Order.create({
    orderNumber,
    user: user._id,
    customerRef: customerRecord._id,
    customer: {
      name: customer.name,
      phone: customer.phone,
      email: customer.email || customerRecord.email || user.email,
    },
    shippingAddress: {
      address: shippingAddress.address,
      city: shippingAddress.city,
      postalCode: shippingAddress.postalCode || "",
    },
    items: lineItems,
    subtotal,
    shippingFee,
    total,
    paymentMethod: paymentMethod === "COD" ? "COD" : "COD",
    paymentStatus: "unpaid",
    status: "order_placed",
  });

  sendResponse(res, 201, order, "Order placed successfully");
});

exports.adminGetOrders = asyncHandler(async (req, res) => {
  const { status, search = "", page = 1, limit = 50 } = req.query;
  const filter = {};
  if (status) {
    const normalized = Order.normalizeStatus(status);
    if (normalized === "order_placed") {
      filter.status = { $in: ["order_placed", "pending", "confirmed"] };
    } else {
      filter.status = normalized;
    }
  }
  if (search) {
    filter.$or = [
      { orderNumber: new RegExp(search, "i") },
      { "customer.name": new RegExp(search, "i") },
      { "customer.phone": new RegExp(search, "i") },
      { "customer.email": new RegExp(search, "i") },
      { "items.name": new RegExp(search, "i") },
      { "items.color": new RegExp(search, "i") },
      { "items.size": new RegExp(search, "i") },
    ];
  }
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Order.find(filter)
      .populate("customerRef", "customerId name phone email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Order.countDocuments(filter),
  ]);
  sendResponse(res, 200, { items, total });
});

exports.adminGetOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "customerRef",
    "customerId name phone email address city postalCode totalOrders totalSpent"
  );
  if (!order) throw new ApiError(404, "Order not found");
  sendResponse(res, 200, order);
});

exports.adminUpdateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");

  const prevStatus = order.status;
  if (req.body.status) {
    order.status = Order.normalizeStatus(req.body.status);
  }
  if (req.body.paymentStatus) order.paymentStatus = req.body.paymentStatus;

  if (req.body.status === "delivered" && order.paymentMethod === "COD") {
    order.paymentStatus = req.body.paymentStatus || "paid";
  }

  if (
    Order.normalizeStatus(req.body.status) === "cancelled" &&
    Order.normalizeStatus(prevStatus) !== "cancelled"
  ) {
    for (const item of order.items) {
      if (!item.product) continue;
      const product = await Product.findById(item.product);
      if (product) {
        await adjustStock(product, item.size, item.quantity);
      }
    }
  }

  await order.save();
  sendResponse(res, 200, order, "Order updated");
});

exports.adminDeleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");

  if (Order.normalizeStatus(order.status) !== "cancelled") {
    for (const item of order.items) {
      if (!item.product) continue;
      const product = await Product.findById(item.product);
      if (product) {
        await adjustStock(product, item.size, item.quantity);
      }
    }
  }

  if (order.customerRef) {
    const customer = await Customer.findById(order.customerRef);
    if (customer) {
      customer.totalOrders = Math.max(0, (customer.totalOrders || 1) - 1);
      customer.totalSpent = Math.max(0, (customer.totalSpent || 0) - order.total);
      await customer.save();
    }
  }

  await order.deleteOne();
  sendResponse(res, 200, null, "Order deleted");
});
