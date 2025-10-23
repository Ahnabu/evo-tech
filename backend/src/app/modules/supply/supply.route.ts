import express from "express";
import { SupplyControllers } from "./supply.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// Admin routes
router.get("/", auth(USER_ROLE.ADMIN), SupplyControllers.getAllSupplies);
router.get("/low-stock", auth(USER_ROLE.ADMIN), SupplyControllers.getLowStockSupplies);
router.get("/product/:productId", auth(USER_ROLE.ADMIN), SupplyControllers.getSuppliesByProduct);
router.get("/:id", auth(USER_ROLE.ADMIN), SupplyControllers.getSingleSupply);
router.post("/", auth(USER_ROLE.ADMIN), SupplyControllers.createSupply);
router.put("/:id", auth(USER_ROLE.ADMIN), SupplyControllers.updateSupply);
router.delete("/:id", auth(USER_ROLE.ADMIN), SupplyControllers.deleteSupply);

export const SupplyRoutes = router;