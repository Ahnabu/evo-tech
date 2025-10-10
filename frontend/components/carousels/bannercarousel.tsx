"use client";

import 'swiper/css/bundle';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";


const BannerCarousel = ({ uniqueid, slides }: { uniqueid: string; slides: any[]; }) => {

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
          delay: 5000,
          disableOnInteraction: false
        }}
        speed={800}
        loop={slides.length >= 2}
        grabCursor
        navigation={navigation}
        pagination={pagination}
        id={uniqueid}
        className="w-full h-full group/swiperbttn"
      >
        {
          slides.map((slide, index) => (
            <SwiperSlide key={`slide${index}`} className="relative w-full h-full">
              <div className="relative w-full h-full overflow-hidden">
                <Image
                  src={slide.imgurl}
                  alt={slide.title}
                  fill
                  quality={95}
                  draggable="false"
                  sizes="100%"
                  priority
                  className="object-cover object-center"
                />
                <div className="z-[6] absolute w-full h-fit px-2 sm:px-4 top-[100px] left-0 flex flex-col items-center gap-2 font-inter">
                  <h2 className="w-full text-center text-[20px] sm:text-[24px] lg:text-[28px] leading-7 sm:leading-8 lg:leading-9 font-[600] text-stone-100">{slide.title}</h2>
                  {slide.subtitle && <p className="w-full text-center text-[13px] sm:text-[15px] leading-6 font-[500] text-stone-100">{slide.subtitle}</p>}
                  {slide.button_text &&
                    (<Link href={slide.button_url ? slide.button_url : `#`} className="w-fit h-fit px-4 py-1.5 text-[13px] sm:text-[15px] leading-5 font-[500] border border-stone-100 text-stone-100 bg-transparent rounded-[50px] hover:bg-stone-50/10 transition-colors duration-200 ease-linear">
                        {slide.button_text}
                    </Link>)
                  }
                  {slide.more_text && <p className="w-full text-center text-[12px] sm:text-[13px] leading-5 font-[400] text-stone-50">{slide.more_text}</p>}
                </div>
              </div>
            </SwiperSlide>
          ))
        }

        <button type="button" aria-label="previous button for banner carousel" className="sw-custom-prev-bttn z-10 absolute top-[50%] translate-y-[-50%] left-2 sm:left-4 md:left-7 w-fit h-fit opacity-0 group-hover/swiperbttn:opacity-100 rounded-full border-r-2 border-b-2 border-white/30 hover:border-white/60 text-white/30 hover:bg-black/15 hover:text-white/60 transition-[color,_border-color,_background-color,_opacity] ease-in-out [transition-duration:200ms,_200ms,_200ms,_600ms]">
          <IoChevronBackOutline className="w-6 h-6 sm:w-8 sm:h-8 sm:p-1" />
        </button>

        <button type="button" aria-label="next button for banner carousel" className="sw-custom-next-bttn z-10 absolute top-[50%] translate-y-[-50%] right-2 sm:right-4 md:right-7 w-fit h-fit opacity-0 group-hover/swiperbttn:opacity-100 rounded-full border-l-2 border-b-2 border-white/30 hover:border-white/60 text-white/30 hover:bg-black/15 hover:text-white/60 transition-[color,_border-color,_background-color,_opacity] ease-in-out [transition-duration:200ms,_200ms,_200ms,_600ms]">
          <IoChevronForwardOutline className="w-6 h-6 sm:w-8 sm:h-8 sm:p-1" />
        </button>

        <div className="sw-custom-pagination z-10 absolute p-1"></div>
      </Swiper>
    </>
  );
}

export default BannerCarousel;
