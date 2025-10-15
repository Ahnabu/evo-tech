import { Category } from "./category.model";
import { TCategory } from "./category.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { generateUniqueSlug } from "../../utils/slugify";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinaryUpload";

const getAllCategoriesFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const searchQuery: any = {};

  if (query.search) {
    searchQuery.name = { $regex: query.search, $options: "i" };
  }

  if (query.isActive !== undefined) {
    searchQuery.isActive = query.isActive === "true";
  }

  const result = await Category.find(searchQuery)
    .skip(skip)
    .limit(limit)
    .sort({ sortOrder: 1, createdAt: -1 });

  const total = await Category.countDocuments(searchQuery);

  return {
    result,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getSingleCategoryFromDB = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }
  return category;
};

const getCategoryBySlugFromDB = async (slug: string) => {
  const category = await Category.findOne({ slug });
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }
  return category;
};

const createCategoryIntoDB = async (
  payload: TCategory,
  imageBuffer?: Buffer
) => {
  // Generate unique slug
  payload.slug = await generateUniqueSlug(payload.name, Category);

  // Upload image if provided
  if (imageBuffer) {
    const imageUrl = await uploadToCloudinary(imageBuffer, "categories");
    payload.image = imageUrl;
  }

  const result = await Category.create(payload);
  return result;
};

const updateCategoryIntoDB = async (
  id: string,
  payload: Partial<TCategory>,
  imageBuffer?: Buffer
) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  // Update slug if name changed
  if (payload.name && payload.name !== category.name) {
    payload.slug = await generateUniqueSlug(payload.name, Category);
  }

  // Upload new image if provided
  if (imageBuffer) {
    const imageUrl = await uploadToCloudinary(imageBuffer, "categories");
    payload.image = imageUrl;
  }

  const result = await Category.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteCategoryFromDB = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError(httpStatus.NOT_FOUND, "Category not found");
  }

  const result = await Category.findByIdAndDelete(id);
  return result;
};

export const CategoryServices = {
  getAllCategoriesFromDB,
  getSingleCategoryFromDB,
  getCategoryBySlugFromDB,
  createCategoryIntoDB,
  updateCategoryIntoDB,
  deleteCategoryFromDB,
};
