"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface CategoryCardProps {
  id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

const CategoryCard = ({
  id,
  name,
  slug,
  image,
  description,
}: CategoryCardProps) => {
  const [imageError, setImageError] = useState(false);

  const defaultImage = "/assets/placeholder-category.svg";
  const imageUrl = image && !imageError ? image : defaultImage;

  return (
    <Link
      href={`/products-and-accessories/${slug}`}
      className="group relative flex flex-col items-center w-full h-[200px] sm:h-[240px] bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 ease-out transform hover:scale-105"
    >
      {/* Image Container */}
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          quality={75}
          className="object-cover object-center group-hover:scale-110 transition-transform duration-500 ease-out"
          onError={() => setImageError(true)}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
      </div>

      {/* Category Name - Overlaid on Image */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
        <h3 className="capitalize text-lg sm:text-xl font-bold text-white drop-shadow-lg group-hover:text-brand-400 transition-colors duration-300">
          {name}
        </h3>
        {description && (
          <p className="text-xs sm:text-sm text-white/80 mt-1 line-clamp-2 drop-shadow-md">
            {description}
          </p>
        )}
      </div>

      {/* Hover Effect - "View Products" Button */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-sm">
        <span className="px-6 py-2 bg-brand-600 text-white font-semibold rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          View Products
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;
