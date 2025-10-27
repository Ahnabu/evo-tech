import express from "express";
import { OrderControllers } from "./order.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// User routes
router.post(
  "/",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  OrderControllers.placeOrder
);
router.get(
  "/my-orders",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  OrderControllers.getUserOrders
);
router.get(
  "/:id",
  auth(USER_ROLE.USER, USER_ROLE.ADMIN),
  OrderControllers.getSingleOrder
);

// Admin routes
router.get("/", auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE), OrderControllers.getAllOrders);
router.put("/:id", auth(USER_ROLE.ADMIN, USER_ROLE.EMPLOYEE), OrderControllers.updateOrderStatus);
router.delete("/:id", auth(USER_ROLE.ADMIN), OrderControllers.deleteOrder);

export const OrderRoutes = router;
