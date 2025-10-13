import { Types } from "mongoose";

export interface TProduct {
  _id?: string;
  name: string;
  slug: string;
  price: number;
  previousPrice?: number;
  inStock: boolean;
  features?: string[];
  colors?: string[];
  mainImage: string;
  category: Types.ObjectId;
  subcategory?: Types.ObjectId;
  brand?: Types.ObjectId;
  weight?: number;
  landingpageSectionId?: Types.ObjectId;
  landingpageSortorder?: number;
  published: boolean;
  rating?: number;
  reviewCount?: number;
  description?: string;
  shortDescription?: string;
  sku?: string;
  stock?: number;
  lowStockThreshold?: number;
  isFeatured?: boolean;
  isPreOrder?: boolean;
  preOrderDate?: Date;
  seoTitle?: string;
  seoDescription?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TProductImage {
  _id?: string;
  product: Types.ObjectId;
  imageUrl: string;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TFeaturesSectionHeader {
  _id?: string;
  product: Types.ObjectId;
  title: string;
  content?: string;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TFeaturesSectionSubsection {
  _id?: string;
  product: Types.ObjectId;
  title: string;
  content?: string;
  imageUrl?: string;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TSpecification {
  _id?: string;
  product: Types.ObjectId;
  title: string;
  value: string;
  sortOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}
