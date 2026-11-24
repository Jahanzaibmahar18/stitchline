const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");

exports.getStats = asyncHandler(async (req, res) => {
  const paidOrDelivered = {
    $or: [{ paymentStatus: "paid" }, { status: "delivered" }],
  };

  const [
    totalSalesAgg,
    totalOrders,
    totalCustomers,
    totalProducts,
    lowStock,
    recentOrders,
    statusGroups,
  ] = await Promise.all([
    Order.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]),
    Order.countDocuments(),
    User.countDocuments({ role: "customer" }),
    Product.countDocuments(),
    Product.find({ stock: { $lte: 20 } })
      .select("name slug stock")
      .sort({ stock: 1 })
      .limit(10),
    Order.find().sort({ createdAt: -1 }).limit(8),
    Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
  ]);

  const statusSummary = {};
  statusGroups.forEach((g) => {
    statusSummary[g._id] = g.count;
  });

  sendResponse(res, 200, {
    totalSales: totalSalesAgg[0]?.total || 0,
    totalOrders,
    totalCustomers,
    totalProducts,
    lowStock,
    recentOrders,
    statusSummary,
    collectedHint: paidOrDelivered,
  });
});
