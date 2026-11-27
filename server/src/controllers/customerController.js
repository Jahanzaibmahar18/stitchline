const mongoose = require("mongoose");
const Customer = require("../models/Customer");
const Order = require("../models/Order");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");

function customerQuery(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ _id: id }, { customerId: id }] };
  }
  return { customerId: id };
}

exports.adminGetCustomers = asyncHandler(async (req, res) => {
  const { search = "", page = 1, limit = 50 } = req.query;
  const filter = {};
  if (search) {
    filter.$or = [
      { name: new RegExp(search, "i") },
      { phone: new RegExp(search, "i") },
      { email: new RegExp(search, "i") },
      { customerId: new RegExp(search, "i") },
      { city: new RegExp(search, "i") },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Customer.find(filter)
      .sort({ lastOrderAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Customer.countDocuments(filter),
  ]);

  sendResponse(res, 200, { items, total });
});

exports.adminGetCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne(customerQuery(req.params.id));
  if (!customer) throw new ApiError(404, "Customer not found");

  const orderFilter = [{ customerRef: customer._id }];
  if (customer.user) orderFilter.push({ user: customer.user });
  orderFilter.push({ "customer.phone": customer.phone });

  const orders = await Order.find({ $or: orderFilter }).sort({ createdAt: -1 });

  sendResponse(res, 200, { customer, orders });
});

exports.adminDeleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findOne(customerQuery(req.params.id));
  if (!customer) throw new ApiError(404, "Customer not found");

  // Keep historical orders; unlink customer reference safely
  await Order.updateMany(
    { customerRef: customer._id },
    { $unset: { customerRef: 1 } }
  );

  await customer.deleteOne();
  sendResponse(res, 200, null, "Customer deleted");
});
