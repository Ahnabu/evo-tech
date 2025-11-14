"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrandServices = void 0;
const brand_model_1 = require("./brand.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const slugify_1 = require("../../utils/slugify");
const cloudinaryUpload_1 = require("../../utils/cloudinaryUpload");
const getAllBrandsFromDB = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchQuery = {};
    if (query.search) {
        searchQuery.name = { $regex: query.search, $options: "i" };
    }
    if (query.isActive !== undefined) {
        searchQuery.isActive = query.isActive === "true";
    }
    const result = await brand_model_1.Brand.find(searchQuery)
        .skip(skip)
        .limit(limit)
        .sort({ sortOrder: 1, createdAt: -1 });
    const total = await brand_model_1.Brand.countDocuments(searchQuery);
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
const getSingleBrandFromDB = async (id) => {
    const brand = await brand_model_1.Brand.findById(id);
    if (!brand) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Brand not found");
    }
    return brand;
};
const getBrandBySlugFromDB = async (slug) => {
    const brand = await brand_model_1.Brand.findOne({ slug });
    if (!brand) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Brand not found");
    }
    return brand;
};
const createBrandIntoDB = async (payload, logoBuffer) => {
    payload.slug = await (0, slugify_1.generateUniqueSlug)(payload.name, brand_model_1.Brand);
    if (logoBuffer) {
        const logoUrl = await (0, cloudinaryUpload_1.uploadToCloudinary)(logoBuffer, "brands");
        payload.logo = logoUrl;
    }
    const result = await brand_model_1.Brand.create(payload);
    return result;
};
const updateBrandIntoDB = async (id, payload, logoBuffer) => {
    const brand = await brand_model_1.Brand.findById(id);
    if (!brand) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Brand not found");
    }
    if (payload.name && payload.name !== brand.name) {
        payload.slug = await (0, slugify_1.generateUniqueSlug)(payload.name, brand_model_1.Brand);
    }
    if (logoBuffer) {
        const logoUrl = await (0, cloudinaryUpload_1.uploadToCloudinary)(logoBuffer, "brands");
        payload.logo = logoUrl;
    }
    const result = await brand_model_1.Brand.findByIdAndUpdate(id, payload, { new: true });
    return result;
};
const deleteBrandFromDB = async (id) => {
    const brand = await brand_model_1.Brand.findById(id);
    if (!brand) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Brand not found");
    }
    const result = await brand_model_1.Brand.findByIdAndDelete(id);
    return result;
};
exports.BrandServices = {
    getAllBrandsFromDB,
    getSingleBrandFromDB,
    getBrandBySlugFromDB,
    createBrandIntoDB,
    updateBrandIntoDB,
    deleteBrandFromDB,
};
//# sourceMappingURL=brand.service.js.map