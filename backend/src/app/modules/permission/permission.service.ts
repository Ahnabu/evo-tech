import { Permission } from "./permission.model";
import { StaffPermission } from "./staff-permission.model";
import { TPermission, TStaffPermission } from "./permission.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

// Get all permissions
const getAllPermissionsFromDB = async (query: Record<string, unknown>) => {
  const { category } = query;
  
  const searchQuery: any = { isActive: true };
  
  if (category) {
    searchQuery.category = category;
  }
  
  const permissions = await Permission.find(searchQuery).sort({ category: 1, name: 1 });
  
  return permissions;
};

// Get permissions for a specific staff member
const getStaffPermissionsFromDB = async (userUuid: string) => {
  const staffPermission = await StaffPermission.findOne({ user: userUuid });
  
  if (!staffPermission) {
    return {
      user: userUuid,
      permissions: [],
    };
  }
  
  // Get full permission details
  const permissions = await Permission.find({
    code: { $in: staffPermission.permissions },
    isActive: true,
  });
  
  return {
    user: userUuid,
    permissions: permissions,
    permissionCodes: staffPermission.permissions,
    grantedBy: staffPermission.grantedBy,
  };
};

// Assign permissions to staff member
const assignPermissionsToStaff = async (
  userUuid: string,
  payload: { permissions: string[]; grantedBy: string }
) => {
  // Verify all permission codes exist
  const validPermissions = await Permission.find({
    code: { $in: payload.permissions },
    isActive: true,
  });
  
  if (validPermissions.length !== payload.permissions.length) {
    throw new AppError(httpStatus.BAD_REQUEST, "Some permission codes are invalid");
  }
  
  // Update or create staff permissions
  const result = await StaffPermission.findOneAndUpdate(
    { user: userUuid },
    {
      user: userUuid,
      permissions: payload.permissions,
      grantedBy: payload.grantedBy,
    },
    {
      new: true,
      upsert: true,
    }
  );
  
  return result;
};

// Check if user has specific permission
const checkUserPermission = async (userUuid: string, permissionCode: string): Promise<boolean> => {
  const staffPermission = await StaffPermission.findOne({ user: userUuid });
  
  if (!staffPermission) {
    return false;
  }
  
  return staffPermission.permissions.includes(permissionCode);
};

// Check if user has any of the specified permissions
const checkUserHasAnyPermission = async (userUuid: string, permissionCodes: string[]): Promise<boolean> => {
  const staffPermission = await StaffPermission.findOne({ user: userUuid });
  
  if (!staffPermission) {
    return false;
  }
  
  return permissionCodes.some(code => staffPermission.permissions.includes(code));
};

export const PermissionServices = {
  getAllPermissionsFromDB,
  getStaffPermissionsFromDB,
  assignPermissionsToStaff,
  checkUserPermission,
  checkUserHasAnyPermission,
};
