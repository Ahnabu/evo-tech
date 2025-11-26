import express from "express";
import multer from "multer";
import { ReviewControllers } from "./review.controller";

const router = express.Router();

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Get all reviews for a product
router.get(
  "/products/:productId/reviews",
  ReviewControllers.getReviewsByProduct
);

// Add a new review for a product (with optional image upload)
router.post(
  "/products/:productId/reviews",
  upload.single("userImage"),
  ReviewControllers.addReview
);

// Update a review (with optional image upload)
router.put(
  "/reviews/:reviewId",
  upload.single("userImage"),
  ReviewControllers.updateReview
);

// Delete a review
router.delete("/reviews/:reviewId", ReviewControllers.deleteReview);

export const ReviewRoutes = router;
