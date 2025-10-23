import { Schema, model } from "mongoose";

export interface ISupply {
  id: string;
  productId: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  supplierName: string;
  supplierContact?: string;
  supplierEmail?: string;
  batchNumber?: string;
  expiryDate?: Date;
  receivedDate: Date;
  notes?: string;
  status: "received" | "pending" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const supplySchema = new Schema<ISupply>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    productId: {
      type: String,
      required: true,
      ref: "Product",
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    costPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    supplierName: {
      type: String,
      required: true,
    },
    supplierContact: {
      type: String,
    },
    supplierEmail: {
      type: String,
    },
    batchNumber: {
      type: String,
    },
    expiryDate: {
      type: Date,
    },
    receivedDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ["received", "pending", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const Supply = model<ISupply>("Supply", supplySchema);