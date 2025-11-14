'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton';
import { FiExternalLink } from 'react-icons/fi';

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
        const printersRes = await axios.get('/api/products', {
          params: {
            category: '3d-printer',
            limit: 2,
            published: true,
          },
        });

        // Fetch Materials
        const materialsRes = await axios.get('/api/products', {
          params: {
            category: 'materials',
            limit: 3,
            published: true,
          },
        });

        const sectionsData: CategorySection[] = [];

        if (printersRes.data?.data?.length > 0) {
          sectionsData.push({
            categoryName: '3D Printers',
            categorySlug: '3d-printer',
            products: printersRes.data.data,
          });
        }

        if (materialsRes.data?.data?.length > 0) {
          sectionsData.push({
            categoryName: 'Materials',
            categorySlug: 'materials',
            products: materialsRes.data.data,
          });
        }

        setSections(sectionsData);
      } catch (error) {
        console.error('Error fetching featured products:', error);
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
                {[1, 2, 3, 4, 5, 6].map((j) => (
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
    <section className="w-full py-6 sm:py-10 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {sections.map((section, sectionIndex) => (
          <div
            key={section.categorySlug}
            className={sectionIndex > 0 ? 'mt-8 sm:mt-12' : ''}
          >
            {/* Section Header */}
            <div className="flex items-center gap-3 sm:gap-4 mb-5 sm:mb-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                {section.categoryName}
              </h2>
              <Link
                href={`/products-and-accessories/${section.categorySlug}`}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-white bg-white hover:bg-blue-600 border-2 border-blue-200 hover:border-blue-600 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
              >
                More
                <FiExternalLink className="w-4 h-4" />
              </Link>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
              {section.products.map((product) => (
                <Link
                  key={product._id}
                  href={`/items/${product.slug}`}
                  className="group relative flex flex-col bg-white rounded-xl shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200"
                >
                  {/* Product Image Container */}
                  <div className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
                    <Image
                      src={product.mainImage || '/placeholder.png'}
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
                        {product.previousPrice && product.previousPrice > product.price && (
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
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
