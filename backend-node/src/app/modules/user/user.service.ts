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

export const UserServices = {
  getAllUsersFromDB,
  getSingleUserFromDB,
  getSingleUserByUuidFromDB,
  updateUserIntoDB,
  deleteUserFromDB,
};
