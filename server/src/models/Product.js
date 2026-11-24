const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    size: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    compareAt: { type: Number, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    details: [{ type: String }],
    image: { type: String, required: true },
    gallery: [{ type: String }],
    stock: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["active", "draft"],
      default: "active",
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
