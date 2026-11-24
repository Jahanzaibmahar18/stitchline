const User = require("../models/User");
const Order = require("../models/Order");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");

exports.adminGetCustomers = asyncHandler(async (req, res) => {
  const customers = await User.find({ role: "customer" }).sort({
    createdAt: -1,
  });
  const items = await Promise.all(
    customers.map(async (c) => {
      const orderCount = await Order.countDocuments({ user: c._id });
      return {
        _id: c._id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        status: c.status,
        orderCount,
        createdAt: c.createdAt,
      };
    })
  );
  sendResponse(res, 200, { items });
});
