const mongoose = require("mongoose");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const Settings = require("../models/Settings");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");

async function nextOrderNumber() {
  const count = await Order.countDocuments();
  const n = String(count + 1).padStart(5, "0");
  return `SL-${n}`;
}

exports.createOrder = asyncHandler(async (req, res) => {
  const { customer, shippingAddress, items } = req.body;
  if (!customer?.name || !customer?.phone) {
    throw new ApiError(400, "Customer name and phone are required");
  }
  if (!shippingAddress?.address || !shippingAddress?.city) {
    throw new ApiError(400, "Shipping address and city are required");
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Cart items are required");
  }

  const settings = (await Settings.findOne()) || { deliveryCharge: 250, codEnabled: true };
  if (!settings.codEnabled) throw new ApiError(400, "COD is currently disabled");

  const lineItems = [];
  let subtotal = 0;

  for (const item of items) {
    const key = item.slug || item.id;
    const query = mongoose.Types.ObjectId.isValid(key)
      ? { $or: [{ slug: key }, { _id: key }], status: "active" }
      : { slug: key, status: "active" };
    const product = await Product.findOne(query);
    if (!product) throw new ApiError(400, `Product not found: ${key}`);
    const quantity = Math.max(1, Number(item.quantity) || 1);
    if (product.stock < quantity) {
      throw new ApiError(400, `Insufficient stock for ${product.name}`);
    }

    let selectedImage = product.image;
    if (item.image) {
      let normalized = item.image;
      try {
        if (normalized.startsWith("http")) {
          normalized = new URL(normalized).pathname;
        }
      } catch {
        /* keep as-is */
      }
      if (product.gallery.includes(normalized) || product.image === normalized) {
        selectedImage = normalized;
      }
    }

    lineItems.push({
      product: product._id,
      slug: product.slug,
      name: product.name,
      image: selectedImage,
      price: product.price,
      quantity,
    });
    subtotal += product.price * quantity;
  }

  const shippingFee = Number(settings.deliveryCharge ?? 250);
  const total = subtotal + shippingFee;
  const orderNumber = await nextOrderNumber();

  const sessionProducts = lineItems.map((li) => ({
    id: li.product,
    quantity: li.quantity,
  }));

  for (const li of sessionProducts) {
    const updated = await Product.findOneAndUpdate(
      { _id: li.id, stock: { $gte: li.quantity } },
      { $inc: { stock: -li.quantity } },
      { new: true }
    );
    if (!updated) {
      throw new ApiError(400, "Stock changed during checkout. Please try again.");
    }
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
        `${customer.phone.replace(/\D/g, "")}@customers.stitchlane.local`,
      phone: customer.phone,
      password: `Temp${customer.phone.slice(-4)}!aA9`,
      role: "customer",
    });
  }

  const order = await Order.create({
    orderNumber,
    user: user._id,
    customer: {
      name: customer.name,
      phone: customer.phone,
      email: customer.email || user.email,
    },
    shippingAddress,
    items: lineItems,
    subtotal,
    shippingFee,
    total,
    paymentMethod: "COD",
    paymentStatus: "unpaid",
    status: "pending",
  });

  sendResponse(res, 201, order, "Order placed successfully");
});

exports.adminGetOrders = asyncHandler(async (req, res) => {
  const { status, search = "", page = 1, limit = 50 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { orderNumber: new RegExp(search, "i") },
      { "customer.name": new RegExp(search, "i") },
      { "customer.phone": new RegExp(search, "i") },
    ];
  }
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
    Order.countDocuments(filter),
  ]);
  sendResponse(res, 200, { items, total });
});

exports.adminGetOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");
  sendResponse(res, 200, order);
});

exports.adminUpdateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");

  const prevStatus = order.status;
  if (req.body.status) order.status = req.body.status;
  if (req.body.paymentStatus) order.paymentStatus = req.body.paymentStatus;

  if (req.body.status === "delivered" && order.paymentMethod === "COD") {
    order.paymentStatus = req.body.paymentStatus || "paid";
  }

  if (req.body.status === "cancelled" && prevStatus !== "cancelled") {
    for (const item of order.items) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }
  }

  await order.save();
  sendResponse(res, 200, order, "Order updated");
});
