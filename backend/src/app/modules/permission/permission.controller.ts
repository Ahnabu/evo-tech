import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { PermissionServices } from "./permission.service";

const getAllPermissions = catchAsync(async (req, res) => {
  const result = await PermissionServices.getAllPermissionsFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Permissions retrieved successfully!",
    data: result,
  });
});

const getStaffPermissions = catchAsync(async (req, res) => {
  const { userUuid } = req.params;
  const result = await PermissionServices.getStaffPermissionsFromDB(userUuid);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Staff permissions retrieved successfully!",
    data: result,
  });
});

const assignPermissions = catchAsync(async (req, res) => {
  const { userUuid } = req.params;
  const adminUuid = req.user.uuid;
  
  const result = await PermissionServices.assignPermissionsToStaff(userUuid, {
    permissions: req.body.permissions,
    grantedBy: adminUuid,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Permissions assigned successfully!",
    data: result,
  });
});

const getMyPermissions = catchAsync(async (req, res) => {
  const userUuid = req.user.uuid;
  console.log('🔍 getMyPermissions called for user UUID:', userUuid);
  console.log('📋 User object from token:', {
    uuid: req.user.uuid,
    _id: req.user._id,
    email: req.user.email,
    userType: req.user.userType
  });
  
  const result = await PermissionServices.getStaffPermissionsFromDB(userUuid);
  
  console.log('📤 Returning permissions:', {
    hasPermissions: !!result.permissions,
    permissionCount: result.permissions?.length || 0,
    routeCount: result.permittedRoutes?.length || 0,
    permissions: result.permissionCodes
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your permissions retrieved successfully!",
    data: result,
  });
});

const getPermittedRoutes = catchAsync(async (req, res) => {
  const userUuid = req.user.uuid;
  const result = await PermissionServices.getPermittedRoutesForUser(userUuid);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Permitted routes retrieved successfully!",
    data: { routes: result },
  });
});

export const PermissionControllers = {
  getAllPermissions,
  getStaffPermissions,
  assignPermissions,
  getMyPermissions,
  getPermittedRoutes,
};
