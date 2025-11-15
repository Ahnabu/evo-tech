"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "@/utils/axios/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  previousPrice?: number;
  mainImage: string;
  inStock: boolean;
  shortDescription?: string;
}

interface CategorySection {
  categoryName: string;
  categorySlug: string;
  products: Product[];
}

export default function Featured3DPrintersMaterials() {
  const [sections, setSections] = useState<CategorySection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch 3D Printers
        const printersRes = await axios.get("/api/products", {
          params: {
            category: "3d-printer",
            limit: 2,
            published: true,
          },
        });

        // Fetch Materials
        const materialsRes = await axios.get("/api/products", {
          params: {
            category: "materials",
            limit: 3,
            published: true,
          },
        });

        const sectionsData: CategorySection[] = [];

        if (printersRes.data?.data?.length > 0) {
          sectionsData.push({
            categoryName: "3D Printers",
            categorySlug: "3d-printer",
            products: printersRes.data.data,
          });
        }

        if (materialsRes.data?.data?.length > 0) {
          sectionsData.push({
            categoryName: "Materials",
            categorySlug: "materials",
            products: materialsRes.data.data,
          });
        }

        setSections(sectionsData);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="space-y-6 sm:space-y-10">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-10 w-48" />
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {[1, 2, 3, 4].map((j) => (
                  <Skeleton key={j} className="h-72 sm:h-80" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sections.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-[1600px] mx-auto  px-4 sm:px-6 lg:px-8">
        {sections.map((section, sectionIndex) => (
          <div
            key={section.categorySlug}
            className={sectionIndex > 0 ? "mt-6 " : ""}
          >
            {/* Section Header */}
            <div className="flex items-center justify-between gap-3 sm:gap-4 mb-5 sm:mb-6">
              <h3 className="text-lg sm:text-2xl font-semibold text-stone-800">
                {section.categoryName}
              </h3>
              <div className="flex items-center gap-3">
                <Link
                  href={`/products-and-accessories/${section.categorySlug}`}
                  className="text-sm text-stone-500 p-2 px-4 hover:bg-brand-600 rounded-xl font-semibold hover:text-white transition-colors"
                >
                  More
                  <ExternalLink
                    size={14}
                    className="inline-block ml-1 mb-0.5"
                  />
                </Link>
              </div>
            </div>

            {/* Products Grid */}
            <Swiper
              modules={[Autoplay]}
              spaceBetween={20}
              slidesPerView={2}
              breakpoints={{
                640: { slidesPerView: 3, spaceBetween: 18 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
                1280: { slidesPerView: 4, spaceBetween: 20 },
              }}
              autoplay={{
                delay: 3500,
                disableOnInteraction: true,
                pauseOnMouseEnter: true,
              }}
              loop={section.products.length > 4}
              className="products-swiper"
            >
              {section.products.map((product) => (
                <SwiperSlide key={product._id}>
                  <Link
                    href={`/items/${product.slug}`}
                    className="group block w-full my-1 rounded-lg overflow-hidden shadow-md hover:shadow-md transition transform hover:-translate-y-1"
                  >
                    {/* Product Image Container */}
                    <div className="relative w-full aspect-square  bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                      <Image
                        src={product.mainImage || "/placeholder.png"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                        priority={sectionIndex === 0}
                      />

                      {/* Out of Stock Overlay */}
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-10">
                          <span className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
                            Out of Stock
                          </span>
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Product Info */}
                    <div className="p-3 sm:p-3.5 flex flex-col gap-1 flex-1">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 min-h-[2rem] group-hover:text-blue-600 transition-colors leading-tight">
                        {product.name}
                      </h3>

                      {product.shortDescription && (
                        <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-1 leading-tight">
                          {product.shortDescription}
                        </p>
                      )}

                      <div className="mt-auto pt-1">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">
                            BDT {product.price.toLocaleString()}
                          </span>
                          {product.previousPrice &&
                            product.previousPrice > product.price && (
                              <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                                BDT {product.previousPrice.toLocaleString()}
                              </span>
                            )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom accent line */}
                    <div className="h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ))}
      </div>
    </section>
  );
}
