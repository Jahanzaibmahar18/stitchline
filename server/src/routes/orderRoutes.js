const express = require("express");
const { body } = require("express-validator");
const orderController = require("../controllers/orderController");
const validate = require("../middleware/validate");
const { protect, authorize } = require("../middleware/auth");

const publicRouter = express.Router();
publicRouter.post(
  "/",
  body("customer.name").notEmpty(),
  body("customer.phone").notEmpty(),
  body("shippingAddress.address").notEmpty(),
  body("shippingAddress.city").notEmpty(),
  body("items").isArray({ min: 1 }),
  validate,
  orderController.createOrder
);

const adminRouter = express.Router();
adminRouter.use(protect, authorize("admin", "staff"));
adminRouter.get("/", orderController.adminGetOrders);
adminRouter.get("/:id", orderController.adminGetOrder);
adminRouter.put("/:id", orderController.adminUpdateOrder);

module.exports = { publicOrderRoutes: publicRouter, adminOrderRoutes: adminRouter };
