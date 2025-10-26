import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { UserServices } from "./user.service";

const getAllUsers = catchAsync(async (req, res) => {
  const users = await UserServices.getAllUsersFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Users Retrieved Successfully",
    data: users.result,
    meta: users.meta,
  });
});

const getSingleUser = catchAsync(async (req, res) => {
  const user = await UserServices.getSingleUserFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User Retrieved Successfully",
    data: user,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await UserServices.updateUserIntoDB(req.body, id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User updated successfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  await UserServices.deleteUserFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User deleted successfully",
    data: null,
  });
});

const getUserDashboardStats = catchAsync(async (req, res) => {
  const userUuid = req.user.uuid; // From auth middleware
  const result = await UserServices.getUserDashboardStatsFromDB(userUuid);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User dashboard stats retrieved successfully",
    data: result,
  });
});

const getUserOrders = catchAsync(async (req, res) => {
  const userUuid = req.user.uuid; // From auth middleware
  const result = await UserServices.getUserOrdersFromDB(userUuid, req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User orders retrieved successfully",
    data: result.result,
    meta: result.meta,
  });
});

const createStaff = catchAsync(async (req, res) => {
  const result = await UserServices.createStaffIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Staff member created successfully",
    data: result,
  });
});

export const UserControllers = {
  getSingleUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserDashboardStats,
  getUserOrders,
  createStaff,
};
