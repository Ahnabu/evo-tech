export interface TBrand {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  isActive: boolean;
  sortOrder?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
