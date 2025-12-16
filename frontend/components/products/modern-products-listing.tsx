"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import EvoPagination from "@/components/ui/evo_pagination";
import EvoDropdown from "@/components/ui/evo_dropdown";
import { DropdownItem } from "@heroui/react";
import { FiShoppingCart, FiHeart, FiStar } from "react-icons/fi";
import { BsLightning } from "react-icons/bs";

interface ModernProductsListingProps {
  fetchedProdData: any[];
  paginationMeta: any;
  viewMode: "grid" | "list";
}

const ModernProductsListing = ({
  fetchedProdData,
  paginationMeta,
  viewMode,
}: ModernProductsListingProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string, prevQueryString?: string) => {
      const params = new URLSearchParams(
        prevQueryString ? prevQueryString : searchParams.toString()
      );
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const removeQueryParam = useCallback(
    (name: string, prevQueryString?: string) => {
      const params = new URLSearchParams(
        prevQueryString ? prevQueryString : searchParams.toString()
      );
      params.delete(name);
      return params.toString();
    },
    [searchParams]
  );

  if (fetchedProdData.length === 0) {
    return (
      <div className="w-full h-[calc(100vh-300px)] flex flex-col items-center justify-center bg-white rounded-lg shadow-sm">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-stone-100 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-stone-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-stone-900 mb-2">
            No Products Found
          </h3>
          <p className="text-sm text-stone-600">
            Try adjusting your filters or check back later
          </p>
        </div>
      </div>
    );
  }

  const handlePaginationChange = (page: number) => {
    if (page !== paginationMeta.currentPage) {
      if (page === 1) {
        const newparams = removeQueryParam("page");
        router.push(`${pathname}${newparams ? `?${newparams}` : ""}`, {
          scroll: true,
        });
      } else {
        router.push(
          `${pathname}?${createQueryString("page", page.toString())}`,
          { scroll: true }
        );
      }
    }
  };

  const handlePerPageChange = (perPage: number) => {
    if (perPage !== paginationMeta.itemsPerPage) {
      if (perPage === 12) {
        let newparams = removeQueryParam("perpage");
        newparams = removeQueryParam("page", newparams);
        router.push(`${pathname}${newparams ? `?${newparams}` : ""}`, {
          scroll: true,
        });
      } else {
        let newparams = createQueryString("perpage", perPage.toString());
        newparams = removeQueryParam("page", newparams);
        router.push(`${pathname}${newparams ? `?${newparams}` : ""}`, {
          scroll: true,
        });
      }
    }
  };

  const handleSortChange = (sortKey: string) => {
    let newparams = "";
    if (sortKey === "default") {
      newparams = removeQueryParam("sortBy");
      newparams = removeQueryParam("sortOrder", newparams);
    } else if (sortKey === "price-asc") {
      newparams = createQueryString("sortBy", "price");
      newparams = createQueryString("sortOrder", "asc", newparams);
    } else if (sortKey === "price-desc") {
      newparams = createQueryString("sortBy", "price");
      newparams = createQueryString("sortOrder", "desc", newparams);
    } else if (sortKey === "name-asc") {
      newparams = createQueryString("sortBy", "name");
      newparams = createQueryString("sortOrder", "asc", newparams);
    } else if (sortKey === "newest") {
      newparams = createQueryString("sortBy", "createdAt");
      newparams = createQueryString("sortOrder", "desc", newparams);
    } else if (sortKey === "rating") {
      newparams = createQueryString("sortBy", "rating");
      newparams = createQueryString("sortOrder", "desc", newparams);
    }
    newparams = removeQueryParam("page", newparams);
    router.push(`${pathname}${newparams ? `?${newparams}` : ""}`, {
      scroll: false,
    });
  };

  const paginationData = {
    currentPage: paginationMeta.currentPage,
    lastPage: paginationMeta.lastPage,
    onChange: handlePaginationChange,
  };

  const currentSort = searchParams.get("sortBy")
    ? `${searchParams.get("sortBy")}-${searchParams.get("sortOrder")}`
    : "default";

  return (
    <>
      {/* Sort and Per Page Controls */}
      <div className="w-full h-fit flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-4 py-3 bg-white rounded-lg shadow-sm mb-6">
        <div className="flex items-center gap-3">
          <EvoDropdown
            dropdownLabel="Sort By"
            onKeyChange={(key) => handleSortChange(key)}
            selectedKey={currentSort}
            ariaLabelForMenu="sort products"
            dropdownTriggerClassName="w-fit h-fit"
          >
            <DropdownItem key="default">Default</DropdownItem>
            <DropdownItem key="newest">Newest First</DropdownItem>
            <DropdownItem key="price-asc">Price: Low to High</DropdownItem>
            <DropdownItem key="price-desc">Price: High to Low</DropdownItem>
            <DropdownItem key="name-asc">Name: A to Z</DropdownItem>
            <DropdownItem key="rating">Highest Rated</DropdownItem>
          </EvoDropdown>
        </div>

        <div className="flex items-center gap-3">
          <EvoDropdown
            dropdownLabel="Show"
            onKeyChange={(key) => handlePerPageChange(parseInt(key))}
            selectedKey={paginationMeta.itemsPerPage.toString()}
            ariaLabelForMenu="items per page"
            dropdownTriggerClassName="w-fit h-fit"
          >
            <DropdownItem key="12">12 per page</DropdownItem>
            <DropdownItem key="24">24 per page</DropdownItem>
            <DropdownItem key="36">36 per page</DropdownItem>
            <DropdownItem key="48">48 per page</DropdownItem>
          </EvoDropdown>
        </div>
      </div>

      {/* Products Grid/List */}
      {viewMode === "grid" ? (
        <div className="w-full h-fit grid grid-cols-1 min-[551px]:grid-cols-2 lg:grid-cols-3 gap-3">
          {fetchedProdData.map((prod: any, index: number) => (
            <ProductGridCard key={`item${index}`} product={prod} />
          ))}
        </div>
      ) : (
        <div className="w-full h-fit flex flex-col gap-4">
          {fetchedProdData.map((prod: any, index: number) => (
            <ProductListCard key={`item${index}`} product={prod} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {paginationMeta.lastPage > 1 && (
        <div className="w-full h-fit flex justify-center items-center mt-12">
          <EvoPagination paginationProps={paginationData} />
        </div>
      )}
    </>
  );
};

// Grid Card Component
const ProductGridCard = ({ product }: { product: any }) => {
  const discount =
    product.i_prevprice > product.i_price
      ? Math.round(
          ((product.i_prevprice - product.i_price) / product.i_prevprice) * 100
        )
      : 0;

  return (
    <Link
      href={`/items/${product.i_slug}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 hover:border-brand-200 flex flex-col"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-square overflow-hidden bg-stone-50">
        <Image
          src={product.i_mainimg || "/assets/placeholder-product.svg"}
          alt={product.i_name}
          fill
          sizes="(max-width: 551px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-md">
              -{discount}%
            </span>
          )}
          {!product.i_instock && (
            <span className="px-2 py-1 bg-stone-800 text-white text-xs font-bold rounded-md">
              Out of Stock
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            className="p-2 bg-white rounded-full shadow-md hover:bg-brand-50 hover:text-brand-600 transition-colors"
            aria-label="Add to wishlist"
          >
            <FiHeart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Brand */}
        {product.i_brandName && (
          <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">
            {product.i_brandName}
          </p>
        )}

        {/* Name */}
        <h3 className="text-sm font-semibold text-stone-900 mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
          {product.i_name}
        </h3>

        {/* Rating */}
        {product.i_rating > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.i_rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-stone-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-stone-500">
              ({product.i_reviewCount})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-lg font-bold text-stone-900">
            ৳{product.i_price.toLocaleString()}
          </span>
          {product.i_prevprice > product.i_price && (
            <span className="text-sm text-stone-400 line-through">
              ৳{product.i_prevprice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button className="mt-3 w-full py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <FiShoppingCart className="w-4 h-4" />
          <span className="text-sm font-medium">Add to Cart</span>
        </button>
      </div>
    </Link>
  );
};

// List Card Component
const ProductListCard = ({ product }: { product: any }) => {
  const discount =
    product.i_prevprice > product.i_price
      ? Math.round(
          ((product.i_prevprice - product.i_price) / product.i_prevprice) * 100
        )
      : 0;

  return (
    <Link
      href={`/items/${product.i_slug}`}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 hover:border-brand-200 flex flex-col sm:flex-row"
    >
      {/* Image Container */}
      <div className="relative w-full sm:w-64 h-64 sm:h-auto flex-shrink-0 overflow-hidden bg-stone-50">
        <Image
          src={product.i_mainimg || "/assets/placeholder-product.svg"}
          alt={product.i_name}
          fill
          sizes="256px"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {discount > 0 && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-md">
              -{discount}%
            </span>
          )}
          {!product.i_instock && (
            <span className="px-2 py-1 bg-stone-800 text-white text-xs font-bold rounded-md">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Brand */}
        {product.i_brandName && (
          <p className="text-sm text-stone-500 uppercase tracking-wide mb-1">
            {product.i_brandName}
          </p>
        )}

        {/* Name */}
        <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-brand-600 transition-colors">
          {product.i_name}
        </h3>

        {/* Rating */}
        {product.i_rating > 0 && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.i_rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-stone-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-stone-500">
              {product.i_rating.toFixed(1)} ({product.i_reviewCount} reviews)
            </span>
          </div>
        )}

        {/* Description */}
        {product.i_description && (
          <p className="text-sm text-stone-600 mb-4 line-clamp-2">
            {product.i_description}
          </p>
        )}

        {/* Features */}
        {product.i_features && product.i_features.length > 0 && (
          <ul className="mb-4 space-y-1">
            {product.i_features
              .slice(0, 3)
              .map((feature: string, idx: number) => (
                <li
                  key={idx}
                  className="flex items-start gap-2 text-sm text-stone-600"
                >
                  <BsLightning className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
          </ul>
        )}

        {/* Price and Action */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-stone-900">
              ৳{product.i_price.toLocaleString()}
            </span>
            {product.i_prevprice > product.i_price && (
              <span className="text-base text-stone-400 line-through">
                ৳{product.i_prevprice.toLocaleString()}
              </span>
            )}
          </div>

          <button className="px-6 py-2.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors flex items-center gap-2">
            <FiShoppingCart className="w-4 h-4" />
            <span className="text-sm font-medium">Add to Cart</span>
          </button>
        </div>
      </div>
    </Link>
  );
};

export { ModernProductsListing };
