"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("./product.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const multer_config_1 = require("../../config/multer.config");
const bodyParser_1 = require("../../middlewares/bodyParser");
const router = express_1.default.Router();
// Product CRUD
router.get("/", product_controller_1.ProductControllers.getAllProducts);
router.get("/slug/:slug", product_controller_1.ProductControllers.getProductBySlug);
router.get("/:id", product_controller_1.ProductControllers.getSingleProduct);
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), multer_config_1.multerUpload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 10 },
]), bodyParser_1.parseBody, product_controller_1.ProductControllers.createProduct);
router.put("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN, user_constant_1.USER_ROLE.EMPLOYEE), multer_config_1.multerUpload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 10 },
]), bodyParser_1.parseBody, product_controller_1.ProductControllers.updateProduct);
router.delete("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), product_controller_1.ProductControllers.deleteProduct);
// Product Images
router.post("/:productId/images", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), multer_config_1.multerUpload.single("image"), bodyParser_1.parseBody, product_controller_1.ProductControllers.addProductImage);
router.delete("/images/:imageId", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), product_controller_1.ProductControllers.deleteProductImage);
// Feature Headers
router.post("/:productId/feature-headers", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), product_controller_1.ProductControllers.addFeatureHeader);
router.put("/feature-headers/:headerId", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), product_controller_1.ProductControllers.updateFeatureHeader);
router.delete("/feature-headers/:headerId", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), product_controller_1.ProductControllers.deleteFeatureHeader);
// Feature Subsections
router.post("/:productId/feature-subsections", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), multer_config_1.multerUpload.single("image"), bodyParser_1.parseBody, product_controller_1.ProductControllers.addFeatureSubsection);
router.put("/feature-subsections/:subsectionId", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), multer_config_1.multerUpload.single("image"), bodyParser_1.parseBody, product_controller_1.ProductControllers.updateFeatureSubsection);
router.delete("/feature-subsections/:subsectionId", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), product_controller_1.ProductControllers.deleteFeatureSubsection);
// Specifications
router.post("/:productId/specifications", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), product_controller_1.ProductControllers.addSpecification);
router.put("/specifications/:specId", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), product_controller_1.ProductControllers.updateSpecification);
router.delete("/specifications/:specId", (0, auth_1.default)(user_constant_1.USER_ROLE.ADMIN), product_controller_1.ProductControllers.deleteSpecification);
exports.ProductRoutes = router;
//# sourceMappingURL=product.route.js.map