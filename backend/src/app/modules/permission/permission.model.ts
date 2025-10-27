import mongoose, { Schema } from "mongoose";

export interface IPermission {
  name: string;
  code: string;
  category: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const permissionSchema = new Schema<IPermission>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['dashboard', 'products', 'orders', 'customers', 'reports', 'settings', 'staff'],
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Permission = mongoose.model<IPermission>("Permission", permissionSchema);
