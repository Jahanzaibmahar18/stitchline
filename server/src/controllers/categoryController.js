const slugify = require("slugify");
const Category = require("../models/Category");
const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");

exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  sendResponse(res, 200, categories);
});

exports.adminGetCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  const withCounts = await Promise.all(
    categories.map(async (c) => {
      const productCount = await Product.countDocuments({ category: c._id });
      return { ...c.toObject(), productCount };
    })
  );
  sendResponse(res, 200, withCounts);
});

exports.createCategory = asyncHandler(async (req, res) => {
  const slug = slugify(req.body.name, { lower: true, strict: true });
  const exists = await Category.findOne({ slug });
  if (exists) throw new ApiError(400, "Category already exists");
  const category = await Category.create({
    name: req.body.name,
    slug,
    description: req.body.description || "",
    image: req.body.image || "",
  });
  sendResponse(res, 201, category, "Category created");
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!category) throw new ApiError(404, "Category not found");
  sendResponse(res, 200, category, "Category updated");
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const inUse = await Product.countDocuments({ category: req.params.id });
  if (inUse > 0) {
    throw new ApiError(400, "Cannot delete category with products");
  }
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new ApiError(404, "Category not found");
  sendResponse(res, 200, null, "Category deleted");
});
