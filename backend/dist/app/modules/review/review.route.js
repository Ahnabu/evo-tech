"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const review_controller_1 = require("./review.controller");
const router = express_1.default.Router();
// Configure multer for memory storage
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// Get all reviews for a product
router.get("/products/:productId/reviews", review_controller_1.ReviewControllers.getReviewsByProduct);
// Add a new review for a product (with optional image upload)
router.post("/products/:productId/reviews", upload.single("userImage"), review_controller_1.ReviewControllers.addReview);
// Update a review (with optional image upload)
router.put("/reviews/:reviewId", upload.single("userImage"), review_controller_1.ReviewControllers.updateReview);
// Delete a review
router.delete("/reviews/:reviewId", review_controller_1.ReviewControllers.deleteReview);
exports.ReviewRoutes = router;
//# sourceMappingURL=review.route.js.map