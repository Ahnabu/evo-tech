import { Types } from "mongoose";

export interface TOrder {
  _id?: string;
  orderNumber: string;
  user: string; // UUID
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  houseStreet: string;
  city: string;
  subdistrict?: string;
  postcode: string;
  country: string;
  shippingType: string;
  pickupPointId?: string;
  paymentMethod: string;
  transactionId?: string;
  terms: boolean;
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  additionalCharge: number;
  totalPayable: number;
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  notes?: string;
  trackingCode?: string;
  viewed: boolean;
  unpaidNotified: boolean;
  deliveredAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TOrderItem {
  _id?: string;
  order: Types.ObjectId;
  product: Types.ObjectId;
  productName: string;
  productPrice: number;
  quantity: number;
  selectedColor?: string;
  subtotal: number;
  createdAt?: Date;
  updatedAt?: Date;
}
