import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ProductServices } from "./product.service";

const getAllProducts = catchAsync(async (req, res) => {
  const products = await ProductServices.getAllProductsFromDB(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Products Retrieved Successfully",
    data: products.result,
    meta: products.meta,
  });
});

const getSingleProduct = catchAsync(async (req, res) => {
  const product = await ProductServices.getSingleProductFromDB(req.params.id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product Retrieved Successfully",
    data: product,
  });
});

const getProductBySlug = catchAsync(async (req, res) => {
  const product = await ProductServices.getProductBySlugFromDB(req.params.slug);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product Retrieved Successfully",
    data: product,
  });
});

const createProduct = catchAsync(async (req, res) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const mainImageBuffer = files?.mainImage?.[0]?.buffer;
  const additionalImagesBuffers =
    files?.additionalImages?.map((file) => file.buffer) || [];

  const result = await ProductServices.createProductIntoDB(
    req.body,
    mainImageBuffer,
    additionalImagesBuffers
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Product created successfully",
    data: result,
  });
});

const updateProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const mainImageBuffer = files?.mainImage?.[0]?.buffer;
  const additionalImagesBuffers =
    files?.additionalImages?.map((file) => file.buffer) || [];

  const result = await ProductServices.updateProductIntoDB(
    id,
    req.body,
    mainImageBuffer,
    additionalImagesBuffers
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product updated successfully",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req, res) => {
  const { id } = req.params;
  await ProductServices.deleteProductFromDB(id);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product deleted successfully",
    data: null,
  });
});

// Product Images
const getProductImages = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await ProductServices.getProductImagesFromDB(productId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product images retrieved successfully",
    data: result,
  });
});

const addProductImage = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const imageBuffer = req.file?.buffer;

  if (!imageBuffer) {
    throw new Error("Image file is required");
  }

  const result = await ProductServices.addProductImageIntoDB(
    productId,
    imageBuffer,
    req.body.sortOrder
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Product image added successfully",
    data: result,
  });
});

const deleteProductImage = catchAsync(async (req, res) => {
  const { imageId } = req.params;
  await ProductServices.deleteProductImageFromDB(imageId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Product image deleted successfully",
    data: null,
  });
});

// Feature Headers
const addFeatureHeader = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await ProductServices.addFeatureHeaderIntoDB(
    productId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Feature header added successfully",
    data: result,
  });
});

const updateFeatureHeader = catchAsync(async (req, res) => {
  const { headerId } = req.params;
  const result = await ProductServices.updateFeatureHeaderIntoDB(
    headerId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Feature header updated successfully",
    data: result,
  });
});

const deleteFeatureHeader = catchAsync(async (req, res) => {
  const { headerId } = req.params;
  await ProductServices.deleteFeatureHeaderFromDB(headerId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Feature header deleted successfully",
    data: null,
  });
});

// Feature Subsections
const addFeatureSubsection = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const imageBuffer = req.file?.buffer;
  const result = await ProductServices.addFeatureSubsectionIntoDB(
    productId,
    req.body,
    imageBuffer
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Feature subsection added successfully",
    data: result,
  });
});

const updateFeatureSubsection = catchAsync(async (req, res) => {
  const { subsectionId } = req.params;
  const imageBuffer = req.file?.buffer;
  const result = await ProductServices.updateFeatureSubsectionIntoDB(
    subsectionId,
    req.body,
    imageBuffer
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Feature subsection updated successfully",
    data: result,
  });
});

const deleteFeatureSubsection = catchAsync(async (req, res) => {
  const { subsectionId } = req.params;
  await ProductServices.deleteFeatureSubsectionFromDB(subsectionId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Feature subsection deleted successfully",
    data: null,
  });
});

// Specifications
const addSpecification = catchAsync(async (req, res) => {
  const { productId } = req.params;
  const result = await ProductServices.addSpecificationIntoDB(
    productId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "Specification added successfully",
    data: result,
  });
});

const updateSpecification = catchAsync(async (req, res) => {
  const { specId } = req.params;
  const result = await ProductServices.updateSpecificationIntoDB(
    specId,
    req.body
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Specification updated successfully",
    data: result,
  });
});

const deleteSpecification = catchAsync(async (req, res) => {
  const { specId } = req.params;
  await ProductServices.deleteSpecificationFromDB(specId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Specification deleted successfully",
    data: null,
  });
});

export const ProductControllers = {
  getAllProducts,
  getSingleProduct,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductImages,
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
