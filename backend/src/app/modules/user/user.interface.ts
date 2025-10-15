import { Model } from "mongoose";

export interface TUser {
  _id?: string;
  uuid: string;
  userType: "admin" | "user";
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  phone?: string;
  defaultShippingAddressId?: string;
  defaultBillingAddressId?: string;
  emailVerifiedAt?: Date;
  lastActiveAt?: Date;
  rewardPoints?: number;
  newsletterOptIn?: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserModel extends Model<TUser> {
  isUserExistsByEmail(email: string): Promise<TUser | null>;
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
}
