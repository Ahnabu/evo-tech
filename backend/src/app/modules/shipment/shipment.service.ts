import { IShipment, Shipment } from "./shipment.model";
import { v4 as uuidv4 } from "uuid";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";

const createShipmentIntoDB = async (payload: Partial<IShipment>): Promise<IShipment> => {
  const shipmentData = {
    ...payload,
    id: uuidv4(),
    trackingNumber: payload.trackingNumber || generateTrackingNumber(),
  };

  const result = await Shipment.create(shipmentData);
  return result;
};

const getAllShipmentsFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const searchQuery: any = {};

  if (query.search) {
    searchQuery.$or = [
      { trackingNumber: { $regex: query.search, $options: "i" } },
      { carrier: { $regex: query.search, $options: "i" } },
      { "shippingAddress.fullName": { $regex: query.search, $options: "i" } },
    ];
  }

  if (query.status) {
    searchQuery.status = query.status;
  }

  if (query.carrier) {
    searchQuery.carrier = { $regex: query.carrier, $options: "i" };
  }

  if (query.orderId) {
    searchQuery.orderId = query.orderId;
  }

  const result = await Shipment.find(searchQuery)
    .populate("orderId")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await Shipment.countDocuments(searchQuery);

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

const getSingleShipmentFromDB = async (id: string): Promise<IShipment> => {
  const result = await Shipment.findOne({ id }).populate("orderId");

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Shipment not found");
  }

  return result;
};

const getShipmentByTrackingNumberFromDB = async (trackingNumber: string): Promise<IShipment> => {
  const result = await Shipment.findOne({ trackingNumber }).populate("orderId");

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Shipment not found with this tracking number");
  }

  return result;
};

const updateShipmentIntoDB = async (
  id: string,
  payload: Partial<IShipment>
): Promise<IShipment> => {
  // If status is being updated to 'delivered', set actualDeliveryDate
  if (payload.status === "delivered" && !payload.actualDeliveryDate) {
    payload.actualDeliveryDate = new Date();
  }

  const result = await Shipment.findOneAndUpdate({ id }, payload, {
    new: true,
    runValidators: true,
  }).populate("orderId");

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Shipment not found");
  }

  return result;
};

const deleteShipmentFromDB = async (id: string): Promise<void> => {
  const result = await Shipment.findOneAndDelete({ id });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Shipment not found");
  }
};

const getShipmentsByOrderFromDB = async (orderId: string) => {
  const result = await Shipment.find({ orderId }).populate("orderId");
  return result;
};

const getShipmentStatsFromDB = async () => {
  const stats = await Shipment.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: null,
        statusCounts: {
          $push: {
            status: "$_id",
            count: "$count"
          }
        },
        totalShipments: { $sum: "$count" }
      }
    }
  ]);

  return stats[0] || { statusCounts: [], totalShipments: 0 };
};

// Helper function to generate tracking number
const generateTrackingNumber = (): string => {
  const prefix = "EVT";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};

export const ShipmentServices = {
  createShipmentIntoDB,
  getAllShipmentsFromDB,
  getSingleShipmentFromDB,
  getShipmentByTrackingNumberFromDB,
  updateShipmentIntoDB,
  deleteShipmentFromDB,
  getShipmentsByOrderFromDB,
  getShipmentStatsFromDB,
};