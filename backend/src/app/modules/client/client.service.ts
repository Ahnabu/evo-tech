import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { Client } from "./client.model";
import { IClient } from "./client.interface";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";

// Create a new client
const createClientIntoDB = async (
  payload: Partial<IClient>,
  file: Express.Multer.File
) => {
  // Upload logo to Cloudinary
  const uploadResult = await uploadToCloudinary(
    file.buffer,
    `clients/${Date.now()}`
  );

  if (!uploadResult) {
    throw new AppError(httpStatus.BAD_REQUEST, "Logo upload failed");
  }

  payload.logo = uploadResult;

  const result = await Client.create(payload);
  return result;
};

// Get all active clients for public display
const getActiveClientsFromDB = async () => {
  const result = await Client.find({ isActive: true }).sort({ sortOrder: 1 });
  return result;
};

// Get all clients (admin)
const getAllClientsFromDB = async () => {
  const result = await Client.find().sort({ sortOrder: 1 });
  return result;
};

// Get single client by ID
const getSingleClientFromDB = async (id: string) => {
  const result = await Client.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Client not found");
  }

  return result;
};

// Update client
const updateClientIntoDB = async (
  id: string,
  payload: Partial<IClient>,
  file?: Express.Multer.File
) => {
  const client = await Client.findById(id);

  if (!client) {
    throw new AppError(httpStatus.NOT_FOUND, "Client not found");
  }

  // Upload new logo if provided
  if (file) {
    const uploadResult = await uploadToCloudinary(
      file.buffer,
      `clients/${Date.now()}`
    );

    if (!uploadResult) {
      throw new AppError(httpStatus.BAD_REQUEST, "Logo upload failed");
    }

    payload.logo = uploadResult;
  }

  const result = await Client.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

// Delete client
const deleteClientFromDB = async (id: string) => {
  const client = await Client.findById(id);

  if (!client) {
    throw new AppError(httpStatus.NOT_FOUND, "Client not found");
  }

  const result = await Client.findByIdAndDelete(id);
  return result;
};

// Toggle client active status
const toggleClientStatus = async (id: string) => {
  const client = await Client.findById(id);

  if (!client) {
    throw new AppError(httpStatus.NOT_FOUND, "Client not found");
  }

  const result = await Client.findByIdAndUpdate(
    id,
    { isActive: !client.isActive },
    { new: true }
  );

  return result;
};

export const ClientService = {
  createClientIntoDB,
  getActiveClientsFromDB,
  getAllClientsFromDB,
  getSingleClientFromDB,
  updateClientIntoDB,
  deleteClientFromDB,
  toggleClientStatus,
};
