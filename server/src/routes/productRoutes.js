const express = require("express");
const productController = require("../controllers/productController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", productController.getProducts);
router.get("/:slug", productController.getProductBySlug);

const adminRouter = express.Router();
adminRouter.use(protect, authorize("admin", "staff"));
adminRouter.get("/", productController.adminGetProducts);
adminRouter.get("/:id", productController.adminGetProduct);
adminRouter.post("/", productController.createProduct);
adminRouter.put("/:id", productController.updateProduct);
adminRouter.delete("/:id", productController.deleteProduct);
adminRouter.patch("/:id/stock", productController.updateStock);

module.exports = { publicProductRoutes: router, adminProductRoutes: adminRouter };
