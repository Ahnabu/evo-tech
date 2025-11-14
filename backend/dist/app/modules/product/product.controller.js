"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const product_service_1 = require("./product.service");
const getAllProducts = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const products = await product_service_1.ProductServices.getAllProductsFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Products Retrieved Successfully",
        data: products.result,
        meta: products.meta,
    });
});
const getSingleProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const product = await product_service_1.ProductServices.getSingleProductFromDB(req.params.id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Product Retrieved Successfully",
        data: product,
    });
});
const getProductBySlug = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const product = await product_service_1.ProductServices.getProductBySlugFromDB(req.params.slug);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Product Retrieved Successfully",
        data: product,
    });
});
const createProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const files = req.files;
    const mainImageBuffer = files?.mainImage?.[0]?.buffer;
    const additionalImagesBuffers = files?.additionalImages?.map((file) => file.buffer) || [];
    const result = await product_service_1.ProductServices.createProductIntoDB(req.body, mainImageBuffer, additionalImagesBuffers);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Product created successfully",
        data: result,
    });
});
const updateProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const files = req.files;
    const mainImageBuffer = files?.mainImage?.[0]?.buffer;
    const additionalImagesBuffers = files?.additionalImages?.map((file) => file.buffer) || [];
    const result = await product_service_1.ProductServices.updateProductIntoDB(id, req.body, mainImageBuffer, additionalImagesBuffers);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Product updated successfully",
        data: result,
    });
});
const deleteProduct = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    await product_service_1.ProductServices.deleteProductFromDB(id);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Product deleted successfully",
        data: null,
    });
});
// Product Images
const addProductImage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { productId } = req.params;
    const imageBuffer = req.file?.buffer;
    if (!imageBuffer) {
        throw new Error("Image file is required");
    }
    const result = await product_service_1.ProductServices.addProductImageIntoDB(productId, imageBuffer, req.body.sortOrder);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Product image added successfully",
        data: result,
    });
});
const deleteProductImage = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { imageId } = req.params;
    await product_service_1.ProductServices.deleteProductImageFromDB(imageId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Product image deleted successfully",
        data: null,
    });
});
// Feature Headers
const addFeatureHeader = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { productId } = req.params;
    const result = await product_service_1.ProductServices.addFeatureHeaderIntoDB(productId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Feature header added successfully",
        data: result,
    });
});
const updateFeatureHeader = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { headerId } = req.params;
    const result = await product_service_1.ProductServices.updateFeatureHeaderIntoDB(headerId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Feature header updated successfully",
        data: result,
    });
});
const deleteFeatureHeader = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { headerId } = req.params;
    await product_service_1.ProductServices.deleteFeatureHeaderFromDB(headerId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Feature header deleted successfully",
        data: null,
    });
});
// Feature Subsections
const addFeatureSubsection = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { productId } = req.params;
    const imageBuffer = req.file?.buffer;
    const result = await product_service_1.ProductServices.addFeatureSubsectionIntoDB(productId, req.body, imageBuffer);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Feature subsection added successfully",
        data: result,
    });
});
const updateFeatureSubsection = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { subsectionId } = req.params;
    const imageBuffer = req.file?.buffer;
    const result = await product_service_1.ProductServices.updateFeatureSubsectionIntoDB(subsectionId, req.body, imageBuffer);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Feature subsection updated successfully",
        data: result,
    });
});
const deleteFeatureSubsection = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { subsectionId } = req.params;
    await product_service_1.ProductServices.deleteFeatureSubsectionFromDB(subsectionId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Feature subsection deleted successfully",
        data: null,
    });
});
// Specifications
const addSpecification = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { productId } = req.params;
    const result = await product_service_1.ProductServices.addSpecificationIntoDB(productId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Specification added successfully",
        data: result,
    });
});
const updateSpecification = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { specId } = req.params;
    const result = await product_service_1.ProductServices.updateSpecificationIntoDB(specId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Specification updated successfully",
        data: result,
    });
});
const deleteSpecification = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const { specId } = req.params;
    await product_service_1.ProductServices.deleteSpecificationFromDB(specId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Specification deleted successfully",
        data: null,
    });
});
exports.ProductControllers = {
    getAllProducts,
    getSingleProduct,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
    addProductImage,
    deleteProductImage,
    addFeatureHeader,
    updateFeatureHeader,
    deleteFeatureHeader,
    addFeatureSubsection,
    updateFeatureSubsection,
    deleteFeatureSubsection,
    addSpecification,
    updateSpecification,
    deleteSpecification,
};
//# sourceMappingURL=product.controller.js.map