import { Brand } from "./brand.model";
import { TBrand } from "./brand.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { generateUniqueSlug } from "../../utils/slugify";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";

const getAllBrandsFromDB = async (query: Record<string, unknown>) => {
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

  const result = await Brand.find(searchQuery)
    .skip(skip)
    .limit(limit)
    .sort({ sortOrder: 1, createdAt: -1 });

  const total = await Brand.countDocuments(searchQuery);

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

const getSingleBrandFromDB = async (id: string) => {
  const brand = await Brand.findById(id);
  if (!brand) {
    throw new AppError(httpStatus.NOT_FOUND, "Brand not found");
  }
  return brand;
};

const getBrandBySlugFromDB = async (slug: string) => {
  const brand = await Brand.findOne({ slug });
  if (!brand) {
    throw new AppError(httpStatus.NOT_FOUND, "Brand not found");
  }
  return brand;
};

const createBrandIntoDB = async (payload: TBrand, logoBuffer?: Buffer) => {
  payload.slug = await generateUniqueSlug(payload.name, Brand);

  if (logoBuffer) {
    const logoUrl = await uploadToCloudinary(logoBuffer, "brands");
    payload.logo = logoUrl;
  }

  const result = await Brand.create(payload);
  return result;
};

const updateBrandIntoDB = async (
  id: string,
  payload: Partial<TBrand>,
  logoBuffer?: Buffer
) => {
  const brand = await Brand.findById(id);
  if (!brand) {
    throw new AppError(httpStatus.NOT_FOUND, "Brand not found");
  }

  if (payload.name && payload.name !== brand.name) {
    payload.slug = await generateUniqueSlug(payload.name, Brand);
  }

  if (logoBuffer) {
    const logoUrl = await uploadToCloudinary(logoBuffer, "brands");
    payload.logo = logoUrl;
  }

  const result = await Brand.findByIdAndUpdate(id, payload, { new: true });
  return result;
};

const deleteBrandFromDB = async (id: string) => {
  const brand = await Brand.findById(id);
  if (!brand) {
    throw new AppError(httpStatus.NOT_FOUND, "Brand not found");
  }

  const result = await Brand.findByIdAndDelete(id);
  return result;
};

export const BrandServices = {
  getAllBrandsFromDB,
  getSingleBrandFromDB,
  getBrandBySlugFromDB,
  createBrandIntoDB,
  updateBrandIntoDB,
  deleteBrandFromDB,
};
