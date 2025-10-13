import {
  Product,
  ProductImage,
  FeaturesSectionHeader,
  FeaturesSectionSubsection,
  Specification,
} from "./product.model";
import { TProduct } from "./product.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { generateUniqueSlug } from "../../utils/slugify";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";

const getAllProductsFromDB = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const searchQuery: any = {};

  if (query.search) {
    searchQuery.$or = [
      { name: { $regex: query.search, $options: "i" } },
      { description: { $regex: query.search, $options: "i" } },
      { sku: { $regex: query.search, $options: "i" } },
    ];
  }

  if (query.category) {
    searchQuery.category = query.category;
  }

  if (query.subcategory) {
    searchQuery.subcategory = query.subcategory;
  }

  if (query.brand) {
    searchQuery.brand = query.brand;
  }

  if (query.inStock !== undefined) {
    searchQuery.inStock = query.inStock === "true";
  }

  if (query.published !== undefined) {
    searchQuery.published = query.published === "true";
  }

  if (query.isFeatured !== undefined) {
    searchQuery.isFeatured = query.isFeatured === "true";
  }

  if (query.minPrice || query.maxPrice) {
    searchQuery.price = {};
    if (query.minPrice) searchQuery.price.$gte = Number(query.minPrice);
    if (query.maxPrice) searchQuery.price.$lte = Number(query.maxPrice);
  }

  let sortOptions: any = { createdAt: -1 };
  if (query.sortBy) {
    const sortField = query.sortBy as string;
    const sortOrder = query.sortOrder === "asc" ? 1 : -1;
    sortOptions = { [sortField]: sortOrder };
  }

  const result = await Product.find(searchQuery)
    .populate("category")
    .populate("subcategory")
    .populate("brand")
    .skip(skip)
    .limit(limit)
    .sort(sortOptions);

  const total = await Product.countDocuments(searchQuery);

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

const getSingleProductFromDB = async (id: string) => {
  const product = await Product.findById(id)
    .populate("category")
    .populate("subcategory")
    .populate("brand");

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  // Get additional product data
  const images = await ProductImage.find({ product: id }).sort({
    sortOrder: 1,
  });
  const featureHeaders = await FeaturesSectionHeader.find({ product: id }).sort(
    { sortOrder: 1 }
  );
  const featureSubsections = await FeaturesSectionSubsection.find({
    product: id,
  }).sort({ sortOrder: 1 });
  const specifications = await Specification.find({ product: id }).sort({
    sortOrder: 1,
  });

  return {
    ...product.toObject(),
    images,
    featureHeaders,
    featureSubsections,
    specifications,
  };
};

const getProductBySlugFromDB = async (slug: string) => {
  const product = await Product.findOne({ slug })
    .populate("category")
    .populate("subcategory")
    .populate("brand");

  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  const images = await ProductImage.find({ product: product._id }).sort({
    sortOrder: 1,
  });
  const featureHeaders = await FeaturesSectionHeader.find({
    product: product._id,
  }).sort({ sortOrder: 1 });
  const featureSubsections = await FeaturesSectionSubsection.find({
    product: product._id,
  }).sort({ sortOrder: 1 });
  const specifications = await Specification.find({
    product: product._id,
  }).sort({ sortOrder: 1 });

  return {
    ...product.toObject(),
    images,
    featureHeaders,
    featureSubsections,
    specifications,
  };
};

const createProductIntoDB = async (
  payload: TProduct,
  mainImageBuffer?: Buffer
) => {
  payload.slug = await generateUniqueSlug(payload.name, Product);

  if (mainImageBuffer) {
    const imageUrl = await uploadToCloudinary(mainImageBuffer, "products");
    payload.mainImage = imageUrl;
  }

  const result = await Product.create(payload);
  return result;
};

const updateProductIntoDB = async (
  id: string,
  payload: Partial<TProduct>,
  mainImageBuffer?: Buffer
) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  if (payload.name && payload.name !== product.name) {
    payload.slug = await generateUniqueSlug(payload.name, Product);
  }

  if (mainImageBuffer) {
    const imageUrl = await uploadToCloudinary(mainImageBuffer, "products");
    payload.mainImage = imageUrl;
  }

  const result = await Product.findByIdAndUpdate(id, payload, { new: true })
    .populate("category")
    .populate("subcategory")
    .populate("brand");

  return result;
};

const deleteProductFromDB = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  // Delete related data
  await ProductImage.deleteMany({ product: id });
  await FeaturesSectionHeader.deleteMany({ product: id });
  await FeaturesSectionSubsection.deleteMany({ product: id });
  await Specification.deleteMany({ product: id });

  const result = await Product.findByIdAndDelete(id);
  return result;
};

// Product Images
const addProductImageIntoDB = async (
  productId: string,
  imageBuffer: Buffer,
  sortOrder: number = 0
) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  const imageUrl = await uploadToCloudinary(imageBuffer, "products");
  const result = await ProductImage.create({
    product: productId,
    imageUrl,
    sortOrder,
  });

  return result;
};

const deleteProductImageFromDB = async (imageId: string) => {
  const result = await ProductImage.findByIdAndDelete(imageId);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Product image not found");
  }
  return result;
};

// Feature Headers
const addFeatureHeaderIntoDB = async (productId: string, payload: any) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  const result = await FeaturesSectionHeader.create({
    product: productId,
    ...payload,
  });

  return result;
};

const updateFeatureHeaderIntoDB = async (headerId: string, payload: any) => {
  const result = await FeaturesSectionHeader.findByIdAndUpdate(
    headerId,
    payload,
    { new: true }
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Feature header not found");
  }
  return result;
};

const deleteFeatureHeaderFromDB = async (headerId: string) => {
  const result = await FeaturesSectionHeader.findByIdAndDelete(headerId);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Feature header not found");
  }
  return result;
};

// Feature Subsections
const addFeatureSubsectionIntoDB = async (
  productId: string,
  payload: any,
  imageBuffer?: Buffer
) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  if (imageBuffer) {
    const imageUrl = await uploadToCloudinary(imageBuffer, "products/features");
    payload.imageUrl = imageUrl;
  }

  const result = await FeaturesSectionSubsection.create({
    product: productId,
    ...payload,
  });

  return result;
};

const updateFeatureSubsectionIntoDB = async (
  subsectionId: string,
  payload: any,
  imageBuffer?: Buffer
) => {
  if (imageBuffer) {
    const imageUrl = await uploadToCloudinary(imageBuffer, "products/features");
    payload.imageUrl = imageUrl;
  }

  const result = await FeaturesSectionSubsection.findByIdAndUpdate(
    subsectionId,
    payload,
    { new: true }
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Feature subsection not found");
  }
  return result;
};

const deleteFeatureSubsectionFromDB = async (subsectionId: string) => {
  const result = await FeaturesSectionSubsection.findByIdAndDelete(
    subsectionId
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Feature subsection not found");
  }
  return result;
};

// Specifications
const addSpecificationIntoDB = async (productId: string, payload: any) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  const result = await Specification.create({
    product: productId,
    ...payload,
  });

  return result;
};

const updateSpecificationIntoDB = async (specId: string, payload: any) => {
  const result = await Specification.findByIdAndUpdate(specId, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Specification not found");
  }
  return result;
};

const deleteSpecificationFromDB = async (specId: string) => {
  const result = await Specification.findByIdAndDelete(specId);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Specification not found");
  }
  return result;
};

export const ProductServices = {
  getAllProductsFromDB,
  getSingleProductFromDB,
  getProductBySlugFromDB,
  createProductIntoDB,
  updateProductIntoDB,
  deleteProductFromDB,
  addProductImageIntoDB,
  deleteProductImageFromDB,
  addFeatureHeaderIntoDB,
  updateFeatureHeaderIntoDB,
  deleteFeatureHeaderFromDB,
  addFeatureSubsectionIntoDB,
  updateFeatureSubsectionIntoDB,
  deleteFeatureSubsectionFromDB,
  addSpecificationIntoDB,
  updateSpecificationIntoDB,
  deleteSpecificationFromDB,
};
