import express from "express";
import { ShipmentControllers } from "./shipment.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// Public route for tracking
router.get("/track/:trackingNumber", ShipmentControllers.getShipmentByTrackingNumber);

// Admin routes
router.get("/", auth(USER_ROLE.ADMIN), ShipmentControllers.getAllShipments);
router.get("/stats", auth(USER_ROLE.ADMIN), ShipmentControllers.getShipmentStats);
router.get("/order/:orderId", auth(USER_ROLE.ADMIN), ShipmentControllers.getShipmentsByOrder);
router.get("/:id", auth(USER_ROLE.ADMIN), ShipmentControllers.getSingleShipment);
router.post("/", auth(USER_ROLE.ADMIN), ShipmentControllers.createShipment);
router.put("/:id", auth(USER_ROLE.ADMIN), ShipmentControllers.updateShipment);
router.delete("/:id", auth(USER_ROLE.ADMIN), ShipmentControllers.deleteShipment);

export const ShipmentRoutes = router;