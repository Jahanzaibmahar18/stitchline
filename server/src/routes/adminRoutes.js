const express = require("express");
const { protect, authorize } = require("../middleware/auth");
const customerController = require("../controllers/customerController");
const reviewController = require("../controllers/reviewController");
const settingsController = require("../controllers/settingsController");
const statsController = require("../controllers/statsController");
const { adminProductRoutes } = require("./productRoutes");
const { adminOrderRoutes } = require("./orderRoutes");
const { adminCategoryRoutes } = require("./categoryRoutes");

const router = express.Router();

router.use(protect, authorize("admin", "staff"));

router.get("/stats", statsController.getStats);
router.get("/customers", customerController.adminGetCustomers);
router.get("/reviews", reviewController.adminGetReviews);
router.put("/reviews/:id", reviewController.adminUpdateReview);
router.get("/settings", settingsController.adminGetSettings);
router.put("/settings", settingsController.adminUpdateSettings);

router.use("/products", adminProductRoutes);
router.use("/orders", adminOrderRoutes);
router.use("/categories", adminCategoryRoutes);

module.exports = router;
