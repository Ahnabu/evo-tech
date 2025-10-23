import { TUser } from "./user.interface";
import { User } from "./user.model";
import { Order } from "../order/order.model";

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

export const UserServices = {
  getAllUsersFromDB,
  getSingleUserFromDB,
  getSingleUserByUuidFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
  getUserDashboardStatsFromDB,
  getUserOrdersFromDB,
};
