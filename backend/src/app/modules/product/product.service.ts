import {
  Product,
  ProductImage,
  FeaturesSectionHeader,
  FeaturesSectionSubsection,
  Specification,
  ProductColorVariation,
} from "./product.model";
import { TProduct } from "./product.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { generateUniqueSlug } from "../../utils/slugify";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";
import { Brand } from "../brand/brand.model";
import { Category } from "../category/category.model";
import { Subcategory } from "../subcategory/subcategory.model";
import { LandingSection } from "../landingsection/landingsection.model";
import { Types } from "mongoose";
import { NotificationServices } from "../notification/notification.service";

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

  // Handle category - accept both ObjectId and slug
  if (query.category) {
    if (Types.ObjectId.isValid(query.category as string)) {
      searchQuery.category = query.category;
    } else {
      // Look up category by slug
      const category = await Category.findOne({
        slug: query.category as string,
      });
      if (category) {
        searchQuery.category = category._id;
      }
    }
  }

  // Handle subcategory - accept both ObjectId and slug
  if (query.subcategory) {
    if (Types.ObjectId.isValid(query.subcategory as string)) {
      searchQuery.subcategory = query.subcategory;
    } else {
      // Look up subcategory by slug
      const subcategory = await Subcategory.findOne({
        slug: query.subcategory as string,
      });
      if (subcategory) {
        searchQuery.subcategory = subcategory._id;
      }
    }
  }

  // Handle brand - accept both ObjectId and slug
  if (query.brand) {
    if (Types.ObjectId.isValid(query.brand as string)) {
      searchQuery.brand = query.brand;
    } else {
      // Look up brand by slug
      const brand = await Brand.findOne({ slug: query.brand as string });
      if (brand) {
        searchQuery.brand = brand._id;
      }
    }
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
  const colorVariations = await ProductColorVariation.find({
    product: id,
  }).sort({
    sortOrder: 1,
  });

  return {
    ...product.toObject(),
    images,
    featureHeaders,
    featureSubsections,
    specifications,
    colorVariations,
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
  const colorVariations = await ProductColorVariation.find({
    product: product._id,
  }).sort({ sortOrder: 1 });

  return {
    ...product.toObject(),
    images,
    featureHeaders,
    featureSubsections,
    specifications,
    colorVariations,
  };
};

const createProductIntoDB = async (
  payload: any,
  mainImageBuffer?: Buffer,
  additionalImagesBuffers?: Buffer[]
) => {
  payload.slug = await generateUniqueSlug(payload.name, Product);

  if (mainImageBuffer) {
    const imageUrl = await uploadToCloudinary(mainImageBuffer, "products");
    payload.mainImage = imageUrl;
  }

  // Convert string values to numbers where needed
  if (payload.price) payload.price = Number(payload.price);
  if (payload.previousPrice)
    payload.previousPrice = Number(payload.previousPrice);
  if (payload.weight) payload.weight = Number(payload.weight);
  if (payload.stock) payload.stock = Number(payload.stock);

  // Convert boolean string to actual boolean
  if (typeof payload.inStock === "string") {
    payload.inStock = payload.inStock === "true";
  }
  if (typeof payload.published === "string") {
    payload.published = payload.published === "true";
  }

  // Handle category - if it's a slug, look up the category ObjectId
  if (
    payload.category &&
    typeof payload.category === "string" &&
    !Types.ObjectId.isValid(payload.category)
  ) {
    const category = await Category.findOne({ slug: payload.category });
    if (!category) {
      throw new AppError(httpStatus.NOT_FOUND, "Category not found");
    }
    payload.category = category._id;
  }

  // Handle subcategory - if it's a slug, look up the subcategory ObjectId
  if (
    payload.subcategory &&
    typeof payload.subcategory === "string" &&
    !Types.ObjectId.isValid(payload.subcategory)
  ) {
    const subcategory = await Subcategory.findOne({
      slug: payload.subcategory,
    });
    if (subcategory) {
      payload.subcategory = subcategory._id;
    } else {
      // If subcategory not found, remove it from payload (it's optional)
      delete payload.subcategory;
    }
  }

  // Handle brand - if it's a slug, look up the brand ObjectId
  if (
    payload.brand &&
    typeof payload.brand === "string" &&
    !Types.ObjectId.isValid(payload.brand)
  ) {
    const brand = await Brand.findOne({ slug: payload.brand });
    if (brand) {
      payload.brand = brand._id;
    } else {
      // If brand not found, remove it from payload (it's optional)
      delete payload.brand;
    }
  }

  // Handle colors - if it's an array of objects, separate them for ProductColorVariation
  let colorsToCreate: any[] = [];
  if (
    payload.colors &&
    Array.isArray(payload.colors) &&
    payload.colors.length > 0
  ) {
    // Check if the first item is an object (not string)
    if (typeof payload.colors[0] === "object") {
      colorsToCreate = payload.colors;
      delete payload.colors; // Remove from product payload so it doesn't try to save to string[] field
    }
  }

  const result = await Product.create(payload);

  // create ProductColorVariation documents
  if (colorsToCreate.length > 0) {
    for (let i = 0; i < colorsToCreate.length; i++) {
      await ProductColorVariation.create({
        product: result._id,
        colorName: colorsToCreate[i].colorName,
        colorCode: colorsToCreate[i].colorCode,
        stock: Number(colorsToCreate[i].stock) || 0,
        sortOrder: i + 1,
      });
    }
  }

  // Upload additional images and create ProductImage documents
  if (additionalImagesBuffers && additionalImagesBuffers.length > 0) {
    for (let i = 0; i < additionalImagesBuffers.length; i++) {
      const imageUrl = await uploadToCloudinary(
        additionalImagesBuffers[i],
        "products"
      );
      await ProductImage.create({
        product: result._id,
        imageUrl,
        sortOrder: i + 1,
      });
    }
  }

  // If product is assigned to a landing section, add it to the section's products array
  if (result.landingpageSectionId) {
    await LandingSection.findByIdAndUpdate(result.landingpageSectionId, {
      $addToSet: { products: result._id },
    });
  }

  await NotificationServices.evaluateStockForProduct(result._id);

  return result;
};

const updateProductIntoDB = async (
  id: string,
  payload: Partial<TProduct>,
  mainImageBuffer?: Buffer,
  additionalImagesBuffers?: Buffer[]
) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  // Convert string values to numbers where needed
  if (payload.price) payload.price = Number(payload.price);
  if (payload.previousPrice)
    payload.previousPrice = Number(payload.previousPrice);
  if (payload.weight) payload.weight = Number(payload.weight);
  if (payload.stock) payload.stock = Number(payload.stock);
  if (payload.lowStockThreshold)
    payload.lowStockThreshold = Number(payload.lowStockThreshold);
  if (payload.preOrderPrice)
    payload.preOrderPrice = Number(payload.preOrderPrice);
  if (payload.buyingPrice) payload.buyingPrice = Number(payload.buyingPrice);

  // Convert boolean strings to actual booleans
  if (typeof payload.inStock === "string") {
    payload.inStock = payload.inStock === "true";
  }
  if (typeof payload.published === "string") {
    payload.published = payload.published === "true";
  }
  if (typeof payload.isFeatured === "string") {
    payload.isFeatured = payload.isFeatured === "true";
  }
  if (typeof payload.isPreOrder === "string") {
    payload.isPreOrder = payload.isPreOrder === "true";
  }

  // Handle empty strings for optional ObjectId fields - remove them
  if (
    (payload.subcategory as any) === "" ||
    payload.subcategory === null ||
    payload.subcategory === undefined
  ) {
    delete payload.subcategory;
  }
  if (
    (payload.brand as any) === "" ||
    payload.brand === null ||
    payload.brand === undefined
  ) {
    delete payload.brand;
  }
  if (
    (payload.landingpageSectionId as any) === "" ||
    payload.landingpageSectionId === null ||
    payload.landingpageSectionId === undefined
  ) {
    delete payload.landingpageSectionId;
  }

  // Validate ObjectIds for category, subcategory, and brand
  if (payload.category) {
    if (
      typeof payload.category === "string" &&
      !Types.ObjectId.isValid(payload.category)
    ) {
      const category = await Category.findOne({ slug: payload.category });
      if (category) {
        payload.category = category._id as any;
      } else {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid category");
      }
    }
  }

  if (payload.subcategory) {
    if (
      typeof payload.subcategory === "string" &&
      !Types.ObjectId.isValid(payload.subcategory as string)
    ) {
      const subcategory = await Subcategory.findOne({
        slug: payload.subcategory as string,
      });
      if (subcategory) {
        payload.subcategory = subcategory._id as any;
      } else {
        delete payload.subcategory;
      }
    }
  }

  if (payload.brand) {
    if (
      typeof payload.brand === "string" &&
      !Types.ObjectId.isValid(payload.brand as string)
    ) {
      const brand = await Brand.findOne({ slug: payload.brand as string });
      if (brand) {
        payload.brand = brand._id as any;
      } else {
        delete payload.brand;
      }
    }
  }

  if (payload.name && payload.name !== product.name) {
    payload.slug = await generateUniqueSlug(payload.name, Product);
  }

  // Handle setting an existing image as the new main image
  if ((payload as any).newMainFromExisting) {
    const imageId = (payload as any).newMainFromExisting;
    const existingImage = await ProductImage.findById(imageId);
    if (existingImage && existingImage.product.toString() === id) {
      payload.mainImage = existingImage.imageUrl;
      // Remove this image from ProductImage collection since it's now the main image
      await ProductImage.findByIdAndDelete(imageId);
    }
    delete (payload as any).newMainFromExisting;
  }

  // Handle new main image upload
  if (mainImageBuffer) {
    const imageUrl = await uploadToCloudinary(mainImageBuffer, "products");
    payload.mainImage = imageUrl;
  }

  // Handle removing images
  if (
    (payload as any).removeImages &&
    Array.isArray((payload as any).removeImages)
  ) {
    const imagesToRemove = (payload as any).removeImages;
    for (const imageId of imagesToRemove) {
      await ProductImage.findByIdAndDelete(imageId);
    }
    delete (payload as any).removeImages;
  }

  // Handle landingpageSectionId changes - maintain two-way relationship
  const oldSectionId = product.landingpageSectionId?.toString();
  const newSectionId = payload.landingpageSectionId?.toString();

  // If the section assignment changed
  if (oldSectionId !== newSectionId) {
    // Remove product from old section
    if (oldSectionId) {
      await LandingSection.findByIdAndUpdate(oldSectionId, {
        $pull: { products: id },
      });
    }

    // Add product to new section
    if (newSectionId && newSectionId !== "") {
      await LandingSection.findByIdAndUpdate(newSectionId, {
        $addToSet: { products: id }, // $addToSet prevents duplicates
      });
    }
  }

  const result = await Product.findByIdAndUpdate(id, payload, { new: true })
    .populate("category")
    .populate("subcategory")
    .populate("brand");

  // Upload additional images if provided
  if (additionalImagesBuffers && additionalImagesBuffers.length > 0) {
    const existingImagesCount = await ProductImage.countDocuments({
      product: id,
    });
    for (let i = 0; i < additionalImagesBuffers.length; i++) {
      const imageUrl = await uploadToCloudinary(
        additionalImagesBuffers[i],
        "products"
      );
      await ProductImage.create({
        product: id,
        imageUrl,
        sortOrder: existingImagesCount + i + 1,
      });
    }
  }

  if (result) {
    await NotificationServices.evaluateStockForProduct(result._id);
  }

  return result;
};

const deleteProductFromDB = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  // Remove product from its landing section if assigned
  if (product.landingpageSectionId) {
    await LandingSection.findByIdAndUpdate(product.landingpageSectionId, {
      $pull: { products: id },
    });
    console.log(`Removed deleted product ${id} from section ${product.landingpageSectionId}`);
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
const getProductImagesFromDB = async (productId: string) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  const images = await ProductImage.find({ product: productId }).sort({
    sortOrder: 1,
  });
  return images;
};

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
const getFeatureHeadersFromDB = async (productId: string) => {
  const result = await FeaturesSectionHeader.find({ product: productId }).sort({
    sortOrder: 1,
  });
  return result;
};

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
const getFeatureSubsectionsFromDB = async (productId: string) => {
  const result = await FeaturesSectionSubsection.find({
    product: productId,
  }).sort({ sortOrder: 1 });
  return result;
};

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
const getSpecificationsFromDB = async (productId: string) => {
  const result = await Specification.find({ product: productId }).sort({
    sortOrder: 1,
  });
  return result;
};

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

// Color Variations
const getColorVariationsFromDB = async (productId: string) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  const colorVariations = await ProductColorVariation.find({
    product: productId,
  }).sort({ sortOrder: 1 });

  return colorVariations;
};

const addColorVariationIntoDB = async (productId: string, payload: any) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  const result = await ProductColorVariation.create({
    product: productId,
    ...payload,
  });

  return result;
};

const updateColorVariationIntoDB = async (colorId: string, payload: any) => {
  const result = await ProductColorVariation.findByIdAndUpdate(
    colorId,
    payload,
    {
      new: true,
    }
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Color variation not found");
  }
  return result;
};

const deleteColorVariationFromDB = async (colorId: string) => {
  const result = await ProductColorVariation.findByIdAndDelete(colorId);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Color variation not found");
  }
  return result;
};

// Get all unique colors from color variations
const getAllUniqueColorsFromDB = async () => {
  const colors = await ProductColorVariation.aggregate([
    {
      $group: {
        _id: {
          colorName: "$colorName",
          colorCode: "$colorCode",
        },
      },
    },
    {
      $project: {
        _id: 0,
        colorName: "$_id.colorName",
        colorCode: "$_id.colorCode",
      },
    },
    {
      $sort: { colorName: 1 },
    },
  ]);

  return colors;
};

// Featured Sections (Homepage Sections)
const getAllFeaturedSectionsFromDB = async () => {
  console.log("=== Backend: getAllFeaturedSectionsFromDB ===");
  
  const result = await LandingSection.find()
    .sort({ sortOrder: 1 })
    .populate("category", "name slug")
    .populate("subcategory", "name slug")
    .populate({
      path: "products",
      select: "name slug price previousPrice mainImage",
    })
    .lean(); // Add lean() to get plain JavaScript objects

  console.log("Total sections found:", result.length);
  result.forEach((section: any, index: number) => {
    console.log(`\nSection ${index + 1}:`, section.title);
    console.log("  - ID:", section._id);
    console.log("  - isActive:", section.isActive);
    console.log("  - Products array length:", section.products?.length || 0);
    console.log("  - Products:", JSON.stringify(section.products, null, 2));
  });

  return result;
};

const createFeaturedSectionIntoDB = async (payload: any) => {
  const result = await LandingSection.create(payload);
  return result;
};

const updateFeaturedSectionIntoDB = async (id: string, payload: any) => {
  const section = await LandingSection.findById(id);

  if (!section) {
    throw new AppError(httpStatus.NOT_FOUND, "Featured section not found");
  }

  const result = await LandingSection.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return result;
};

const deleteFeaturedSectionFromDB = async (id: string) => {
  const section = await LandingSection.findById(id);

  if (!section) {
    throw new AppError(httpStatus.NOT_FOUND, "Featured section not found");
  }

  const result = await LandingSection.findByIdAndDelete(id);
  return result;
};

export const ProductServices = {
  getAllProductsFromDB,
  getSingleProductFromDB,
  getProductBySlugFromDB,
  createProductIntoDB,
  updateProductIntoDB,
  deleteProductFromDB,
  getProductImagesFromDB,
  addProductImageIntoDB,
  deleteProductImageFromDB,
  getFeatureHeadersFromDB,
  addFeatureHeaderIntoDB,
  updateFeatureHeaderIntoDB,
  deleteFeatureHeaderFromDB,
  getFeatureSubsectionsFromDB,
  addFeatureSubsectionIntoDB,
  updateFeatureSubsectionIntoDB,
  deleteFeatureSubsectionFromDB,
  getSpecificationsFromDB,
  addSpecificationIntoDB,
  updateSpecificationIntoDB,
  deleteSpecificationFromDB,
  getColorVariationsFromDB,
  addColorVariationIntoDB,
  updateColorVariationIntoDB,
  deleteColorVariationFromDB,
  getAllUniqueColorsFromDB,
  getAllFeaturedSectionsFromDB,
  createFeaturedSectionIntoDB,
  updateFeaturedSectionIntoDB,
  deleteFeaturedSectionFromDB,
};
