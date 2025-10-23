import { ISupply, Supply } from "./supply.model";
import { v4 as uuidv4 } from "uuid";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";

const createSupplyIntoDB = async (payload: Partial<ISupply>): Promise<ISupply> => {
  const supplyData = {
    ...payload,
    id: uuidv4(),
  };

  const result = await Supply.create(supplyData);
  return result;
};

const getAllSuppliesFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const searchQuery: any = {};

  if (query.search) {
    searchQuery.$or = [
      { supplierName: { $regex: query.search, $options: "i" } },
      { batchNumber: { $regex: query.search, $options: "i" } },
      { notes: { $regex: query.search, $options: "i" } },
    ];
  }

  if (query.productId) {
    searchQuery.productId = query.productId;
  }

  if (query.supplierName) {
    searchQuery.supplierName = { $regex: query.supplierName, $options: "i" };
  }

  const result = await Supply.find(searchQuery)
    .populate("productId")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Supply.countDocuments(searchQuery);

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

const getSingleSupplyFromDB = async (id: string): Promise<ISupply> => {
  const result = await Supply.findOne({ id }).populate("productId");

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Supply not found");
  }

  return result;
};

const updateSupplyIntoDB = async (
  id: string,
  payload: Partial<ISupply>
): Promise<ISupply> => {
  const result = await Supply.findOneAndUpdate({ id }, payload, {
    new: true,
    runValidators: true,
  }).populate("productId");

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Supply not found");
  }

  return result;
};

const deleteSupplyFromDB = async (id: string): Promise<void> => {
  const result = await Supply.findOneAndDelete({ id });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Supply not found");
  }
};

const getSuppliesByProductFromDB = async (productId: string) => {
  const result = await Supply.find({ productId }).populate("productId");
  return result;
};

const getLowStockSuppliesFromDB = async (threshold: number = 10) => {
  const result = await Supply.aggregate([
    {
      $group: {
        _id: "$productId",
        totalQuantity: { $sum: "$quantity" },
        supplies: { $push: "$$ROOT" }
      }
    },
    {
      $match: {
        totalQuantity: { $lte: threshold }
      }
    },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "id",
        as: "product"
      }
    }
  ]);

  return result;
};

export const SupplyServices = {
  createSupplyIntoDB,
  getAllSuppliesFromDB,
  getSingleSupplyFromDB,
  updateSupplyIntoDB,
  deleteSupplyFromDB,
  getSuppliesByProductFromDB,
  getLowStockSuppliesFromDB,
};