"use client";

import "swiper/css/bundle";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";
import { HiArrowRight } from "react-icons/hi2";

type BannerSlide = {
  image: string;
  title?: string;
  subtitle?: string;
  description?: string;
  button_text?: string;
  button_url?: string;
  more_text?: string;
};

interface BannerCarouselProps {
  uniqueid: string;
  slides: BannerSlide[];
}

const BannerCarousel = ({ uniqueid, slides }: BannerCarouselProps) => {
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
        className="group/banner h-full w-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={`slide${index}`}
            className="flex w-full justify-center px-3"
          >
            <div className="relative w-full my-6 max-w-[1200px] min-h-[220px] max-h-[360px] lg:min-h-[260px] lg:max-h-[420px] overflow-hidden rounded-[24px] bg-white border border-stone-100 px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-12">
              <div className="relative">
                <div className="pointer-events-none absolute left-[-40px] bottom-[-40px] h-[160px] w-[160px] rounded-full blur-2xl" />
                <div className="pointer-events-none absolute right-[-40px] top-[-40px] h-[180px] w-[180px] rounded-full bg-sky-100/55 blur-2xl" />

                <div className="flex flex-col-reverse items-center gap-6 lg:flex-row">
                  <div className="flex w-full flex-col gap-4 text-left lg:w-[52%] lg:gap-6">
                    {slide.more_text && (
                      <span className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-50 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                        {slide.more_text}
                      </span>
                    )}
                    {slide.title && (
                      <h2 className="text-3xl font-semibold leading-tight tracking-tight text-stone-900 sm:text-4xl lg:text-5xl">
                        {slide.title}
                      </h2>
                    )}
                    {slide.subtitle && (
                      <p className="font-medium text-emerald-700 sm:text-lg lg:text-xl">
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.description && (
                      <p className="max-w-xl text-sm  text-stone-600 sm:text-base">
                        {slide.description}
                      </p>
                    )}
                    {slide.button_text && (
                      <div className="pt-2">
                        <Link
                          href={slide.button_url || "#"}
                          className="group inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-stone-700 sm:text-base"
                        >
                          <span>{slide.button_text}</span>
                          <HiArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    )}
                  </div>

                  <div className="relative flex w-full justify-center lg:w-[48%]">
                    <div className="relative aspect-[3/4] w-full max-w-[300px]">
                      <div className="absolute inset-0 rounded-[20px] " />
                      <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-[20px] border border-white/60 shadow-sm">
                        <Image
                          src={slide.image}
                          alt={slide.title || "Hero banner"}
                          fill
                          sizes="(max-width: 1024px) 80vw, 300px"
                          priority={index === 0}
                          draggable="false"
                          className="object-contain p-3"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Navigation Buttons - Modern Style */}
        <button
          type="button"
          aria-label="previous button for banner carousel"
          className="sw-custom-prev-bttn absolute left-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-stone-800 opacity-0 shadow-lg transition-all duration-300 hover:-translate-x-1 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-xl group-hover/banner:opacity-100 md:flex lg:left-6"
        >
          <IoChevronBackOutline className="h-6 w-6" />
        </button>

        <button
          type="button"
          aria-label="next button for banner carousel"
          className="sw-custom-next-bttn absolute right-4 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-stone-800 opacity-0 shadow-lg transition-all duration-300 hover:translate-x-1 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow-xl group-hover/banner:opacity-100 md:flex lg:right-6"
        >
          <IoChevronForwardOutline className="h-6 w-6" />
        </button>

        <div className="sw-custom-pagination pointer-events-none absolute bottom-6 left-0 right-0 flex justify-center gap-2"></div>
      </Swiper>
    </>
  );
};

export default BannerCarousel;
