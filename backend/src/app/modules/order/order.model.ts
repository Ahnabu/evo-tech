import { Schema, model } from "mongoose";
import { TOrder, TOrderItem } from "./order.interface";
import { v4 as uuidv4 } from "uuid";

const orderSchema = new Schema<TOrder>(
  {
    orderNumber: {
      type: String,
      unique: true,
      default: () =>
        `ORD-${Date.now()}-${uuidv4().substring(0, 8).toUpperCase()}`,
    },
    user: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    houseStreet: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    subdistrict: {
      type: String,
    },
    postcode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      default: "Bangladesh",
    },
    shippingType: {
      type: String,
      required: true,
    },
    pickupPointId: {
      type: String,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
    },
    terms: {
      type: Boolean,
      required: true,
      default: false,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    deliveryCharge: {
      type: Number,
      default: 0,
    },
    additionalCharge: {
      type: Number,
      default: 0,
    },
    totalPayable: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    notes: {
      type: String,
    },
    trackingCode: {
      type: String,
    },
    viewed: {
      type: Boolean,
      default: false,
    },
    unpaidNotified: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const orderItemSchema = new Schema<TOrderItem>(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    selectedColor: {
      type: String,
    },
    subtotal: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Order = model<TOrder>("Order", orderSchema);
export const OrderItem = model<TOrderItem>("OrderItem", orderItemSchema);
