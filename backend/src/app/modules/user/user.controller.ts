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

// Customer management controllers for admin
const getAllCustomers = catchAsync(async (req, res) => {
  const customers = await UserServices.getAllCustomersFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Customers retrieved successfully",
    data: customers.result,
    meta: customers.meta,
  });
});

const getCustomerStats = catchAsync(async (req, res) => {
  const stats = await UserServices.getCustomerStatsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Customer statistics retrieved successfully",
    data: stats,
  });
});

const updateCustomerStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { isDeleted } = req.body;
  
  const result = await UserServices.updateCustomerStatusFromDB(id, isDeleted);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Customer status updated successfully",
    data: result,
  });
});

// Staff management controllers for admin
const getAllStaffs = catchAsync(async (req, res) => {
  const staffs = await UserServices.getAllStaffsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Staff members retrieved successfully",
    data: staffs.result,
    meta: staffs.meta,
  });
});

const getStaffStats = catchAsync(async (req, res) => {
  const stats = await UserServices.getStaffStatsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Staff statistics retrieved successfully",
    data: stats,
  });
});

const createStaff = catchAsync(async (req, res) => {
  const result = await UserServices.createStaffFromDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Staff member created successfully",
    data: result,
  });
});

const updateStaffRole = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  
  const result = await UserServices.updateStaffRoleFromDB(id, role);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Staff role updated successfully",
    data: result,
  });
});

const updateStaffStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { isDeleted } = req.body;
  
  const result = await UserServices.updateStaffStatusFromDB(id, isDeleted);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Staff status updated successfully",
    data: result,
  });
});

export const UserControllers = {
  getSingleUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllCustomers,
  getCustomerStats,
  updateCustomerStatus,
  getAllStaffs,
  getStaffStats,
  createStaff,
  updateStaffRole,
  updateStaffStatus,
};
