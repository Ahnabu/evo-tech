"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "@/utils/axios/axios";
import axiosErrorLogger from "@/components/error/axios_error";

interface Category {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  sortOrder?: number;
}

const CategoryStrip = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories?limit=12&isActive=true");
        const data = response?.data?.data || [];
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

  if (loading || categories.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-1 text-center text-stone-700 shadow-sm border-t border-stone-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center gap-2 overflow-x-auto scrollbar-hide py-2">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/products-and-accessories/${category.slug}`}
              className="px-3 py-1 capitalize text-sm font-medium text-stone-700 hover:text-brand-600 hover:bg-stone-100 rounded-md transition-all duration-200 whitespace-nowrap"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryStrip;
