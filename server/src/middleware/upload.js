const fs = require("fs");
const path = require("path");
const multer = require("multer");

const MEDIA_DIR = path.join(__dirname, "../../public/products");

if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, MEDIA_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || ".jpg";
    const base = path
      .basename(file.originalname, path.extname(file.originalname))
      .replace(/[^a-zA-Z0-9_-]/g, "-")
      .slice(0, 40);
    cb(null, `${base || "image"}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!/^image\/(jpeg|jpg|png|webp|gif|avif)$/i.test(file.mimetype)) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

module.exports = upload;
