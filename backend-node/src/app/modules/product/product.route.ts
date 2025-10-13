import express from "express";
import { ProductControllers } from "./product.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import { multerUpload } from "../../config/multer.config";
import { parseBody } from "../../middlewares/bodyParser";

const router = express.Router();

// Product CRUD
router.get("/", ProductControllers.getAllProducts);
router.get("/slug/:slug", ProductControllers.getProductBySlug);
router.get("/:id", ProductControllers.getSingleProduct);
router.post(
  "/",
  auth(USER_ROLE.ADMIN),
  multerUpload.single("mainImage"),
  parseBody,
  ProductControllers.createProduct
);
router.put(
  "/:id",
  auth(USER_ROLE.ADMIN),
  multerUpload.single("mainImage"),
  parseBody,
  ProductControllers.updateProduct
);
router.delete("/:id", auth(USER_ROLE.ADMIN), ProductControllers.deleteProduct);

// Product Images
router.post(
  "/:productId/images",
  auth(USER_ROLE.ADMIN),
  multerUpload.single("image"),
  parseBody,
  ProductControllers.addProductImage
);
router.delete(
  "/images/:imageId",
  auth(USER_ROLE.ADMIN),
  ProductControllers.deleteProductImage
);

// Feature Headers
router.post(
  "/:productId/feature-headers",
  auth(USER_ROLE.ADMIN),
  ProductControllers.addFeatureHeader
);
router.put(
  "/feature-headers/:headerId",
  auth(USER_ROLE.ADMIN),
  ProductControllers.updateFeatureHeader
);
router.delete(
  "/feature-headers/:headerId",
  auth(USER_ROLE.ADMIN),
  ProductControllers.deleteFeatureHeader
);

// Feature Subsections
router.post(
  "/:productId/feature-subsections",
  auth(USER_ROLE.ADMIN),
  multerUpload.single("image"),
  parseBody,
  ProductControllers.addFeatureSubsection
);
router.put(
  "/feature-subsections/:subsectionId",
  auth(USER_ROLE.ADMIN),
  multerUpload.single("image"),
  parseBody,
  ProductControllers.updateFeatureSubsection
);
router.delete(
  "/feature-subsections/:subsectionId",
  auth(USER_ROLE.ADMIN),
  ProductControllers.deleteFeatureSubsection
);

// Specifications
router.post(
  "/:productId/specifications",
  auth(USER_ROLE.ADMIN),
  ProductControllers.addSpecification
);
router.put(
  "/specifications/:specId",
  auth(USER_ROLE.ADMIN),
  ProductControllers.updateSpecification
);
router.delete(
  "/specifications/:specId",
  auth(USER_ROLE.ADMIN),
  ProductControllers.deleteSpecification
);

export const ProductRoutes = router;
