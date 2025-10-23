"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { Avatar } from "@nextui-org/avatar";
import useDebounce from "@rooks/use-debounce";
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
import {
  selectTaxonomyCategories,
  selectTaxonomyLoading,
  type TaxonomyCategory,
} from "@/store/slices/taxonomySlice";
import type { RootState } from "@/store/store";

const ProductsDropdown = () => {
  const categories = useSelector((state: RootState) =>
    selectTaxonomyCategories(state)
  );
  const isLoading = useSelector((state: RootState) =>
    selectTaxonomyLoading(state)
  );
  const [subMenu1, setSubMenu1] = useState<TaxonomyCategory | null>(null);
  const [subMenu2, setSubMenu2] = useState<any>(null);

  const showSubMenu1 = (category: TaxonomyCategory) => {
    if (subMenu2) setSubMenu2(null);
    setSubMenu1(category);
  };
  const hideSubMenu1 = () => setSubMenu1(null);
  const showSubMenu2 = (subcategory: any) => setSubMenu2(subcategory);
  const hideSubMenu2 = () => setSubMenu2(null);

  if (isLoading) {
    return (
      <div className="z-[18] absolute top-full left-1/2 -translate-x-1/2 px-3 gap-x-1 hidden group-hover:flex w-fit h-fit max-w-full rounded-[4px] overflow-hidden group-hover:animate-slow-reveal-flex text-[13px] leading-5 tracking-tight font-[600] text-stone-600 bg-[#ebebeb]/95 shadow-md shadow-black/10">
        <div className="w-[260px] h-[300px] max-h-[calc(100vh-100px)] pt-8 pb-3 flex flex-col items-center justify-center">
          <p className="text-stone-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="z-[18] absolute top-full left-1/2 -translate-x-1/2 px-3 gap-x-1 hidden group-hover:flex w-fit h-fit max-w-full rounded-[4px] overflow-hidden group-hover:animate-slow-reveal-flex text-[13px] leading-5 tracking-tight font-[600] text-stone-600 bg-[#ebebeb]/95 shadow-md shadow-black/10">
      <div className="w-[260px] h-[300px] max-h-[calc(100vh-100px)] pt-8 pb-3 flex flex-col items-center group-hover:animate-go-up overflow-auto scrollbar-hide">
        <div className="w-full h-fit py-px flex">
          <Link
            href="/products-and-accessories/all"
            className="w-full h-fit flex items-center bg-[#fefefe] hover:bg-stone-700 hover:text-stone-100 rounded-[2px] transition duration-100 ease-linear"
          >
            <p className="w-fit px-2 py-2">All Categories</p>
          </Link>
        </div>

        {categories.length > 0
          ? categories.map((category) => (
              <div
                key={`prod_menu${category.id}`}
                className="w-full h-fit py-px flex"
              >
                <Link
                  href={`/products-and-accessories${category.url}`}
                  className={`w-full h-fit flex items-center ${
                    subMenu1 && subMenu1?.id === category.id
                      ? "bg-stone-700 text-stone-100"
                      : "bg-[#fefefe]"
                  } hover:bg-stone-700 hover:text-stone-100 rounded-[2px] transition duration-100 ease-linear`}
                >
                  <p className="w-fit px-2 py-2">{category.name}</p>
                </Link>
                {category.has_subcategories ? (
                  subMenu1 && subMenu1?.id === category.id ? (
                    <button
                      onClick={hideSubMenu1}
                      title="back"
                      aria-label="back to categories"
                      className="min-w-7 w-7 h-[36px] flex justify-center items-center ml-0.5 rounded-[2px] bg-stone-500 hover:bg-stone-950 cursor-pointer"
                    >
                      <MdChevronLeft className="inline w-4 h-4 text-white" />
                    </button>
                  ) : (
                    <button
                      onClick={() => showSubMenu1(category)}
                      title="open"
                      aria-label={`open subcategories for ${category.name}`}
                      className="min-w-7 w-7 h-[36px] flex justify-center items-center ml-0.5 rounded-[2px] bg-stone-500 hover:bg-stone-950 cursor-pointer"
                    >
                      <MdChevronRight className="inline w-4 h-4 text-white" />
                    </button>
                  )
                ) : null}
              </div>
            ))
          : null}
      </div>

      {subMenu1 && (
        <div className="w-[250px] h-[300px] max-h-[calc(100vh-100px)] pt-8 pb-3 pl-2 flex flex-col items-center border-l-2 border-dotted border-stone-700/20 animate-go-up overflow-auto scrollbar-hide">
          <p className="flex w-full h-fit py-1 mb-3 justify-center bg-gradient-to-r from-transparent via-stone-400/20 to-transparent">
            {subMenu1.name}
          </p>
          {subMenu1.subcategories.map((subcategory) => (
            <div
              key={`pr_submenu_1_item${subcategory.id}`}
              className="w-full h-fit py-px flex"
            >
              <Link
                href={`/products-and-accessories${subcategory.url}`}
                className={`w-full h-fit flex items-center ${
                  subMenu2 && subMenu2?.id === subcategory.id
                    ? "bg-stone-700 text-stone-100"
                    : "bg-[#fefefe]"
                } hover:bg-stone-700 hover:text-stone-100 rounded-[2px] transition duration-100 ease-linear`}
              >
                <p className="w-fit px-2 py-2">{subcategory.name}</p>
              </Link>
              {subcategory.brands.length > 0 ? (
                subMenu2 && subMenu2?.id === subcategory.id ? (
                  <button
                    onClick={hideSubMenu2}
                    title="back"
                    aria-label="back to subcategories"
                    className="min-w-7 w-7 h-[36px] flex justify-center items-center ml-0.5 rounded-[2px] bg-stone-500 hover:bg-stone-950 cursor-pointer"
                  >
                    <MdChevronLeft className="inline w-4 h-4 text-white" />
                  </button>
                ) : (
                  <button
                    onClick={() => showSubMenu2(subcategory)}
                    title="open"
                    aria-label={`open brands for ${subcategory.name}`}
                    className="min-w-7 w-7 h-[36px] flex justify-center items-center ml-0.5 rounded-[2px] bg-stone-500 hover:bg-stone-950 cursor-pointer"
                  >
                    <MdChevronRight className="inline w-4 h-4 text-white" />
                  </button>
                )
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ServicesDropdown = ({ services = [] }: { services?: any[] }) => {
  return (
    <div className="z-[18] absolute top-full left-1/2 -translate-x-1/2 min-[1201px]:rounded-[4px] w-full max-w-[1200px] max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide hidden group-hover:flex justify-center items-start px-8 py-3 bg-[#ebebeb]/95 shadow-md shadow-black/10 group-hover:animate-slow-reveal-flex">
      <div className="w-full h-[250px] flex justify-center items-center gap-6 group-hover:animate-go-up">
        {services.length > 0 &&
          services.map((service: any, index: number) => (
            <ServiceCard
              key={`service_${index}`}
              gotourl={service.gotourl}
              imgsrc={service.imgsrc}
              name={service.name}
            />
          ))}
      </div>
    </div>
  );
};

const SupportDropdown = ({ support = [] }: { support?: any[] }) => {
  return (
    <div className="z-[18] absolute top-full left-1/2 -translate-x-1/2 min-[1201px]:rounded-[4px] w-full max-w-[1200px] max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide hidden group-hover:flex justify-center items-start px-8 py-3 bg-[#ebebeb]/95 shadow-md shadow-black/10 group-hover:animate-slow-reveal-flex">
      <div className="w-full h-[250px] flex justify-center items-center gap-6 group-hover:animate-go-up">
        {support.length > 0 &&
          support.map((supportitem: any, index: number) => (
            <ServiceCard
              key={`support_${index}`}
              gotourl={supportitem.gotourl}
              imgsrc={supportitem.imgsrc}
              name={supportitem.name}
            />
          ))}
      </div>
    </div>
  );
};

const NavbarClient = ({
  services,
  support,
}: {
  services: NavbarMenuType1[];
  support: NavbarMenuType1[];
}) => {
  const pathname = usePathname();
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
      await signOut({ redirect: false });
      toast.success("You signed out of your account.");
    } catch (err) {
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
        return "/dashboard";
    }
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
              <div className="px-3 py-1 rounded-full border border-green-600 text-green-800 font-[600]">
                01518949050
              </div>
              <button className="px-3 py-1 rounded-full bg-green-800 text-white">
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
                        className="flex items-center gap-3 hover:bg-stone-50 p-2 rounded-lg transition-colors"
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
                        <div className="hidden sm:block text-left">
                          <div className="text-sm font-[600] text-stone-700">
                            {currentUser.firstName}
                          </div>
                          <div className="text-xs text-stone-500 capitalize">
                            {currentUser.role?.toLowerCase() || 'User'}
                          </div>
                        </div>
                        <IoChevronDown className="hidden sm:block w-4 h-4 text-stone-500" />
                      </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Content
                      align="end"
                      sideOffset={6}
                      className="min-w-[160px] bg-white rounded-md shadow-lg border border-stone-200 py-1 z-[60]"
                    >
                      <DropdownMenu.Item asChild>
                        <Link
                          href="/profile"
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
                          href="/order-history"
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
                      <Link 
                        href="/login"
                        className="flex items-center gap-2"
                      >
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

      <div aria-hidden className="h-6 lg:h-8"></div>
    </>
  );
};

export default NavbarClient;
