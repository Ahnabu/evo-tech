"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { ExternalLink } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  prevPrice?: number;
  image: string;
  rating?: number;
}

interface DynamicProductSliderProps {
  title: string;
  products: Product[];
  viewMoreUrl?: string;
}

const DynamicProductSlider = ({
  title,
  products,
  viewMoreUrl = "/products-and-accessories",
}: DynamicProductSliderProps) => {
  const swiperRef = useRef<SwiperType | null>(null);

  if (!products || products.length === 0) return null;

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 md:px-12 py-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg sm:text-2xl font-semibold text-stone-800">
          {title}
        </h3>
        <div className="flex items-center gap-3 border-[1px] border-stone-400 rounded-xl">
          <Link
            href={viewMoreUrl}
            className="text-sm text-stone-500 p-2 px-4 hover:bg-brand-600 rounded-xl font-semibold hover:text-white transition-colors"
          >
            More
            <ExternalLink size={14} className="inline-block ml-1 mb-0.5" />
          </Link>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={20}
        slidesPerView={2}
        breakpoints={{
          640: { slidesPerView: 3, spaceBetween: 18 },
          1024: { slidesPerView: 4, spaceBetween: 20 },
          1280: { slidesPerView: 4, spaceBetween: 20 },
        }}
        onSwiper={(s) => (swiperRef.current = s)}
        autoplay={{ delay: 4000, disableOnInteraction: true }}
        navigation={true}
        loop={products.length > 4}
        className="products-swiper"
      >
        {products.map((p) => (
          <SwiperSlide key={p.id}>
            <Link
              href={`/items/${p.slug}`}
              className="group block w-full rounded-lg overflow-hidden shadow-sm hover:shadow-md transition transform hover:-translate-y-1"
            >
              <div className="relative w-full h-[140px] sm:h-[160px] lg:h-[180px] bg-[#fafafa]">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-contain p-4"
                />
              </div>

              <div className="p-3">
                <h4 className="text-sm font-medium text-stone-800 line-clamp-2 min-h-[2rem]">
                  {p.name}
                </h4>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-stone-900">
                      BDT {p.price?.toLocaleString()}
                    </div>
                     {p.prevPrice && p.prevPrice > p.price && (
                      <div className="text-xs text-stone-400 line-through">
                        BDT {p.prevPrice?.toLocaleString()}
                      </div>
                    )}
                  </div>
                 
                  {p.rating !== undefined && p.rating > 0 && (
                     <div className="text-xs text-stone-400">★ {p.rating}</div>
                  )}
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default DynamicProductSlider;
