"use client";

import "swiper/css/bundle";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { HiArrowRight } from "react-icons/hi2";

const BannerCarousel = ({
  uniqueid,
  slides,
}: {
  uniqueid: string;
  slides: any[];
}) => {
  const pagination = {
    clickable: true,
    el: `#${uniqueid} .sw-custom-pagination`,
    renderBullet: function (index: number, className: string) {
      return `<span class="${className}"></span>`;
    },
  };

  const navigation = {
    prevEl: `#${uniqueid} .sw-custom-prev-bttn`,
    nextEl: `#${uniqueid} .sw-custom-next-bttn`,
  };

  return (
    <>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        slidesPerView={1}
        spaceBetween={0}
        autoplay={{
          delay: 6000,
          disableOnInteraction: false,
        }}
        speed={1000}
        loop={slides.length >= 2}
        grabCursor
        navigation={navigation}
        pagination={pagination}
        id={uniqueid}
        className="w-full h-full group/swiperbttn"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={`slide${index}`} className="relative w-full h-full">
            <div className="relative w-full h-full overflow-hidden ">
              {/* Background Image with overlay */}
              <div className="absolute inset-0 z-[1]">
                <Image
                  src={slide.imgurl}
                  alt={slide.title}
                  fill
                  quality={95}
                  draggable="false"
                  sizes="100vw"
                  priority
                  className="object-cover object-center opacity-90"
                />
                {/* Gradient Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"></div>
              </div>

              {/* Content Container - Levithub Style */}
              <div className="z-[6] absolute inset-0 px-8 sm:px-12 md:px-20 lg:px-28 flex items-center">
                <div className="max-w-[560px] flex flex-col gap-4 md:gap-6">
                  {/* Title - Large and Bold like Levithub */}
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-black drop-shadow-2xl">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  {slide.subtitle && (
                    <p className="text-lg sm:text-xl md:text-2xl font-medium text-black/95 drop-shadow-lg">
                      {slide.subtitle}
                    </p>
                  )}

                  {/* Description */}
                  {slide.description && (
                    <p className="text-base sm:text-lg text-black/90 drop-shadow-md max-w-xl">
                      {slide.description}
                    </p>
                  )}

                  {/* Call to Action Button - Levithub Style */}
                  {slide.button_text && (
                    <div className="flex gap-4 mt-4">
                      <Link
                        href={slide.button_url || "#"}
                        className="group/btn inline-flex items-center gap-3 px-6 py-3 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 ease-out"
                      >
                        <span>{slide.button_text}</span>
                        <HiArrowRight className="w-5 h-5" />
                      </Link>
                    </div>
                  )}

                  {/* Additional Text */}
                  {slide.more_text && (
                    <p className="text-sm sm:text-base text-white/80 font-light">
                      {slide.more_text}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Navigation Buttons - Modern Style */}
        <button
          type="button"
          aria-label="previous button for banner carousel"
          className="sw-custom-prev-bttn z-10 absolute top-[50%] translate-y-[-50%] left-4 sm:left-6 md:left-8 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center opacity-0 group-hover/swiperbttn:opacity-100 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white transition-all duration-300 ease-out hover:scale-110"
        >
          <IoChevronBackOutline className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        <button
          type="button"
          aria-label="next button for banner carousel"
          className="sw-custom-next-bttn z-10 absolute top-[50%] translate-y-[-50%] right-4 sm:right-6 md:right-8 w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center opacity-0 group-hover/swiperbttn:opacity-100 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border border-white/30 text-white transition-all duration-300 ease-out hover:scale-110"
        >
          <IoChevronForwardOutline className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        {/* Pagination Dots - Bottom Center like Levithub */}
        <div className="sw-custom-pagination z-10 absolute bottom-8 left-0 right-0 flex justify-center gap-2"></div>
      </Swiper>
    </>
  );
};

export default BannerCarousel;
