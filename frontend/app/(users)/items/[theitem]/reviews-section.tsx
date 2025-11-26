"use client";

import { useState, useEffect } from "react";
import { m, Variants } from "framer-motion";
import StarRating from "@/components/star-rating";
import axios from "@/utils/axios/axios";
import axiosErrorLogger from "@/components/error/axios_error";

interface Review {
  _id: string;
  userName: string;
  userImage?: string;
  rating: number;
  reviewText: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

const ItemReviewsSection = ({
  reviewsItemId,
  framerSectionVariants,
}: {
  reviewsItemId: string;
  framerSectionVariants: Variants;
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/products/${reviewsItemId}/reviews`);
        const reviewsData = response.data?.data || [];
        setReviews(reviewsData);
        setTotalReviews(reviewsData.length);

        // Calculate average rating
        if (reviewsData.length > 0) {
          const sum = reviewsData.reduce(
            (acc: number, review: Review) => acc + review.rating,
            0
          );
          setAverageRating(sum / reviewsData.length);
        } else {
          setAverageRating(0);
        }
      } catch (error: any) {
        axiosErrorLogger({ error });
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [reviewsItemId]);

  if (loading) {
    return (
      <m.div
        variants={framerSectionVariants}
        initial="initial"
        whileInView="visible"
        viewport={{ once: true, amount: 0.05 }}
        className="flex flex-col items-center w-full min-h-[200px] py-5 sm:pb-8 gap-2"
      >
        <div className="flex items-center justify-center w-full h-[200px]">
          <div className="w-6 h-6 border-3 border-stone-400 border-t-stone-800 rounded-full animate-spin"></div>
        </div>
      </m.div>
    );
  }

  return (
    <m.div
      variants={framerSectionVariants}
      initial="initial"
      whileInView="visible"
      viewport={{ once: true, amount: 0.05 }}
      className="flex flex-col items-center w-full min-h-[200px] py-5 sm:pb-8 gap-4"
    >
      <div className="flex flex-col items-center w-full h-fit gap-2">
        <h2 className="text-[20px] sm:text-[24px] lg:text-[28px] font-bold text-stone-800">
          Customer Reviews
        </h2>

        {totalReviews > 0 ? (
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              <span className="text-[24px] font-semibold text-stone-800">
                {averageRating.toFixed(1)}
              </span>
              <StarRating rating={averageRating} starClassName="w-5 h-5" />
            </div>
            <p className="text-[13px] text-stone-600">
              Based on {totalReviews}{" "}
              {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div>
        ) : (
          <p className="text-[14px] text-stone-600">No reviews yet</p>
        )}
      </div>

      {reviews.length > 0 && (
        <div className="flex flex-col w-full h-fit px-3 lg:px-4 gap-4 mt-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="flex flex-col w-full h-fit p-4 border border-stone-200 rounded-lg gap-3"
            >
              <div className="flex items-start gap-3">
                {review.userImage ? (
                  <img
                    src={review.userImage}
                    alt={review.userName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center">
                    <span className="text-stone-600 text-sm font-semibold">
                      {review.userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-stone-800">
                        {review.userName}
                      </p>
                      {review.isVerifiedPurchase && (
                        <span className="text-[11px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <span className="text-[12px] text-stone-500">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="mt-1">
                    <StarRating
                      rating={review.rating}
                      starClassName="w-4 h-4"
                    />
                  </div>

                  <p className="mt-2 text-[14px] text-stone-700 leading-relaxed">
                    {review.reviewText}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {reviews.length === 0 && (
        <div className="flex flex-col items-center justify-center w-full h-[150px] text-center">
          <p className="text-[14px] text-stone-600">
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      )}
    </m.div>
  );
};

export default ItemReviewsSection;
