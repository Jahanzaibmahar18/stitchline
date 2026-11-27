const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    customerId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true, index: true },
    email: { type: String, trim: true, lowercase: true, default: "" },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    postalCode: { type: String, default: "" },
    totalOrders: { type: Number, default: 0, min: 0 },
    totalSpent: { type: Number, default: 0, min: 0 },
    firstOrderAt: { type: Date },
    lastOrderAt: { type: Date },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: ["active", "disabled"],
      default: "active",
    },
  },
  { timestamps: true }
);

customerSchema.index({ phone: 1, email: 1 });

module.exports = mongoose.model("Customer", customerSchema);
