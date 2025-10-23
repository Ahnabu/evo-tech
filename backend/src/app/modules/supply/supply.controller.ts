import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SupplyServices } from "./supply.service";

const createSupply = catchAsync(async (req, res) => {
  const result = await SupplyServices.createSupplyIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Supply created successfully",
    data: result,
  });
});

const getAllSupplies = catchAsync(async (req, res) => {
  const supplies = await SupplyServices.getAllSuppliesFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Supplies retrieved successfully",
    data: supplies.result,
    meta: supplies.meta,
  });
});

const getSingleSupply = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SupplyServices.getSingleSupplyFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Supply retrieved successfully",
    data: result,
  });
});

const updateSupply = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SupplyServices.updateSupplyIntoDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Supply updated successfully",
    data: result,
  });
});

const deleteSupply = catchAsync(async (req, res) => {
  const { id } = req.params;
  await SupplyServices.deleteSupplyFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Supply deleted successfully",
    data: null,
  });
});

const getSuppliesByProduct = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await SupplyServices.getSuppliesByProductFromDB(productId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product supplies retrieved successfully",
    data: result,
  });
});

const getLowStockSupplies = catchAsync(async (req, res) => {
  const threshold = req.query.threshold as string;
  const result = await SupplyServices.getLowStockSuppliesFromDB(
    threshold ? parseInt(threshold) : undefined
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Low stock supplies retrieved successfully",
    data: result,
  });
});

export const SupplyControllers = {
  createSupply,
  getAllSupplies,
  getSingleSupply,
  updateSupply,
  deleteSupply,
  getSuppliesByProduct,
  getLowStockSupplies,
};