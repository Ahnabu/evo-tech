import { TUser } from "./user.interface";
import { User } from "./user.model";

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const searchQuery: any = {};

  if (query.search) {
    searchQuery.$or = [
      { email: { $regex: query.search, $options: "i" } },
      { firstname: { $regex: query.search, $options: "i" } },
      { lastname: { $regex: query.search, $options: "i" } },
    ];
  }

  const result = await User.find(searchQuery)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(searchQuery);

  return {
    result,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getSingleUserFromDB = async (id: string) => {
  const user = await User.findById(id);
  return user;
};

const getSingleUserByUuidFromDB = async (uuid: string) => {
  const user = await User.findOne({ uuid });
  return user;
};

const updateUserIntoDB = async (payload: Partial<TUser>, id: string) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });

  return result;
};

const deleteUserFromDB = async (id: string) => {
  const result = await User.findByIdAndDelete(id);
  return result;
};

// Customer management functions for admin
const getAllCustomersFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const searchQuery: any = { role: "USER" }; // Only get customers, not admins

  if (query.search) {
    searchQuery.$or = [
      { email: { $regex: query.search, $options: "i" } },
      { firstname: { $regex: query.search, $options: "i" } },
      { lastname: { $regex: query.search, $options: "i" } },
    ];
  }

  if (query.status) {
    searchQuery.isDeleted = query.status === "active" ? false : true;
  }

  const result = await User.find(searchQuery)
    .select("-password")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(searchQuery);

  return {
    result,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getCustomerStatsFromDB = async () => {
  const totalCustomers = await User.countDocuments({ role: "USER", isDeleted: false });
  const activeCustomers = await User.countDocuments({ 
    role: "USER", 
    isDeleted: false,
    updatedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Active in last 30 days
  });
  const newCustomersThisMonth = await User.countDocuments({
    role: "USER",
    isDeleted: false,
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  });

  return {
    totalCustomers,
    activeCustomers,
    newCustomersThisMonth,
  };
};

const updateCustomerStatusFromDB = async (id: string, isDeleted: boolean) => {
  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted },
    { new: true }
  ).select("-password");
  
  return result;
};

// Staff management functions for admin
const getAllStaffsFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const searchQuery: any = { role: "ADMIN" }; // Only get staff members

  if (query.search) {
    searchQuery.$or = [
      { email: { $regex: query.search, $options: "i" } },
      { firstname: { $regex: query.search, $options: "i" } },
      { lastname: { $regex: query.search, $options: "i" } },
    ];
  }

  if (query.status) {
    searchQuery.isDeleted = query.status === "active" ? false : true;
  }

  const result = await User.find(searchQuery)
    .select("-password")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(searchQuery);

  return {
    result,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getStaffStatsFromDB = async () => {
  const totalStaffs = await User.countDocuments({ role: "ADMIN", isDeleted: false });
  const activeStaffs = await User.countDocuments({ 
    role: "ADMIN", 
    isDeleted: false,
    updatedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Active in last 30 days
  });
  const newStaffsThisMonth = await User.countDocuments({
    role: "ADMIN",
    isDeleted: false,
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
  });

  return {
    totalStaffs,
    activeStaffs,
    newStaffsThisMonth,
  };
};

const createStaffFromDB = async (payload: Partial<TUser>) => {
  const staffData = {
    ...payload,
    role: "ADMIN", // Ensure staff has admin role
  };

  const result = await User.create(staffData);
  return result;
};

const updateStaffRoleFromDB = async (id: string, role: string) => {
  const result = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true }
  ).select("-password");
  
  return result;
};

const updateStaffStatusFromDB = async (id: string, isDeleted: boolean) => {
  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted },
    { new: true }
  ).select("-password");
  
  return result;
};

export const UserServices = {
  getAllUsersFromDB,
  getSingleUserFromDB,
  getSingleUserByUuidFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
  getAllCustomersFromDB,
  getCustomerStatsFromDB,
  updateCustomerStatusFromDB,
  getAllStaffsFromDB,
  getStaffStatsFromDB,
  createStaffFromDB,
  updateStaffRoleFromDB,
  updateStaffStatusFromDB,
};
