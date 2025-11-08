"use client";

import { useEffect, useState, useRef } from "react";
import axios from "@/utils/axios/axios";
import CategoryCard from "@/components/cards/categorycard";
import axiosErrorLogger from "@/components/error/axios_error";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
  isActive: boolean;
  sortOrder?: number;
}

const FeaturedCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const swiperRef = useRef<SwiperType | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories");
        console.log(response);
        const data = response?.data?.data || [];
        // Sort by sortOrder
        const sortedCategories = data.sort(
          (a: Category, b: Category) => (a.sortOrder || 0) - (b.sortOrder || 0)
        );
        setCategories(sortedCategories);
      } catch (error) {
        axiosErrorLogger({ error });
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    // Skeleton row for categories
    return (
      <section className="w-full py-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-stone-800 mb-2">&nbsp;</h2>
              <p className="text-stone-600 max-w-2xl">&nbsp;</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`cat-skel-${i}`}
                className="animate-pulse bg-white rounded-[10px] overflow-hidden p-4"
              >
                <div className="w-full h-36 bg-stone-200 rounded-md mb-4" />
                <div className="h-4 bg-stone-200 rounded w-3/4 mb-2" />
                <div className="h-3 bg-stone-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12 sm:py-16 ">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12">
        {/* Section Header with Navigation */}
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-stone-800 mb-2">
              Popular Categories
            </h2>
            <p className="text-stone-600 max-w-2xl">
              Explore our wide range of products across different categories
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white border-2 border-stone-200 hover:border-brand-600 hover:bg-brand-50 transition-all duration-300 group"
              aria-label="Previous categories"
            >
              <IoChevronBackOutline className="w-6 h-6 text-stone-600 group-hover:text-brand-600" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-white border-2 border-stone-200 hover:border-brand-600 hover:bg-brand-50 transition-all duration-300 group"
              aria-label="Next categories"
            >
              <IoChevronForwardOutline className="w-6 h-6 text-stone-600 group-hover:text-brand-600" />
            </button>
          </div>
        </div>

        {/* Categories Slider */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={24}
            slidesPerView={2}
            slidesPerGroup={1}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            speed={800}
            loop={categories.length > 6}
            breakpoints={{
              640: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 4,
                spaceBetween: 24,
              },
              1280: {
                slidesPerView: 6,
                spaceBetween: 24,
              },
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            className="category-swiper"
          >
            {categories.map((category) => (
              <SwiperSlide key={category._id}>
                <CategoryCard
                  id={category._id}
                  name={category.name}
                  slug={category.slug}
                  image={category.image}
                  description={category.description}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Mobile Navigation Arrows */}
          <div className="flex md:hidden items-center justify-center gap-3 mt-6">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-600 text-white hover:bg-brand-700 transition-all duration-300"
              aria-label="Previous categories"
            >
              <IoChevronBackOutline className="w-5 h-5" />
            </button>
            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-600 text-white hover:bg-brand-700 transition-all duration-300"
              aria-label="Next categories"
            >
              <IoChevronForwardOutline className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
