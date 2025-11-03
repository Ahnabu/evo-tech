"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { Avatar } from "@nextui-org/avatar";
import useDebounce from "@rooks/use-debounce";
import { logout } from "@/actions/logout";
import { signOut } from "next-auth/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import EvoTechBDLogoGray from "@/public/assets/EvoTechBD-logo-gray.png";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { BiPackage } from "react-icons/bi";
import { IoChevronDown } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { TbDashboard, TbUser, TbLogout } from "react-icons/tb";

import ServiceCard from "@/components/cards/servicecard";
import ManageCart from "@/components/navbar/manage_cart";
import { getNameInitials } from "@/utils/essential_functions";
import type { NavbarMenuType1 } from "./navbar";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";

const NavbarClient = ({
  services,
  support,
}: {
  services: NavbarMenuType1[];
  support: NavbarMenuType1[];
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState<boolean | null>(null);

  const currentUser = useCurrentUser();

  const detectScrollPositionDebounced = useDebounce(() => {
    window?.scrollY < 32 ? setIsScrolled(false) : setIsScrolled(true);
  }, 5);

  useEffect(() => {
    detectScrollPositionDebounced();
    window.addEventListener(
      "scroll",
      detectScrollPositionDebounced as EventListener
    );
    return () =>
      window.removeEventListener(
        "scroll",
        detectScrollPositionDebounced as EventListener
      );
  }, [detectScrollPositionDebounced]);

  const handleSignOutDebounced = useDebounce(async () => {
    try {
      const result = await logout();

      if (result?.success) {
        const response = await signOut({ redirect: false, callbackUrl: "/" });

        if (!response?.url) {
          console.error("NextAuth signOut error:", response);
          toast.error("Something went wrong while signing out.");
          return;
        }

        toast.success("You signed out of your account.");
        router.push(response.url ?? "/");
        router.refresh();
      } else {
        toast.error("Something went wrong while signing out.");
      }
    } catch (err) {
      console.error("Sign out error:", err);
      toast.error("Something went wrong while signing out.");
    }
  }, 200);

  const isCurrentURL = (word: string) => {
    const pathSegments = pathname.split("/").filter(Boolean);
    return pathSegments[0] === word;
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
    return userRole?.toLowerCase() === "user"
      ? "/user/dashboard/profile"
      : "/profile";
  };

  const getOrderHistoryUrl = (userRole: string) => {
    return userRole?.toLowerCase() === "user"
      ? "/user/dashboard/order-history"
      : "/order-history";
  };

  return (
    <>
      <div className="w-full bg-white text-stone-700 text-[13px]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 flex items-center justify-between h-8">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center px-3 py-0.5 rounded-full bg-red-500 text-white text-[12px] font-[700]">
              HOT
            </span>
            <span className="text-stone-700">10% off on online payments</span>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <button className="flex items-center gap-2 px-3 py-1 rounded-full bg-white shadow-sm border border-stone-100">
              <span className="w-6 h-6 rounded-full bg-[#EEF2FF] flex items-center justify-center">
                ?
              </span>
              <span className="text-stone-800 font-[600]">Need Help?</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1 rounded-full border border-brand-600 text-brand-600 font-[600]">
                01518949050
              </div>
              <button className="px-3 py-1 rounded-full bg-brand-600 text-white">
                Call Us
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-50 bg-transparent w-full mx-auto">
        <div className="max-w-[1400px] mx-auto flex justify-center">
          <div className="w-full">
            <div
              className={`flex items-center justify-between px-4 sm:px-6 h-[72px] transition-colors duration-200 ${
                isScrolled
                  ? "bg-white/60 backdrop-blur-sm border-b border-stone-100 shadow-sm"
                  : "bg-transparent"
              }`}
            >
              <div className="flex items-center min-w-[160px]">
                <Link href="/" className="flex items-center">
                  <Image
                    src={EvoTechBDLogoGray}
                    alt="Evo-TechBD"
                    width={140}
                    height={44}
                    priority
                    className="object-contain"
                  />
                </Link>
              </div>

              <div className="flex-1 px-6">
                <div className="max-w-[760px] mx-auto">
                  <div className="relative">
                    <input
                      type="search"
                      placeholder="Search for products..."
                      className="w-full h-12 rounded-full border border-stone-200 px-6 focus:ring-2 focus:ring-[#0866FF] outline-none"
                    />
                    <button
                      title="search"
                      aria-label="submit search"
                      className="absolute right-3 top-1/2 -translate-y-1/2 bg-white w-10 h-10 rounded-full flex items-center justify-center shadow-sm border border-stone-100"
                    >
                      <FiSearch className="w-5 h-5 text-stone-600" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 min-w-[240px] justify-end">
                <Link href="/track-order" className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#F5F7FB] flex items-center justify-center">
                    <BiPackage className="w-5 h-5 text-stone-700" />
                  </div>
                  <div className="hidden sm:block text-sm font-[600] text-stone-700">
                    Track Order
                  </div>
                </Link>

                {currentUser ? (
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button
                        aria-label="user menu"
                        className="flex items-center rounded-lg"
                      >
                        <div className="w-12 h-12 rounded-lg bg-[#F5F7FB] flex items-center justify-center">
                          <Avatar
                            name={getNameInitials(
                              `${currentUser.firstName} ${currentUser.lastName}`
                            )}
                            radius="full"
                            classNames={{ base: "w-6 h-6" }}
                          />
                        </div>
                      </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Content
                      align="end"
                      sideOffset={6}
                      className="min-w-[160px] bg-white rounded-md shadow-lg border border-stone-200 py-1 z-[60]"
                    >
                      <DropdownMenu.Item asChild>
                        <Link
                          href={getProfileUrl(currentUser.role || "user")}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100"
                        >
                          <TbUser className="w-4 h-4" />
                          <span>My Profile</span>
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item asChild>
                        <Link
                          href={getDashboardUrl(currentUser.role || "user")}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100"
                        >
                          <TbDashboard className="w-4 h-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item asChild>
                        <Link
                          href={getOrderHistoryUrl(currentUser.role || "user")}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-stone-700 hover:bg-stone-100"
                        >
                          <BiPackage className="w-4 h-4" />
                          <span>Order History</span>
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator className="h-px bg-stone-200 my-1" />
                      <DropdownMenu.Item asChild>
                        <button
                          onClick={() => handleSignOutDebounced()}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <TbLogout className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                ) : (
                  <>
                    {/* Desktop Sign In/Sign Up */}
                    <div className="hidden sm:flex items-center gap-4">
                      <Link
                        href="/login"
                        className="text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors"
                      >
                        Sign in
                      </Link>
                      <Link
                        href="/register"
                        className="px-4 py-2 text-sm font-medium bg-[#0866FF] text-white rounded-lg hover:bg-[#0653D3] transition-colors"
                      >
                        Sign up
                      </Link>
                    </div>

                    {/* Mobile Sign In Button */}
                    <div className="sm:hidden">
                      <Link href="/login" className="flex items-center gap-2">
                        <div className="w-12 h-12 rounded-lg bg-[#F5F7FB] flex items-center justify-center">
                          <TbUser className="w-5 h-5 text-stone-700" />
                        </div>
                      </Link>
                    </div>
                  </>
                )}

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#F5F7FB] flex items-center justify-center">
                    <ManageCart />
                  </div>
                </div>
              </div>
            </div>

            {/* <div
              className={`w-full border-t transition-colors duration-200 ${
                isScrolled
                  ? "bg-white/60 backdrop-blur-sm border-stone-100"
                  : "bg-transparent border-stone-100"
              }`}
            >
              <div
                className={`px-4 sm:px-6 flex items-center justify-center gap-6 h-14 overflow-x-auto transition-all duration-300 ${
                  isScrolled
                    ? "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
                    : "max-h-20 opacity-100 translate-y-0"
                } ${isScrolled ? "backdrop-blur-sm" : ""}`}
              >
                <Link
                  href="/products-and-accessories/all"
                  className="px-3 py-2 text-stone-800 font-[600] whitespace-nowrap hover:text-stone-900"
                >
                  All Categories
                </Link>
                <div className="hidden lg:flex items-center group relative">
                  <div className="px-3 py-2 text-stone-800 font-[600] whitespace-nowrap hover:text-stone-900">
                    Products & Accessories
                  </div>
                  <ProductsDropdown />
                </div>
                <Link
                  href="/3d-printing"
                  className="px-3 py-2 text-stone-800 font-[600] whitespace-nowrap hover:text-stone-900"
                >
                  3D Printing
                </Link>
                <Link
                  href="/services"
                  className="px-3 py-2 text-stone-800 font-[600] whitespace-nowrap hover:text-stone-900"
                >
                  Services
                </Link>
                <Link
                  href="/support"
                  className="px-3 py-2 text-stone-800 font-[600] whitespace-nowrap hover:text-stone-900"
                >
                  Support
                </Link>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <div aria-hidden className="h-2 lg:h-3"></div>
    </>
  );
};

export default NavbarClient;
