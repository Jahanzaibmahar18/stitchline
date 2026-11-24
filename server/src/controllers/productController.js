const slugify = require("slugify");
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");

function productQuery(idOrSlug) {
  if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
    return { $or: [{ _id: idOrSlug }, { slug: idOrSlug }] };
  }
  return { slug: idOrSlug };
}

async function resolveCategory(categoryInput) {
  if (!categoryInput) throw new ApiError(400, "Category is required");
  if (typeof categoryInput === "string" && categoryInput.match(/^[a-f\d]{24}$/i)) {
    const byId = await Category.findById(categoryInput);
    if (byId) return byId;
  }
  const name = String(categoryInput).trim();
  let category = await Category.findOne({
    $or: [
      { name: new RegExp(`^${name}$`, "i") },
      { slug: slugify(name, { lower: true }) },
    ],
  });
  if (!category) {
    category = await Category.create({
      name,
      slug: slugify(name, { lower: true }),
      description: `${name} products`,
    });
  }
  return category;
}

exports.getProducts = asyncHandler(async (req, res) => {
  const {
    search = "",
    category,
    size,
    page = 1,
    limit = 24,
    status = "active",
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (size) filter.size = size;
  if (search) {
    filter.$or = [
      { name: new RegExp(search, "i") },
      { description: new RegExp(search, "i") },
      { slug: new RegExp(search, "i") },
    ];
  }
  if (category) {
    const cat = await Category.findOne({
      $or: [
        { slug: category },
        { name: new RegExp(`^${category}$`, "i") },
      ],
    });
    if (cat) filter.category = cat._id;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  sendResponse(res, 200, {
    items,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)) || 1,
  });
});

exports.getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug,
    status: "active",
  }).populate("category", "name slug");
  if (!product) throw new ApiError(404, "Product not found");
  sendResponse(res, 200, product);
});

exports.adminGetProducts = asyncHandler(async (req, res) => {
  const { search = "", page = 1, limit = 50 } = req.query;
  const filter = {};
  if (search) {
    filter.$or = [
      { name: new RegExp(search, "i") },
      { slug: new RegExp(search, "i") },
    ];
  }
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(filter),
  ]);
  sendResponse(res, 200, { items, total });
});

exports.adminGetProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne(productQuery(req.params.id)).populate(
    "category",
    "name slug"
  );
  if (!product) throw new ApiError(404, "Product not found");
  sendResponse(res, 200, product);
});

exports.createProduct = asyncHandler(async (req, res) => {
  const category = await resolveCategory(req.body.category);
  const slug =
    req.body.slug ||
    slugify(req.body.name, { lower: true, strict: true });

  const product = await Product.create({
    ...req.body,
    slug,
    category: category._id,
    gallery: req.body.gallery?.length ? req.body.gallery : [req.body.image],
  });
  sendResponse(res, 201, product, "Product created");
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne(productQuery(req.params.id));
  if (!product) throw new ApiError(404, "Product not found");

  if (req.body.category) {
    const category = await resolveCategory(req.body.category);
    product.category = category._id;
  }

  const fields = [
    "name",
    "slug",
    "description",
    "size",
    "price",
    "compareAt",
    "discount",
    "details",
    "image",
    "gallery",
    "stock",
    "status",
  ];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) product[field] = req.body[field];
  });

  await product.save();
  sendResponse(res, 200, product, "Product updated");
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOneAndDelete(productQuery(req.params.id));
  if (!product) throw new ApiError(404, "Product not found");
  sendResponse(res, 200, null, "Product deleted");
});

exports.updateStock = asyncHandler(async (req, res) => {
  const stock = Number(req.body.stock);
  if (Number.isNaN(stock) || stock < 0) {
    throw new ApiError(400, "Invalid stock value");
  }
  const product = await Product.findOneAndUpdate(
    productQuery(req.params.id),
    { stock },
    { new: true }
  );
  if (!product) throw new ApiError(404, "Product not found");
  sendResponse(res, 200, product, "Stock updated");
});
