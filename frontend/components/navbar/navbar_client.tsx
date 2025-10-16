"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import Link from 'next/link';
import { Avatar } from "@nextui-org/avatar";
import useDebounce from '@rooks/use-debounce';
import { signOut } from "next-auth/react";

import EvoTechBDLogoGray from '@/public/assets/EvoTechBD-logo-gray.png';
import EvoTechBDLogoWhite from '@/public/assets/EvoTechBD-logo-white.png';
import { MdCall, MdChevronRight, MdChevronLeft } from "react-icons/md";
import { IoChevronDown, IoMenu, IoClose } from "react-icons/io5";
// import { RiHeartLine } from "react-icons/ri";
import { FiSearch } from "react-icons/fi";
import { TbLogout } from "react-icons/tb";
import { BsFacebook, BsInstagram, BsWhatsapp } from "react-icons/bs";
import ServiceCard from '@/components/cards/servicecard';
import ManageCart from '@/components/navbar/manage_cart';
import { getNameInitials } from '@/utils/essential_functions';
import type { NavbarMenuType1 } from './navbar';
import { toast } from 'sonner';
import { useCurrentUser } from '@/hooks/use-current-user';
import { selectTaxonomyCategories, selectTaxonomyLoading, type TaxonomyCategory } from '@/store/slices/taxonomySlice';
import type { RootState } from '@/store/store';

const ProductsDropdown = () => {
    const categories = useSelector((state: RootState) => selectTaxonomyCategories(state));
    const isLoading = useSelector((state: RootState) => selectTaxonomyLoading(state));
    const [subMenu1, setSubMenu1] = useState<TaxonomyCategory | null>(null);
    const [subMenu2, setSubMenu2] = useState<any>(null);

    const showSubMenu1 = (category: TaxonomyCategory) => {
        if (subMenu2) { setSubMenu2(null); }
        setSubMenu1(category);
    };

    const hideSubMenu1 = () => {
        if (subMenu2) { setSubMenu2(null); }
        setSubMenu1(null);
    };

    const showSubMenu2 = (subcategory: any) => {
        setSubMenu2(subcategory);
    };

    const hideSubMenu2 = () => {
        setSubMenu2(null);
    };

    if (isLoading) {
        return (
            <div className="z-[18] absolute top-full left-[150px] px-3 gap-x-1 hidden group-hover:flex w-fit h-fit max-w-full rounded-[4px] overflow-hidden group-hover:animate-slow-reveal-flex text-[13px] leading-5 tracking-tight font-[600] text-stone-600 bg-[#ebebeb]/95 shadow-md shadow-black/10">
                <div className="w-[260px] h-[300px] max-h-[calc(100vh-100px)] pt-8 pb-3 flex flex-col items-center justify-center">
                    <p className="text-stone-500">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="z-[18] absolute top-full left-[150px] px-3 gap-x-1 hidden group-hover:flex w-fit h-fit max-w-full rounded-[4px] overflow-hidden group-hover:animate-slow-reveal-flex text-[13px] leading-5 tracking-tight font-[600] text-stone-600 bg-[#ebebeb]/95 shadow-md shadow-black/10">
            <div className="w-[260px] h-[300px] max-h-[calc(100vh-100px)] pt-8 pb-3 flex flex-col items-center group-hover:animate-go-up overflow-auto scrollbar-hide">
                {/* All Categories option */}
                <div className="w-full h-fit py-px flex">
                    <Link href="/products-and-accessories/all" className="w-full h-fit flex items-center bg-[#fefefe] hover:bg-stone-700 hover:text-stone-100 rounded-[2px] transition duration-100 ease-linear">
                        <p className="w-fit px-2 py-2">All Categories</p>
                    </Link>
                </div>
                
                {/* Dynamic categories from taxonomy */}
                {categories.length > 0 ? categories.map((category) => (
                    <div key={`prod_menu${category.id}`} className="w-full h-fit py-px flex">
                        <Link href={`/products-and-accessories${category.url}`} className={`w-full h-fit flex items-center ${(subMenu1 && subMenu1?.id === category.id) ? 'bg-stone-700 text-stone-100' : 'bg-[#fefefe]'} hover:bg-stone-700 hover:text-stone-100 rounded-[2px] transition duration-100 ease-linear`}>
                            <p className="w-fit px-2 py-2">{category.name}</p>
                        </Link>
                        {category.has_subcategories ?
                            (subMenu1 && subMenu1?.id === category.id) ?
                                <button onClick={hideSubMenu1} className="min-w-7 w-7 h-[36px] flex justify-center items-center ml-0.5 rounded-[2px] bg-stone-500 hover:bg-stone-950 cursor-pointer"><MdChevronLeft className="inline w-4 h-4 text-white" /></button>
                                :
                                <button onClick={() => showSubMenu1(category)} className="min-w-7 w-7 h-[36px] flex justify-center items-center ml-0.5 rounded-[2px] bg-stone-500 hover:bg-stone-950 cursor-pointer"><MdChevronRight className="inline w-4 h-4 text-white" /></button>
                            : null
                        }
                    </div>
                )) : null}
            </div>
            
            {/* Subcategories menu */}
            {subMenu1 && (
                <div className="w-[250px] h-[300px] max-h-[calc(100vh-100px)] pt-8 pb-3 pl-2 flex flex-col items-center border-l-2 border-dotted border-stone-700/20 animate-go-up overflow-auto scrollbar-hide">
                    <p className="flex w-full h-fit py-1 mb-3 justify-center bg-gradient-to-r from-transparent via-stone-400/20 to-transparent">
                        {subMenu1.name}
                    </p>
                    {subMenu1.subcategories.map((subcategory) => (
                        <div key={`pr_submenu_1_item${subcategory.id}`} className="w-full h-fit py-px flex">
                            <Link href={`/products-and-accessories${subcategory.url}`} className={`w-full h-fit flex items-center ${(subMenu2 && subMenu2?.id === subcategory.id) ? 'bg-stone-700 text-stone-100' : 'bg-[#fefefe]'} hover:bg-stone-700 hover:text-stone-100 rounded-[2px] transition duration-100 ease-linear`}>
                                <p className="w-fit px-2 py-2">{subcategory.name}</p>
                            </Link>
                            {subcategory.brands.length > 0 ?
                                (subMenu2 && subMenu2?.id === subcategory.id) ?
                                    <button onClick={hideSubMenu2} className="min-w-7 w-7 h-[36px] flex justify-center items-center ml-0.5 rounded-[2px] bg-stone-500 hover:bg-stone-950 cursor-pointer"><MdChevronLeft className="inline w-4 h-4 text-white" /></button>
                                    :
                                    <button onClick={() => showSubMenu2(subcategory)} className="min-w-7 w-7 h-[36px] flex justify-center items-center ml-0.5 rounded-[2px] bg-stone-500 hover:bg-stone-950 cursor-pointer"><MdChevronRight className="inline w-4 h-4 text-white" /></button>
                                : null
                            }
                        </div>
                    ))}
                </div>
            )}
            
            {/* Brands menu */}
            {subMenu2 && (
                <div className="w-[250px] h-[300px] max-h-[calc(100vh-100px)] pt-8 pb-3 pl-2 flex flex-col items-center border-l-2 border-dotted border-stone-700/20 animate-go-up overflow-auto scrollbar-hide">
                    <p className="flex w-full h-fit py-1 mb-3 justify-center bg-gradient-to-r from-transparent via-stone-400/20 to-transparent">
                        {subMenu2.name}
                    </p>
                    {subMenu2.brands.map((brand: any) => (
                        <div key={`pr_submenu_2_item${brand.id}`} className="w-full h-fit py-px flex">
                            <Link href={brand.url} className="w-full h-fit flex items-center bg-[#fefefe] hover:bg-stone-700 hover:text-stone-100 rounded-[2px] transition duration-100 ease-linear">
                                <p className="w-fit px-2 py-2">{brand.name}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

const ServicesDropdown = ({ services = [] }: { services?: any[]; }) => {
    return (
        <div className="z-[18] absolute top-full left-1/2 -translate-x-1/2 min-[1201px]:rounded-[4px] w-full max-w-[1200px] max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide hidden group-hover:flex justify-center items-start px-8 py-3 bg-[#ebebeb]/95 shadow-md shadow-black/10 group-hover:animate-slow-reveal-flex">
            <div className="w-full h-[250px] flex justify-center items-center gap-6 group-hover:animate-go-up">
                {
                    services.length > 0 && services.map((service: any, index: number) => {
                        return (
                            <ServiceCard key={`service_${index}`} gotourl={service.gotourl} imgsrc={service.imgsrc} name={service.name} />
                        )
                    })
                }
            </div>
        </div>
    );
}

const SupportDropdown = ({ support = [] }: { support?: any[]; }) => {
    return (
        <div className="z-[18] absolute top-full left-1/2 -translate-x-1/2 min-[1201px]:rounded-[4px] w-full max-w-[1200px] max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-hide hidden group-hover:flex justify-center items-start px-8 py-3 bg-[#ebebeb]/95 shadow-md shadow-black/10 group-hover:animate-slow-reveal-flex">
            <div className="w-full h-[250px] flex justify-center items-center gap-6 group-hover:animate-go-up">
                {
                    support.length > 0 && support.map((supportitem: any, index: number) => {
                        return (
                            <ServiceCard key={`support_${index}`} gotourl={supportitem.gotourl} imgsrc={supportitem.imgsrc} name={supportitem.name} />
                        )
                    })
                }
            </div>
        </div>
    );
}

const NavbarClient = ({ services, support }: { services: NavbarMenuType1[]; support: NavbarMenuType1[]; }) => {
    const pathname = usePathname();
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState<boolean | null>(null);

    const currentUser = useCurrentUser();

    const detectScrollPositionDebounced = useDebounce(() => {
        (window?.scrollY < 32) ? setIsScrolled(false) : setIsScrolled(true);
    }, 5);

    useEffect(() => {
        // detect and update state on initial render
        detectScrollPositionDebounced();
        window.addEventListener("scroll", detectScrollPositionDebounced as EventListener);

        return () => {
            window.removeEventListener("scroll", detectScrollPositionDebounced as EventListener);
        }
    }, [detectScrollPositionDebounced]);

    const handleSignOutDebounced = useDebounce(async () => {
        try {
            // won't redirect anywhere and the page won't reload, middleware will handle redirection for protected routes.
            await signOut({
                redirect: false,
            });
            toast.success("You signed out of your account.");
        } catch (err) {
            toast.error("Something went wrong while signing out.");
        }
    }, 200);

    const toggleMenu = () => {
        setMenuIsOpen(!menuIsOpen);
    };

    const isCurrentURL = (word: string) => {
        const pathSegments = pathname.split("/").filter(Boolean);

        return pathSegments[0] === word;
    };

    return (
        <>
            <div className="z-[200] relative flex justify-center w-full h-8 bg-[#DDDEE0]/95 font-inter">
                <div className="flex items-center justify-center sm:justify-between w-full max-w-[1440px] h-full px-4 sm:px-7 md:px-10">
                    <div className="flex w-fit h-full items-center font-[500] text-[12px] leading-4 tracking-[-0.015em] text-stone-800">
                        <span className="flex w-fit h-full items-center"><MdCall className="inline w-4 h-4 mr-1" />+880 1799 424854</span>
                    </div>
                    <div className="hidden sm:flex w-fit h-full items-center font-[600] text-[12px] leading-4 text-stone-800 gap-1.5">
                        <a href="https://www.facebook.com/EvoTechBD22" target="_blank" rel="noopener noreferrer" aria-label="facebook link" className="flex w-fit h-full items-center px-2 hover:text-[#0866FF] transition duration-200 focus:outline-none">
                            <BsFacebook className="inline w-4 h-4" />
                        </a>
                        <a href="#" target="_blank" rel="noopener noreferrer" aria-label="instagram link" className="flex w-fit h-full items-center px-2 hover:text-[#e9065d] transition duration-200 focus:outline-none pointer-events-none">
                            <BsInstagram className="inline w-4 h-4" />
                        </a>
                        <a href="https://wa.me/+8801799424854/" target="_blank" rel="noopener noreferrer" aria-label="whatsapp link" className="flex w-fit h-full items-center px-2 hover:text-[#13cc5d] transition duration-200 focus:outline-none">
                            <BsWhatsapp className="inline w-4 h-4" />
                        </a>
                        <div className="flex w-[1px] h-3 bg-stone-800"></div>
                        {/* remember to remove pointer-events-none from the links below after functionalities are ready */}
                        <Link href="/login" className="flex w-fit h-full items-center px-2 hover:text-stone-500 transition duration-200 focus:outline-none pointer-events-none">Sign up</Link>
                        <div className="flex w-[1px] h-3 bg-stone-800"></div>
                        <Link href="/register" className="flex w-fit h-full items-center px-2 hover:text-stone-500 transition duration-200 focus:outline-none pointer-events-none">Sign in</Link>
                    </div>
                </div>
            </div>

            {isScrolled !== null ?
                <div className={`z-[200] isolate sticky top-0 ${isScrolled ? 'before:bg-[#f5f5f5]/95 before:backdrop-blur-[3px] shadow-md shadow-black/10' : 'before:bg-transparent'} w-full h-[60px] sm:h-[68px] flex justify-center before:z-[-2] before:absolute before:content-[''] before:w-full before:h-full before:transition before:[transition-duration:75ms] before:ease-linear font-inter group/navbarfixed`}>
                    <div className="relative flex items-center justify-between w-full max-w-[1440px] h-full px-4 sm:px-7 md:px-10">
                        <div className="max-lg:absolute max-lg:top-0 max-lg:left-1/2 max-lg:-translate-x-1/2 flex items-center w-fit h-full gap-8">
                            <Link href="/" className="relative flex min-w-[110px] sm:min-w-[150px] min-h-[52px] w-fit h-fit focus:outline-none">
                                <Image
                                    src={EvoTechBDLogoGray}
                                    alt="Evo-TechBD Logo"
                                    draggable={false}
                                    quality={100}
                                    width={160}
                                    height={60}
                                    className={`${isScrolled ? 'w-auto h-auto scale-100' : 'w-0 h-0 scale-0'} max-w-[110px] sm:max-w-[150px] max-h-[52px] object-contain origin-left`}
                                    priority
                                />
                                <Image
                                    src={EvoTechBDLogoWhite}
                                    alt="Evo-TechBD Logo"
                                    draggable={false}
                                    quality={100}
                                    width={160}
                                    height={60}
                                    className={`${isScrolled ? 'w-0 h-0 scale-0' : 'w-auto h-auto scale-100'} max-w-[110px] sm:max-w-[150px] max-h-[52px] object-contain origin-left`}
                                    priority
                                />
                            </Link>
                            <div className={`hidden lg:flex w-fit h-full font-[600] text-[14px] leading-5 ${isScrolled ? 'text-stone-900' : 'text-stone-300'} tracking-tight`}>
                                <div className="flex w-fit h-full touch-manipulation group peer/products focus:outline-none">
                                    <div className={`relative flex w-fit h-full px-4 items-center ${isCurrentURL('products-and-accessories') ? '' : ''} focus:outline-none cursor-pointer`}>
                                        Products & Accessories<span className="w-fit h-fit ml-0.5"><IoChevronDown className="inline w-3 h-3 group-hover:[transform:_rotateX(-180deg)] transition-transform duration-0 ease-linear group-hover:delay-200" /></span>
                                        <span className={`absolute w-[calc(100%-2rem)] h-[2px] opacity-0 group-hover:opacity-100 left-4 bottom-4 bg-transparent ${isScrolled ? 'group-hover:bg-stone-700' : 'group-hover:bg-stone-300'} transition-[opacity,_background-color] duration-200 ease-linear`}></span>
                                    </div>
                                    <ProductsDropdown />
                                </div>
                                <div className="flex w-fit h-full group focus:outline-none">
                                    <Link href="https://www.facebook.com/3DPrintBD22/" className={`relative flex w-fit h-full px-4 items-center ${isCurrentURL('3d-printing') ? '' : ''} focus:outline-none`}>
                                        3D Printing
                                        <span className={`absolute w-[calc(100%-2rem)] h-[2px] opacity-0 group-hover:opacity-100 left-4 bottom-4 bg-transparent ${isScrolled ? 'group-hover:bg-stone-700' : 'group-hover:bg-stone-300'} transition-[opacity,_background-color] duration-200 ease-linear`}></span>
                                    </Link>
                                </div>
                                <div className="flex w-fit h-full group peer/services focus:outline-none">
                                    <div className={`relative flex w-fit h-full px-4 items-center ${isCurrentURL('services') ? '' : ''} focus:outline-none cursor-pointer`}>
                                        Services<span className="w-fit h-fit ml-0.5"><IoChevronDown className="inline w-3 h-3 group-hover:[transform:_rotateX(-180deg)] transition-transform duration-0 ease-linear group-hover:delay-200" /></span>
                                        <span className={`absolute w-[calc(100%-2rem)] h-[2px] opacity-0 group-hover:opacity-100 left-4 bottom-4 bg-transparent ${isScrolled ? 'group-hover:bg-stone-700' : 'group-hover:bg-stone-300'} transition-[opacity,_background-color] duration-200 ease-linear`}></span>
                                    </div>
                                    <ServicesDropdown services={services} />
                                </div>
                                <div className="flex w-fit h-full group peer/support focus:outline-none">
                                    <div className={`relative flex w-fit h-full px-4 items-center ${isCurrentURL('support') ? '' : ''} focus:outline-none cursor-pointer`}>
                                        Support<span className="w-fit h-fit ml-0.5"><IoChevronDown className="inline w-3 h-3 group-hover:[transform:_rotateX(-180deg)] transition-transform duration-0 ease-linear group-hover:delay-200" /></span>
                                        <span className={`absolute w-[calc(100%-2rem)] h-[2px] opacity-0 group-hover:opacity-100 left-4 bottom-4 bg-transparent ${isScrolled ? 'group-hover:bg-stone-700' : 'group-hover:bg-stone-300'} transition-[opacity,_background-color] duration-200 ease-linear`}></span>
                                    </div>
                                    <SupportDropdown support={support} />
                                </div>
                                <div className="z-[-4] fixed top-8 inset-x-0 bottom-0 hidden peer-hover/products:flex peer-hover/services:flex peer-hover/support:flex peer-hover/products:animate-slow-reveal-flex peer-hover/services:animate-slow-reveal-flex peer-hover/support:animate-slow-reveal-flex backdrop-blur-[1px] backdrop-brightness-90 pointer-events-none select-none"></div>
                            </div>
                        </div>
                        <div className="flex lg:hidden w-fit h-full items-center text-stone-800">
                            <button onClick={toggleMenu} type="button" aria-label="navbar menu button" className={`relative flex w-8 h-8 sm:w-9 sm:h-9 p-1 rounded-[5px] overflow-hidden ${isScrolled ? 'text-stone-900 hover:text-stone-700' : 'text-stone-100 hover:text-stone-300'} transition duration-200`}>
                                <IoMenu className={`inline-block w-full h-full ${menuIsOpen ? 'scale-0' : 'scale-100'} origin-center transition-transform duration-300`} />
                                <div className={`absolute inset-0 p-1 flex ${menuIsOpen ? 'scale-100' : 'scale-0'} origin-center transition-transform duration-300`}>
                                    <IoClose className="inline-block w-full h-full" />
                                </div>
                            </button>
                        </div>
                        <div className={`flex w-fit h-full items-center gap-2 sm:gap-4 ${isScrolled ? 'text-stone-900' : 'text-stone-100'}`}>
                            <button type="button" className="relative flex w-fit h-fit p-1 rounded-full group focus:outline-none" title="search" aria-label="search icon">
                                <FiSearch className="block w-4 h-4 sm:w-5 sm:h-5 group-hover:opacity-65 transition-opacity duration-200 ease-linear" />
                            </button>
                            {/* <button type="button" className="relative hidden lg:flex w-fit h-fit p-1 rounded-full group focus:outline-none" title={`wishlist`} aria-label="wishlist icon">
                                <RiHeartLine className="block w-4 h-4 sm:w-5 sm:h-5 group-hover:opacity-65 transition-opacity duration-200 ease-linear" />
                                {<div className="absolute top-[-7px] right-[-6px] min-w-4 min-h-4 w-fit h-fit px-1 py-0.5 flex justify-center items-center rounded-full bg-[#0866ff] text-[10px] leading-[12px] font-[600] text-[#FFFFFF]">{`9+`}</div>}
                            </button> */}
                            <ManageCart />
                            {
                                currentUser &&
                                (<div className="relative hidden lg:flex w-fit h-fit py-2 group">
                                    <Avatar
                                        aria-label="user menu"
                                        showFallback
                                        name={getNameInitials(`${currentUser.firstName} ${currentUser.lastName}`)}
                                        radius="full"
                                        classNames={{
                                            base: "w-7 h-7 bg-[#f5f5f4] box-border border-0 outline-0 ring-1 ring-[#a8a8a8] group-hover:ring-[#0866ff] cursor-pointer transition duration-200",
                                            name: "text-[#292524] text-[11px] leading-3 tracking-tight font-[600]",
                                            icon: "w-6 h-6 text-[#292524]",
                                        }}
                                    />
                                    <div className="absolute z-[20] top-[100%] right-0 rounded-[6px] overflow-hidden hidden group-hover:flex flex-col items-center w-[200px] h-fit cursor-auto text-stone-900 bg-[#ebebeb]/95 shadow-md shadow-black/15 group-hover:animate-slow-reveal-flex">
                                        <p className="text-left flex flex-col w-full h-fit px-4 py-2 bg-[#fefefe]/40 gap-0.5 cursor-default">
                                            <span className="font-[600] text-stone-900 text-[13px] leading-4 tracking-tight truncate">{`${currentUser.firstName} ${currentUser.lastName}`}</span>
                                            <span className="font-[400] text-stone-700 text-[11px] leading-4 tracking-tight truncate">{`${currentUser.email}`}</span>
                                        </p>

                                        <div className="w-full h-[1px] bg-[#bdbdbd] border-0 outline-0"></div>
                                        <div className="w-full h-fit px-4 py-[10px] text-[12px] leading-4 tracking-tight font-[600] bg-[#fefefe] bg-opacity-0 hover:bg-opacity-100 transition duration-150 cursor-pointer">Profile</div>
                                        <div className="w-full h-fit px-4 py-[10px] text-[12px] leading-4 tracking-tight font-[600] bg-[#fefefe] bg-opacity-0 hover:bg-opacity-100 transition duration-150 cursor-pointer">History</div>
                                        <div className="w-full h-fit px-4 py-[10px] text-[12px] leading-4 tracking-tight font-[600] bg-[#fefefe] bg-opacity-0 hover:bg-opacity-100 transition duration-150 cursor-pointer">Reward Points</div>
                                        <div className="w-full h-[1px] bg-[#bdbdbd] border-0 outline-0"></div>

                                        <button type="button"
                                            onClick={handleSignOutDebounced as React.MouseEventHandler<HTMLButtonElement>}
                                            aria-label="logout button"
                                            className="w-full h-fit px-4 py-[10px] flex items-center bg-[#fefefe] bg-opacity-0 hover:bg-opacity-100 font-[600] text-[12px] leading-4 tracking-tight transition duration-150"
                                        >
                                            <span className="flex items-center w-fit"><TbLogout className="inline mr-2 w-[14px] h-[14px]" />Logout</span>
                                        </button>
                                    </div>
                                </div>)
                            }
                        </div>
                    </div>
                </div>
                :
                <div className={`z-[200] isolate sticky top-0 bg-transparent w-full h-[60px] sm:h-[68px]`}></div>
            }
        </>
    );
}

export default NavbarClient;
