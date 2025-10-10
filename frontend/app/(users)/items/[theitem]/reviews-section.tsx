"use client";

import { useState, useEffect } from 'react';
import { m, Variants } from 'framer-motion';
import StarRating from '@/components/star-rating';
import StarRatingChart from '@/components/star-rating-chart';
import ReviewItem from '@/components/review_item/review-item';
import { sumOfNumArrValues, calcMeanRating } from '@/utils/essential_functions';
import useSWR from 'swr';
import axios from '@/utils/axios/axios';
import axiosErrorLogger from '@/components/error/axios_error';
import EvoPagination from "@/components/ui/evo_pagination";
import EvoDropdown from '@/components/ui/evo_dropdown';
import { DropdownItem } from "@nextui-org/dropdown";


const ItemReviewsSection = ({ reviewsItemId, framerSectionVariants }: { reviewsItemId: string; framerSectionVariants: Variants; }) => {
    const [reviewsDataLocal, setReviewsDataLocal] = useState<any>({ reviews_count_perstar: [0, 0, 0, 0, 0], reviews_data: [] });
    const [reviewsPage, setReviewsPage] = useState<number>(1);
    const [reviewsSortBy, setReviewsSortBy] = useState<string>("mosthelpful");

    const { data: reviews, } = useSWR([reviewsItemId, reviewsPage, reviewsSortBy],
        async ([itemId, pageno, sortBy]) => {
            const response = await axios.get(`/api/item/${itemId}/reviews?page=${pageno}&sortby=${sortBy}`)
                .then((res: any) => res.data)
                .catch((error: any) => {
                    axiosErrorLogger({ error });
                    return null;
                });

            return response;
        },
        {
            refreshInterval: 60000,
            revalidateOnFocus: false,
        }
    );

    useEffect(() => {
        if (reviews && reviews.reviewsalldata) {
            setReviewsDataLocal({
                ...reviews.reviewsalldata,
                reviews_count_perstar: reviews.reviewsalldata.reviews_count_perstar ? reviews.reviewsalldata.reviews_count_perstar : [0, 0, 0, 0, 0],
                reviews_data: reviews.reviewsalldata.reviews_data?.length > 0 ? reviews.reviewsalldata.reviews_data : [],
            });
        }
    }, [reviews]);



    return (
        <m.div
            variants={framerSectionVariants}
            initial="initial"
            whileInView="visible"
            viewport={{ once: true, amount: 0.05 }}
            className="flex flex-col items-center w-full min-h-[200px] py-5 sm:pb-8 gap-2"
        >
            <div className="flex flex-wrap justify-center w-fit max-w-full h-fit gap-x-3 sm:gap-x-4 gap-y-2">
                <div className="flex flex-col items-center w-fit max-w-full h-fit gap-1">
                    <p className="w-fit h-fit text-center text-[20px] leading-7 sm:text-[23px] sm:leading-8 lg:text-[28px] lg:leading-10 tracking-tight font-[600] text-stone-800">{calcMeanRating(reviewsDataLocal.reviews_count_perstar)}</p>
                    <StarRating rating={calcMeanRating(reviewsDataLocal.reviews_count_perstar)} starClassName="sm:w-[15px] sm:h-[15px] lg:w-[16px] lg:h-[16px]" />
                    <p className="w-fit h-fit text-[12px] sm:text-[13px] leading-5 font-[400] text-stone-600">{`${sumOfNumArrValues(reviewsDataLocal.reviews_count_perstar)} reviews`}</p>
                </div>

                <div className="flex w-fit max-w-full h-fit">
                    <StarRatingChart reviewsCountPerStarArray={reviewsDataLocal.reviews_count_perstar} />
                </div>
            </div>

            <div className="flex flex-col items-center w-full h-fit px-2 pt-3 pb-1 gap-2">
                <button type="button" aria-label="write a review" className="flex w-fit h-fit px-3 py-1.5 sm:py-2 text-[12px] sm:text-[13px] leading-5 font-[500] text-stone-50 bg-[#0866FF] hover:bg-[#0855FF] rounded-[8px]">
                    Write a review
                </button>

                {reviewsDataLocal.reviews_data.length > 0 &&
                    <div className="flex justify-end w-full h-fit mt-4 gap-2">
                        <EvoDropdown
                            dropdownLabel="Sort By"
                            onKeyChange={(key) => {
                                if (key === reviewsSortBy) return;
                                setReviewsSortBy(key);
                                setReviewsPage(1);
                            }}
                            selectedKey={reviewsSortBy}
                            ariaLabelForMenu="sort reviews by"
                            dropdownTriggerClassName="max-w-[120px] w-full h-fit"
                        >
                            <DropdownItem key="mosthelpful">Most Helpful</DropdownItem>
                            <DropdownItem key="newest">Newest</DropdownItem>
                        </EvoDropdown>
                    </div>
                }
            </div>

            <div className="flex flex-col w-full h-fit px-3 lg:px-4 my-5">
                {reviewsDataLocal.reviews_data.length > 0 &&
                    reviewsDataLocal.reviews_data.map((review: any, index: number) => (
                        <ReviewItem key={`review_item${index}`} individualreview={review} />
                    ))
                }
            </div>

            {reviewsDataLocal.reviews_data.length > 0 && reviewsDataLocal.current_page && reviewsDataLocal.last_page &&
                <div className="w-full h-fit flex justify-center py-3 mt-4">
                    <EvoPagination
                        paginationProps={{
                            currentPage: reviewsDataLocal.current_page,
                            lastPage: reviewsDataLocal.last_page,
                            onChange: (page: number) => {
                                setReviewsPage(page);
                            }
                        }}
                    />
                </div>
            }
        </m.div>
    );
}

export default ItemReviewsSection;
