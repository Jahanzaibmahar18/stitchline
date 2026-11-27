const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const { publicProductRoutes } = require("./routes/productRoutes");
const { publicOrderRoutes } = require("./routes/orderRoutes");
const { publicCategoryRoutes } = require("./routes/categoryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const settingsController = require("./controllers/settingsController");
const errorHandler = require("./middleware/errorHandler");

const app = express();

function allowedOrigins() {
  const configured = [
    process.env.CLIENT_URL,
    process.env.ADMIN_URL,
    ...(process.env.CORS_ORIGINS || "").split(","),
  ]
    .map((value) => (value || "").trim().replace(/\/+$/, ""))
    .filter(Boolean);

  return [
    ...new Set([
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://stitchline-zeta.vercel.app",
      "https://stitchline-git-main-m-jahanzaibs-projects-d0f87ccf.vercel.app",
      "https://stitchlane.store",
      "https://www.stitchlane.store",
      ...configured,
    ]),
  ];
}

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin(origin, callback) {
      const allowed = allowedOrigins();
      // Allow non-browser clients (no Origin) and configured frontends
      if (!origin || allowed.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(
  "/media",
  express.static(path.join(__dirname, "../public/products"))
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "StitchLane API is running",
    health: "/api/health",
    products: "/api/products",
    storefront: process.env.CLIENT_URL || "http://localhost:5173",
    admin: process.env.ADMIN_URL || process.env.CLIENT_URL || "http://localhost:5173",
  });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "StitchLane API running" });
});

app.get("/api/settings/public", settingsController.getPublicSettings);
app.use("/api/auth", authRoutes);
app.use("/api/products", publicProductRoutes);
app.use("/api/categories", publicCategoryRoutes);
app.use("/api/orders", publicOrderRoutes);
app.use("/api/admin", adminRoutes);

app.use(errorHandler);

module.exports = app;
