"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import axios from "@/utils/axios/axios";
import axiosErrorLogger from "@/components/error/axios_error";
import { IoClose, IoChevronDown, IoChevronForward } from "react-icons/io5";
import { TbUser, TbDashboard, TbLogout } from "react-icons/tb";
import { BiPackage } from "react-icons/bi";
import { useCurrentUser } from "@/hooks/use-current-user";
import { logout } from "@/actions/logout";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Subcategory {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  sortOrder?: number;
}

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const currentUser = useCurrentUser();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Record<string, Subcategory[]>>({});
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories?limit=100&isActive=true");
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

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchSubcategories = async (categoryId: string) => {
    if (subcategories[categoryId]) return;

    try {
      const response = await axios.get(`/subcategories?category=${categoryId}&isActive=true`);
      const data = response?.data?.data || [];
      setSubcategories(prev => ({
        ...prev,
        [categoryId]: data
      }));
    } catch (error) {
      axiosErrorLogger({ error });
      setSubcategories(prev => ({
        ...prev,
        [categoryId]: []
      }));
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
      fetchSubcategories(categoryId);
    }
  };

  const handleSignOut = async () => {
    try {
      // Clear all session/local storage data
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
      }

      await logout();

      const response: any = await signOut({ redirect: false, callbackUrl: "/" });

      if (!response?.url) {
        toast.error("Something went wrong while signing out.");
        onClose();
        router.push("/");
        router.refresh();
        return;
      }

      toast.success("You signed out of your account.");
      onClose();
      router.push(response.url ?? "/");
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong while signing out.");
      if (typeof window !== 'undefined') {
        sessionStorage.clear();
      }
      onClose();
      router.push("/");
      router.refresh();
    }
  };

  const getDashboardUrl = (userRole: string) => {
    switch (userRole?.toLowerCase()) {
      case "admin":
        return "/control/dashboard";
      case "employee":
        return "/employee/dashboard";
      case "user":
      default:
        return "/user/dashboard";
    }
  };

  const getProfileUrl = (userRole: string) => {
    switch (userRole?.toLowerCase()) {
      case "admin":
        return "/control/profile";
      case "employee":
        return "/employee/profile";
      case "user":
      default:
        return "/user/dashboard/profile";
    }
  };

  const getOrderHistoryUrl = (userRole: string) => {
    switch (userRole?.toLowerCase()) {
      case "admin":
        return "/control/orders";
      case "employee":
        return "/employee/orders";
      case "user":
      default:
        return "/user/dashboard/order-history";
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[100] md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-[85%] max-w-[320px] bg-white z-[101] transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-stone-200">
            <h2 className="text-lg font-semibold text-stone-800">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-stone-100"
              aria-label="Close menu"
            >
              <IoClose className="w-6 h-6 text-stone-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* User Section */}
            {currentUser ? (
              <div className="p-4 border-b border-stone-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center">
                    <TbUser className="w-6 h-6 text-brand-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-800">
                      {currentUser.firstName} {currentUser.lastName}
                    </p>
                    <p className="text-xs text-stone-500">{currentUser.email}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Link
                    href={getProfileUrl(currentUser.role || "user")}
                    onClick={onClose}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 rounded-md"
                  >
                    <TbUser className="w-4 h-4" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    href={getDashboardUrl(currentUser.role || "user")}
                    onClick={onClose}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 rounded-md"
                  >
                    <TbDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href={getOrderHistoryUrl(currentUser.role || "user")}
                    onClick={onClose}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 rounded-md"
                  >
                    <BiPackage className="w-4 h-4" />
                    <span>Order History</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md w-full"
                  >
                    <TbLogout className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 border-b border-stone-200">
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="px-4 py-2 text-center text-sm font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={onClose}
                    className="px-4 py-2 text-center text-sm font-medium border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}

            {/* Track Order */}
            <div className="p-4 border-b border-stone-200">
              <Link
                href="/track-order"
                onClick={onClose}
                className="flex items-center gap-3 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 rounded-md"
              >
                <BiPackage className="w-5 h-5" />
                <span>Track Order</span>
              </Link>
            </div>

            {/* Categories */}
            <div className="p-4">
              <h3 className="text-xs font-semibold text-stone-500 uppercase mb-3">
                Categories
              </h3>
              {loading ? (
                <p className="text-sm text-stone-500">Loading...</p>
              ) : (
                <div className="flex flex-col gap-1">
                  {categories.map((category) => {
                    const categorySubcategories = subcategories[category._id] || [];
                    const hasSubcategories = categorySubcategories.length > 0;
                    const isExpanded = expandedCategory === category._id;

                    return (
                      <div key={category._id}>
                        <div className="flex items-center">
                          <button
                            onClick={() => handleCategoryClick(category._id)}
                            className="flex-1 flex items-center justify-between px-3 py-2 text-sm text-stone-700 hover:bg-stone-100 rounded-md capitalize"
                          >
                            <span>{category.name}</span>
                            {hasSubcategories && (
                              isExpanded ? (
                                <IoChevronDown className="w-4 h-4 text-stone-600 transition-transform" />
                              ) : (
                                <IoChevronForward className="w-4 h-4 text-stone-600 transition-transform" />
                              )
                            )}
                          </button>
                        </div>

                        {/* Subcategories */}
                        {isExpanded && hasSubcategories && (
                          <div className="ml-4 mt-1 flex flex-col gap-1 animate-in slide-in-from-left-2 duration-200">
                            {categorySubcategories.map((subcategory) => (
                              <Link
                                key={subcategory._id}
                                href={`/${category.slug}/${subcategory.slug}`}
                                onClick={onClose}
                                className="px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100 rounded-md capitalize flex items-center gap-2"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-stone-400"></span>
                                {subcategory.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
