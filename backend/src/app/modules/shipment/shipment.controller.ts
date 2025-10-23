import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ShipmentServices } from "./shipment.service";

const createShipment = catchAsync(async (req, res) => {
  const result = await ShipmentServices.createShipmentIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Shipment created successfully",
    data: result,
  });
});

const getAllShipments = catchAsync(async (req, res) => {
  const shipments = await ShipmentServices.getAllShipmentsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Shipments retrieved successfully",
    data: shipments.result,
    meta: shipments.meta,
  });
});

const getSingleShipment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ShipmentServices.getSingleShipmentFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Shipment retrieved successfully",
    data: result,
  });
});

const getShipmentByTrackingNumber = catchAsync(async (req, res) => {
  const { trackingNumber } = req.params;
  const result = await ShipmentServices.getShipmentByTrackingNumberFromDB(trackingNumber);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Shipment retrieved successfully",
    data: result,
  });
});

const updateShipment = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ShipmentServices.updateShipmentIntoDB(id, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Shipment updated successfully",
    data: result,
  });
});

const deleteShipment = catchAsync(async (req, res) => {
  const { id } = req.params;
  await ShipmentServices.deleteShipmentFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Shipment deleted successfully",
    data: null,
  });
});

const getShipmentsByOrder = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const result = await ShipmentServices.getShipmentsByOrderFromDB(orderId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Order shipments retrieved successfully",
    data: result,
  });
});

const getShipmentStats = catchAsync(async (req, res) => {
  const result = await ShipmentServices.getShipmentStatsFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Shipment statistics retrieved successfully",
    data: result,
  });
});

export const ShipmentControllers = {
  createShipment,
  getAllShipments,
  getSingleShipment,
  getShipmentByTrackingNumber,
  updateShipment,
  deleteShipment,
  getShipmentsByOrder,
  getShipmentStats,
};