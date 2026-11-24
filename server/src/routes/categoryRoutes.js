const express = require("express");
const categoryController = require("../controllers/categoryController");
const { protect, authorize } = require("../middleware/auth");

const publicRouter = express.Router();
publicRouter.get("/", categoryController.getCategories);

const adminRouter = express.Router();
adminRouter.use(protect, authorize("admin", "staff"));
adminRouter.get("/", categoryController.adminGetCategories);
adminRouter.post("/", categoryController.createCategory);
adminRouter.put("/:id", categoryController.updateCategory);
adminRouter.delete("/:id", categoryController.deleteCategory);

module.exports = {
  publicCategoryRoutes: publicRouter,
  adminCategoryRoutes: adminRouter,
};
