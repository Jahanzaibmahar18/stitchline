const fs = require("fs");
const path = require("path");
const asyncHandler = require("../utils/asyncHandler");
const sendResponse = require("../utils/sendResponse");
const ApiError = require("../utils/ApiError");

const MEDIA_DIR = path.join(__dirname, "../../public/products");

function ensureMediaDir() {
  if (!fs.existsSync(MEDIA_DIR)) {
    fs.mkdirSync(MEDIA_DIR, { recursive: true });
  }
}

exports.listMedia = asyncHandler(async (req, res) => {
  ensureMediaDir();
  const files = fs
    .readdirSync(MEDIA_DIR)
    .filter((name) => /\.(jpe?g|png|webp|gif|avif)$/i.test(name))
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({
      name,
      url: `/media/${name}`,
    }));
  sendResponse(res, 200, { items: files });
});

exports.uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "No image file uploaded");
  const url = `/media/${req.file.filename}`;
  sendResponse(res, 201, { url, name: req.file.filename }, "Image uploaded");
});
