const mongoose = require("mongoose");

const ORDER_STATUSES = [
  "order_placed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  // legacy values kept so existing documents remain valid
  "pending",
  "confirmed",
];

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    slug: String,
    name: { type: String, required: true },
    image: { type: String, required: true },
    size: { type: String, default: "" },
    color: { type: String, default: "" },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    customerRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      index: true,
    },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: String,
    },
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, default: "" },
    },
    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["COD"], default: "COD" },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
      index: true,
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "order_placed",
      index: true,
    },
  },
  { timestamps: true }
);

orderSchema.statics.STATUS_LABELS = {
  order_placed: "Order Placed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  pending: "Order Placed",
  confirmed: "Order Placed",
};

orderSchema.statics.normalizeStatus = function normalizeStatus(status) {
  if (status === "pending" || status === "confirmed") return "order_placed";
  return status;
};

module.exports = mongoose.model("Order", orderSchema);
module.exports.ORDER_STATUSES = [
  "order_placed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
