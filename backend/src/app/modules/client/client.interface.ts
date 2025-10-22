import { Document } from "mongoose";

export interface IClient extends Document {
  name: string;
  logo: string;
  website?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
