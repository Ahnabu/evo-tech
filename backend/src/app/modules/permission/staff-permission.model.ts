import mongoose, { Schema } from "mongoose";

export interface IStaffPermission {
  user: string; // user UUID
  permissions: string[]; // array of permission codes
  grantedBy: string; // admin who granted permissions
  createdAt: Date;
  updatedAt: Date;
}

const staffPermissionSchema = new Schema<IStaffPermission>(
  {
    user: {
      type: String,
      required: true,
      unique: true,
      ref: "User",
    },
    permissions: [{
      type: String,
      required: true,
    }],
    grantedBy: {
      type: String,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const StaffPermission = mongoose.model<IStaffPermission>("StaffPermission", staffPermissionSchema);
