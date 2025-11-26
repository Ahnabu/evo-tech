import { Review } from "./review.model";
import { Product } from "../product/product.model";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { uploadToCloudinary } from "../../utils/cloudinaryUpload";

const getReviewsByProductFromDB = async (productId: string) => {
  const reviews = await Review.find({ product: productId }).sort({
    createdAt: -1,
  });
  return reviews;
};

const addReviewIntoDB = async (
  productId: string,
  payload: any,
  imageBuffer?: Buffer
) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new AppError(httpStatus.NOT_FOUND, "Product not found");
  }

  if (imageBuffer) {
    const imageUrl = await uploadToCloudinary(imageBuffer, "reviews");
    payload.userImage = imageUrl;
  }

  const review = await Review.create({
    product: productId,
    ...payload,
  });

  // Update product rating and review count
  const reviews = await Review.find({ product: productId });
  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await Product.findByIdAndUpdate(productId, {
    rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    reviewCount: reviews.length,
  });

  return review;
};

const updateReviewIntoDB = async (
  reviewId: string,
  payload: any,
  imageBuffer?: Buffer
) => {
  if (imageBuffer) {
    const imageUrl = await uploadToCloudinary(imageBuffer, "reviews");
    payload.userImage = imageUrl;
  }

  const review = await Review.findByIdAndUpdate(reviewId, payload, {
    new: true,
  });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }

  // Update product rating
  const reviews = await Review.find({ product: review.product });
  const averageRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  await Product.findByIdAndUpdate(review.product, {
    rating: Math.round(averageRating * 10) / 10,
    reviewCount: reviews.length,
  });

  return review;
};

const deleteReviewFromDB = async (reviewId: string) => {
  const review = await Review.findByIdAndDelete(reviewId);
  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, "Review not found");
  }

  // Update product rating
  const reviews = await Review.find({ product: review.product });
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  await Product.findByIdAndUpdate(review.product, {
    rating: Math.round(averageRating * 10) / 10,
    reviewCount: reviews.length,
  });

  return review;
};

export const ReviewServices = {
  getReviewsByProductFromDB,
  addReviewIntoDB,
  updateReviewIntoDB,
  deleteReviewFromDB,
};
