import { Schema, model } from "mongoose";

export interface ICoupon {
  id: string;
  code: string;
  name: string;
  type: "percentage" | "fixed_amount";
  value: number;
  minimumOrderAmount?: number;
  maximumDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  applicableProducts?: string[];
  applicableCategories?: string[];
  excludedProducts?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IFlashDeal {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  discountType: "percentage" | "fixed_amount";
  discountValue: number;
  products: {
    productId: string;
    originalPrice: number;
    discountedPrice: number;
    stock?: number;
  }[];
  isActive: boolean;
  banner?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscriber {
  id: string;
  email: string;
  name?: string;
  status: "active" | "inactive" | "unsubscribed";
  subscribedAt: Date;
  unsubscribedAt?: Date;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface INewsletter {
  id: string;
  subject: string;
  content: string;
  htmlContent?: string;
  status: "draft" | "scheduled" | "sent";
  scheduledAt?: Date;
  sentAt?: Date;
  sentTo: string[];
  openCount: number;
  clickCount: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["percentage", "fixed_amount"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    minimumOrderAmount: {
      type: Number,
      min: 0,
    },
    maximumDiscountAmount: {
      type: Number,
      min: 0,
    },
    usageLimit: {
      type: Number,
      min: 0,
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    validFrom: {
      type: Date,
      required: true,
    },
    validUntil: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    applicableProducts: [{
      type: String,
      ref: "Product",
    }],
    applicableCategories: [{
      type: String,
      ref: "Category",
    }],
    excludedProducts: [{
      type: String,
      ref: "Product",
    }],
  },
  {
    timestamps: true,
  }
);

const flashDealSchema = new Schema<IFlashDeal>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    discountType: {
      type: String,
      enum: ["percentage", "fixed_amount"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    products: [{
      productId: {
        type: String,
        ref: "Product",
        required: true,
      },
      originalPrice: {
        type: Number,
        required: true,
        min: 0,
      },
      discountedPrice: {
        type: Number,
        required: true,
        min: 0,
      },
      stock: {
        type: Number,
        min: 0,
      },
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    banner: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const subscriberSchema = new Schema<ISubscriber>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "unsubscribed"],
      default: "active",
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    unsubscribedAt: {
      type: Date,
    },
    tags: [{
      type: String,
    }],
  },
  {
    timestamps: true,
  }
);

const newsletterSchema = new Schema<INewsletter>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    subject: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    htmlContent: {
      type: String,
    },
    status: {
      type: String,
      enum: ["draft", "scheduled", "sent"],
      default: "draft",
    },
    scheduledAt: {
      type: Date,
    },
    sentAt: {
      type: Date,
    },
    sentTo: [{
      type: String,
    }],
    openCount: {
      type: Number,
      default: 0,
    },
    clickCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: String,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Coupon = model<ICoupon>("Coupon", couponSchema);
export const FlashDeal = model<IFlashDeal>("FlashDeal", flashDealSchema);
export const Subscriber = model<ISubscriber>("Subscriber", subscriberSchema);
export const Newsletter = model<INewsletter>("Newsletter", newsletterSchema);