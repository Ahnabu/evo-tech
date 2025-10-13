import express from "express";
import { UserControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "./user.constant";

const router = express.Router();

router.get("/", auth(USER_ROLE.ADMIN), UserControllers.getAllUsers);
router.get("/:id", UserControllers.getSingleUser);
router.put(
  "/:id",
  auth(USER_ROLE.ADMIN, USER_ROLE.USER),
  UserControllers.updateUser
);
router.delete("/:id", auth(USER_ROLE.ADMIN), UserControllers.deleteUser);

export const UserRoutes = router;
