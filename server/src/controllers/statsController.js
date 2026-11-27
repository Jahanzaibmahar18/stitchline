const Order = require("../models/Order");
const Product = require("../models/Product");
const Customer = require("../models/Customer");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");

exports.getStats = asyncHandler(async (req, res) => {
  const [
    totalSalesAgg,
    totalOrders,
    customerModelCount,
    legacyCustomerCount,
    totalProducts,
    lowStock,
    recentOrders,
    statusGroups,
    pendingOrders,
    deliveredOrders,
  ] = await Promise.all([
    Order.aggregate([
      { $match: { status: { $nin: ["cancelled"] } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Order.countDocuments(),
    Customer.countDocuments(),
    User.countDocuments({ role: "customer" }),
    Product.countDocuments(),
    Product.find({ stock: { $lte: 20 } })
      .select("name slug stock sizes")
      .sort({ stock: 1 })
      .limit(10),
    Order.find().sort({ createdAt: -1 }).limit(8),
    Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Order.countDocuments({
      status: { $in: ["order_placed", "pending", "confirmed", "processing"] },
    }),
    Order.countDocuments({ status: "delivered" }),
  ]);

  const statusSummary = {};
  statusGroups.forEach((g) => {
    const key = Order.normalizeStatus(g._id);
    statusSummary[key] = (statusSummary[key] || 0) + g.count;
  });

  sendResponse(res, 200, {
    totalSales: totalSalesAgg[0]?.total || 0,
    totalOrders,
    totalCustomers: Math.max(customerModelCount, legacyCustomerCount),
    totalProducts,
    pendingOrders,
    deliveredOrders,
    lowStock,
    recentOrders,
    statusSummary,
  });
});
