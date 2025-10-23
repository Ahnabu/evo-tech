import { Schema, model } from "mongoose";

export interface IShipment {
  id: string;
  orderId: string;
  trackingNumber: string;
  carrier: string;
  shippingMethod: "regular_delivery" | "express_delivery" | "pickup_point";
  status: "pending" | "picked_up" | "in_transit" | "out_for_delivery" | "delivered" | "failed" | "returned";
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  estimatedDeliveryDate?: Date;
  actualDeliveryDate?: Date;
  shippingCost: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const shipmentSchema = new Schema<IShipment>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    orderId: {
      type: String,
      required: true,
      ref: "Order",
    },
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
    },
    carrier: {
      type: String,
      required: true,
    },
    shippingMethod: {
      type: String,
      enum: ["regular_delivery", "express_delivery", "pickup_point"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "picked_up", "in_transit", "out_for_delivery", "delivered", "failed", "returned"],
      default: "pending",
    },
    shippingAddress: {
      fullName: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
        default: "Bangladesh",
      },
    },
    estimatedDeliveryDate: {
      type: Date,
    },
    actualDeliveryDate: {
      type: Date,
    },
    shippingCost: {
      type: Number,
      required: true,
      min: 0,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Shipment = model<IShipment>("Shipment", shipmentSchema);