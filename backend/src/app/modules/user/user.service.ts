import { TUser } from "./user.interface";
import { User } from "./user.model";
import { Order } from "../order/order.model";

const getAllUsersFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const searchQuery: any = {};

  // Filter by userType if provided (for staff/customers separation)
  if (query.userType) {
    if (typeof query.userType === 'string' && query.userType.includes(',')) {
      // Handle comma-separated userTypes
      searchQuery.userType = { $in: query.userType.split(',').map((t: string) => t.trim()) };
    } else if (Array.isArray(query.userType)) {
      searchQuery.userType = { $in: query.userType };
    } else {
      searchQuery.userType = query.userType;
    }
  }

  // Filter by isActive status if provided
  if (query.isActive !== undefined) {
    searchQuery.isActive = query.isActive === 'true' || query.isActive === true;
  }

  if (query.search) {
    searchQuery.$or = [
      { email: { $regex: query.search, $options: "i" } },
      { firstName: { $regex: query.search, $options: "i" } },
      { lastName: { $regex: query.search, $options: "i" } },
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

const getUserDashboardStatsFromDB = async (userUuid: string) => {
  // Get user orders
  const userOrders = await Order.find({ user: userUuid });
  
  // Calculate total spent
  const totalSpent = userOrders.reduce((sum, order) => sum + (order.totalPayable || 0), 0);
  
  // Get recent orders (last 5)
  const recentOrders = await Order.find({ user: userUuid })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // Get user details for additional info
  const user = await User.findOne({ uuid: userUuid });

  return {
    totalOrders: userOrders.length,
    totalSpent,
    recentOrders: recentOrders.map(order => ({
      orderNumber: order.orderNumber,
      totalPayable: order.totalPayable,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      createdAt: order.createdAt,
    })),
    rewardPoints: user?.rewardPoints || 0,
    memberSince: user?.createdAt,
  };
};

const getUserOrdersFromDB = async (userUuid: string, query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const result = await Order.find({ user: userUuid })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Order.countDocuments({ user: userUuid });

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

const createStaffIntoDB = async (payload: Partial<TUser>) => {
  // Ensure userType is either admin or employee
  if (!payload.userType || !['admin', 'employee'].includes(payload.userType)) {
    throw new Error('Invalid userType. Must be either admin or employee');
  }

  const newStaff = await User.create(payload);
  return newStaff;
};

export const UserServices = {
  getAllUsersFromDB,
  getSingleUserFromDB,
  getSingleUserByUuidFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
  getUserDashboardStatsFromDB,
  getUserOrdersFromDB,
  createStaffIntoDB,
};
