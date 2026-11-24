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

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      process.env.ADMIN_URL || "http://localhost:5174",
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use("/products", express.static(path.join(__dirname, "../public/products")));

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
