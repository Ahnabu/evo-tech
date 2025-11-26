"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductServices = void 0;
const product_model_1 = require("./product.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const slugify_1 = require("../../utils/slugify");
const cloudinaryUpload_1 = require("../../utils/cloudinaryUpload");
const brand_model_1 = require("../brand/brand.model");
const category_model_1 = require("../category/category.model");
const subcategory_model_1 = require("../subcategory/subcategory.model");
const mongoose_1 = require("mongoose");
const notification_service_1 = require("../notification/notification.service");
const getAllProductsFromDB = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchQuery = {};
    if (query.search) {
        searchQuery.$or = [
            { name: { $regex: query.search, $options: "i" } },
            { description: { $regex: query.search, $options: "i" } },
            { sku: { $regex: query.search, $options: "i" } },
        ];
    }
    // Handle category - accept both ObjectId and slug
    if (query.category) {
        if (mongoose_1.Types.ObjectId.isValid(query.category)) {
            searchQuery.category = query.category;
        }
        else {
            // Look up category by slug
            const category = await category_model_1.Category.findOne({
                slug: query.category,
            });
            if (category) {
                searchQuery.category = category._id;
            }
        }
    }
    // Handle subcategory - accept both ObjectId and slug
    if (query.subcategory) {
        if (mongoose_1.Types.ObjectId.isValid(query.subcategory)) {
            searchQuery.subcategory = query.subcategory;
        }
        else {
            // Look up subcategory by slug
            const subcategory = await subcategory_model_1.Subcategory.findOne({
                slug: query.subcategory,
            });
            if (subcategory) {
                searchQuery.subcategory = subcategory._id;
            }
        }
    }
    // Handle brand - accept both ObjectId and slug
    if (query.brand) {
        if (mongoose_1.Types.ObjectId.isValid(query.brand)) {
            searchQuery.brand = query.brand;
        }
        else {
            // Look up brand by slug
            const brand = await brand_model_1.Brand.findOne({ slug: query.brand });
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
        if (query.minPrice)
            searchQuery.price.$gte = Number(query.minPrice);
        if (query.maxPrice)
            searchQuery.price.$lte = Number(query.maxPrice);
    }
    let sortOptions = { createdAt: -1 };
    if (query.sortBy) {
        const sortField = query.sortBy;
        const sortOrder = query.sortOrder === "asc" ? 1 : -1;
        sortOptions = { [sortField]: sortOrder };
    }
    const result = await product_model_1.Product.find(searchQuery)
        .populate("category")
        .populate("subcategory")
        .populate("brand")
        .skip(skip)
        .limit(limit)
        .sort(sortOptions);
    const total = await product_model_1.Product.countDocuments(searchQuery);
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
const getSingleProductFromDB = async (id) => {
    const product = await product_model_1.Product.findById(id)
        .populate("category")
        .populate("subcategory")
        .populate("brand");
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    // Get additional product data
    const images = await product_model_1.ProductImage.find({ product: id }).sort({
        sortOrder: 1,
    });
    const featureHeaders = await product_model_1.FeaturesSectionHeader.find({ product: id }).sort({ sortOrder: 1 });
    const featureSubsections = await product_model_1.FeaturesSectionSubsection.find({
        product: id,
    }).sort({ sortOrder: 1 });
    const specifications = await product_model_1.Specification.find({ product: id }).sort({
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
const getProductBySlugFromDB = async (slug) => {
    const product = await product_model_1.Product.findOne({ slug })
        .populate("category")
        .populate("subcategory")
        .populate("brand");
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    const images = await product_model_1.ProductImage.find({ product: product._id }).sort({
        sortOrder: 1,
    });
    const featureHeaders = await product_model_1.FeaturesSectionHeader.find({
        product: product._id,
    }).sort({ sortOrder: 1 });
    const featureSubsections = await product_model_1.FeaturesSectionSubsection.find({
        product: product._id,
    }).sort({ sortOrder: 1 });
    const specifications = await product_model_1.Specification.find({
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
const createProductIntoDB = async (payload, mainImageBuffer, additionalImagesBuffers) => {
    payload.slug = await (0, slugify_1.generateUniqueSlug)(payload.name, product_model_1.Product);
    if (mainImageBuffer) {
        const imageUrl = await (0, cloudinaryUpload_1.uploadToCloudinary)(mainImageBuffer, "products");
        payload.mainImage = imageUrl;
    }
    // Convert string values to numbers where needed
    if (payload.price)
        payload.price = Number(payload.price);
    if (payload.previousPrice)
        payload.previousPrice = Number(payload.previousPrice);
    if (payload.weight)
        payload.weight = Number(payload.weight);
    if (payload.stock)
        payload.stock = Number(payload.stock);
    // Convert boolean string to actual boolean
    if (typeof payload.inStock === "string") {
        payload.inStock = payload.inStock === "true";
    }
    if (typeof payload.published === "string") {
        payload.published = payload.published === "true";
    }
    // Handle brand - if it's a slug, look up the brand ObjectId
    if (payload.brand &&
        typeof payload.brand === "string" &&
        !mongoose_1.Types.ObjectId.isValid(payload.brand)) {
        const brand = await brand_model_1.Brand.findOne({ slug: payload.brand });
        if (brand) {
            payload.brand = brand._id;
        }
        else {
            // If brand not found, remove it from payload (it's optional)
            delete payload.brand;
        }
    }
    const result = await product_model_1.Product.create(payload);
    // Upload additional images and create ProductImage documents
    if (additionalImagesBuffers && additionalImagesBuffers.length > 0) {
        for (let i = 0; i < additionalImagesBuffers.length; i++) {
            const imageUrl = await (0, cloudinaryUpload_1.uploadToCloudinary)(additionalImagesBuffers[i], "products");
            await product_model_1.ProductImage.create({
                product: result._id,
                imageUrl,
                sortOrder: i + 1,
            });
        }
    }
    await notification_service_1.NotificationServices.evaluateStockForProduct(result._id);
    return result;
};
const updateProductIntoDB = async (id, payload, mainImageBuffer, additionalImagesBuffers) => {
    const product = await product_model_1.Product.findById(id);
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    // Convert string values to numbers where needed
    if (payload.price)
        payload.price = Number(payload.price);
    if (payload.previousPrice)
        payload.previousPrice = Number(payload.previousPrice);
    if (payload.weight)
        payload.weight = Number(payload.weight);
    if (payload.stock)
        payload.stock = Number(payload.stock);
    if (payload.lowStockThreshold)
        payload.lowStockThreshold = Number(payload.lowStockThreshold);
    if (payload.preOrderPrice)
        payload.preOrderPrice = Number(payload.preOrderPrice);
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
    if (payload.subcategory === "" ||
        payload.subcategory === null ||
        payload.subcategory === undefined) {
        delete payload.subcategory;
    }
    if (payload.brand === "" ||
        payload.brand === null ||
        payload.brand === undefined) {
        delete payload.brand;
    }
    if (payload.landingpageSectionId === "" ||
        payload.landingpageSectionId === null ||
        payload.landingpageSectionId === undefined) {
        delete payload.landingpageSectionId;
    }
    // Validate ObjectIds for category, subcategory, and brand
    if (payload.category) {
        if (typeof payload.category === "string" &&
            !mongoose_1.Types.ObjectId.isValid(payload.category)) {
            const category = await category_model_1.Category.findOne({ slug: payload.category });
            if (category) {
                payload.category = category._id;
            }
            else {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Invalid category");
            }
        }
    }
    if (payload.subcategory) {
        if (typeof payload.subcategory === "string" &&
            !mongoose_1.Types.ObjectId.isValid(payload.subcategory)) {
            const subcategory = await subcategory_model_1.Subcategory.findOne({
                slug: payload.subcategory,
            });
            if (subcategory) {
                payload.subcategory = subcategory._id;
            }
            else {
                delete payload.subcategory;
            }
        }
    }
    if (payload.brand) {
        if (typeof payload.brand === "string" &&
            !mongoose_1.Types.ObjectId.isValid(payload.brand)) {
            const brand = await brand_model_1.Brand.findOne({ slug: payload.brand });
            if (brand) {
                payload.brand = brand._id;
            }
            else {
                delete payload.brand;
            }
        }
    }
    if (payload.name && payload.name !== product.name) {
        payload.slug = await (0, slugify_1.generateUniqueSlug)(payload.name, product_model_1.Product);
    }
    // Handle setting an existing image as the new main image
    if (payload.newMainFromExisting) {
        const imageId = payload.newMainFromExisting;
        const existingImage = await product_model_1.ProductImage.findById(imageId);
        if (existingImage && existingImage.product.toString() === id) {
            payload.mainImage = existingImage.imageUrl;
            // Remove this image from ProductImage collection since it's now the main image
            await product_model_1.ProductImage.findByIdAndDelete(imageId);
        }
        delete payload.newMainFromExisting;
    }
    // Handle new main image upload
    if (mainImageBuffer) {
        const imageUrl = await (0, cloudinaryUpload_1.uploadToCloudinary)(mainImageBuffer, "products");
        payload.mainImage = imageUrl;
    }
    // Handle removing images
    if (payload.removeImages && Array.isArray(payload.removeImages)) {
        const imagesToRemove = payload.removeImages;
        for (const imageId of imagesToRemove) {
            await product_model_1.ProductImage.findByIdAndDelete(imageId);
        }
        delete payload.removeImages;
    }
    const result = await product_model_1.Product.findByIdAndUpdate(id, payload, { new: true })
        .populate("category")
        .populate("subcategory")
        .populate("brand");
    // Upload additional images if provided
    if (additionalImagesBuffers && additionalImagesBuffers.length > 0) {
        const existingImagesCount = await product_model_1.ProductImage.countDocuments({
            product: id,
        });
        for (let i = 0; i < additionalImagesBuffers.length; i++) {
            const imageUrl = await (0, cloudinaryUpload_1.uploadToCloudinary)(additionalImagesBuffers[i], "products");
            await product_model_1.ProductImage.create({
                product: id,
                imageUrl,
                sortOrder: existingImagesCount + i + 1,
            });
        }
    }
    if (result) {
        await notification_service_1.NotificationServices.evaluateStockForProduct(result._id);
    }
    return result;
};
const deleteProductFromDB = async (id) => {
    const product = await product_model_1.Product.findById(id);
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    // Delete related data
    await product_model_1.ProductImage.deleteMany({ product: id });
    await product_model_1.FeaturesSectionHeader.deleteMany({ product: id });
    await product_model_1.FeaturesSectionSubsection.deleteMany({ product: id });
    await product_model_1.Specification.deleteMany({ product: id });
    const result = await product_model_1.Product.findByIdAndDelete(id);
    return result;
};
// Product Images
const getProductImagesFromDB = async (productId) => {
    const product = await product_model_1.Product.findById(productId);
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    const images = await product_model_1.ProductImage.find({ product: productId }).sort({
        sortOrder: 1,
    });
    return images;
};
const addProductImageIntoDB = async (productId, imageBuffer, sortOrder = 0) => {
    const product = await product_model_1.Product.findById(productId);
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    const imageUrl = await (0, cloudinaryUpload_1.uploadToCloudinary)(imageBuffer, "products");
    const result = await product_model_1.ProductImage.create({
        product: productId,
        imageUrl,
        sortOrder,
    });
    return result;
};
const deleteProductImageFromDB = async (imageId) => {
    const result = await product_model_1.ProductImage.findByIdAndDelete(imageId);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product image not found");
    }
    return result;
};
// Feature Headers
const addFeatureHeaderIntoDB = async (productId, payload) => {
    const product = await product_model_1.Product.findById(productId);
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    const result = await product_model_1.FeaturesSectionHeader.create({
        product: productId,
        ...payload,
    });
    return result;
};
const updateFeatureHeaderIntoDB = async (headerId, payload) => {
    const result = await product_model_1.FeaturesSectionHeader.findByIdAndUpdate(headerId, payload, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Feature header not found");
    }
    return result;
};
const deleteFeatureHeaderFromDB = async (headerId) => {
    const result = await product_model_1.FeaturesSectionHeader.findByIdAndDelete(headerId);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Feature header not found");
    }
    return result;
};
// Feature Subsections
const addFeatureSubsectionIntoDB = async (productId, payload, imageBuffer) => {
    const product = await product_model_1.Product.findById(productId);
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    if (imageBuffer) {
        const imageUrl = await (0, cloudinaryUpload_1.uploadToCloudinary)(imageBuffer, "products/features");
        payload.imageUrl = imageUrl;
    }
    const result = await product_model_1.FeaturesSectionSubsection.create({
        product: productId,
        ...payload,
    });
    return result;
};
const updateFeatureSubsectionIntoDB = async (subsectionId, payload, imageBuffer) => {
    if (imageBuffer) {
        const imageUrl = await (0, cloudinaryUpload_1.uploadToCloudinary)(imageBuffer, "products/features");
        payload.imageUrl = imageUrl;
    }
    const result = await product_model_1.FeaturesSectionSubsection.findByIdAndUpdate(subsectionId, payload, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Feature subsection not found");
    }
    return result;
};
const deleteFeatureSubsectionFromDB = async (subsectionId) => {
    const result = await product_model_1.FeaturesSectionSubsection.findByIdAndDelete(subsectionId);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Feature subsection not found");
    }
    return result;
};
// Specifications
const addSpecificationIntoDB = async (productId, payload) => {
    const product = await product_model_1.Product.findById(productId);
    if (!product) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Product not found");
    }
    const result = await product_model_1.Specification.create({
        product: productId,
        ...payload,
    });
    return result;
};
const updateSpecificationIntoDB = async (specId, payload) => {
    const result = await product_model_1.Specification.findByIdAndUpdate(specId, payload, {
        new: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Specification not found");
    }
    return result;
};
const deleteSpecificationFromDB = async (specId) => {
    const result = await product_model_1.Specification.findByIdAndDelete(specId);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Specification not found");
    }
    return result;
};
exports.ProductServices = {
    getAllProductsFromDB,
    getSingleProductFromDB,
    getProductBySlugFromDB,
    createProductIntoDB,
    updateProductIntoDB,
    deleteProductFromDB,
    getProductImagesFromDB,
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
//# sourceMappingURL=product.service.js.map