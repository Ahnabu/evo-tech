import express from "express";
import { UserControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";

const router = express.Router();

router.get("/", auth(USER_ROLE.ADMIN), UserControllers.getAllUsers);
router.get("/customers", auth(USER_ROLE.ADMIN), UserControllers.getAllCustomers);
router.get("/customers/stats", auth(USER_ROLE.ADMIN), UserControllers.getCustomerStats);
router.put("/customers/:id/status", auth(USER_ROLE.ADMIN), UserControllers.updateCustomerStatus);
router.get("/staffs", auth(USER_ROLE.ADMIN), UserControllers.getAllStaffs);
router.get("/staffs/stats", auth(USER_ROLE.ADMIN), UserControllers.getStaffStats);
router.post("/staffs", auth(USER_ROLE.ADMIN), UserControllers.createStaff);
router.put("/staffs/:id/role", auth(USER_ROLE.ADMIN), UserControllers.updateStaffRole);
router.put("/staffs/:id/status", auth(USER_ROLE.ADMIN), UserControllers.updateStaffStatus);
router.get("/:id", UserControllers.getSingleUser);
router.put(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  UserControllers.updateUser
);
router.delete("/:id", auth(USER_ROLE.ADMIN), UserControllers.deleteUser);

export const UserRoutes = router;
