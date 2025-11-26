import { Types } from "mongoose";

export interface TReview {
  _id?: string;
  product: Types.ObjectId;
  userName: string;
  userImage?: string;
  rating: number;
  reviewText: string;
  isVerifiedPurchase?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
