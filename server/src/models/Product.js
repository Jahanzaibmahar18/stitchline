const mongoose = require("mongoose");

const sizeOptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: { type: Number, required: true, min: 0 },
    compareAt: { type: Number, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const colorOptionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    hex: { type: String, default: "", trim: true },
    image: { type: String, default: "" },
  },
  { _id: false }
);

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
    /** @deprecated Prefer sizes[]. Kept for backward compatibility. */
    size: { type: String, default: "" },
    sizes: { type: [sizeOptionSchema], default: [] },
    colors: { type: [colorOptionSchema], default: [] },
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

productSchema.methods.resolveSize = function resolveSize(sizeName) {
  if (!sizeName || !this.sizes?.length) return null;
  return this.sizes.find(
    (s) => s.name.toLowerCase() === String(sizeName).toLowerCase()
  );
};

productSchema.methods.resolveColor = function resolveColor(colorName) {
  if (!colorName || !this.colors?.length) return null;
  return this.colors.find(
    (c) => c.name.toLowerCase() === String(colorName).toLowerCase()
  );
};

productSchema.methods.getUnitPrice = function getUnitPrice(sizeName) {
  const size = this.resolveSize(sizeName);
  if (size) return size.price;
  return this.price;
};

productSchema.methods.getAvailableStock = function getAvailableStock(sizeName) {
  const size = this.resolveSize(sizeName);
  if (size) return size.stock;
  return this.stock;
};

module.exports = mongoose.model("Product", productSchema);
