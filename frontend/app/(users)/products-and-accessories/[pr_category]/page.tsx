
import HorizontalMenu from "@/components/horizontal-menu";
import { currentRouteProps } from "@/utils/types_interfaces/shared_types";
import axios from "@/utils/axios/axios";
import axiosErrorLogger from "@/components/error/axios_error";
import { unstable_noStore as noStore } from "next/cache";
import type { Metadata } from "next";
import { ProductsContainer } from "@/components/products/products-container";
import DynamicTextBySlug from "./dynamic-text-by-slug";

export const metadata: Metadata = {
    title: "Products & Accessories",
};



const hrMenuItems: any[] = [
    {
        name: 'FDM 3D Printers',
        href: 'fdm-3d-printers'
    },
    {
        name: 'Resin 3D Printers',
        href: 'resin-3d-printers'
    },
    {
        name: 'Laser Engravers',
        href: 'laser-engravers'
    },
    {
        name: 'CNC Machines',
        href: 'cnc-machines'
    },
    {
        name: 'Filaments',
        href: 'filaments'
    },
];


const ProductCategory = async ({ params, searchParams }: currentRouteProps) => {
    // Await params and searchParams in Next.js 15
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    const category = resolvedParams.pr_category;
    const pageno = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page as string) : 1;
    const perpage = resolvedSearchParams.perpage ? parseInt(resolvedSearchParams.perpage as string) : 12;
    const instockfilter = resolvedSearchParams.instock ? resolvedSearchParams.instock as string : null;

    noStore(); // equivalent to cache: 'no-store' in fetch API
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.set('page', pageno.toString());
    queryParams.set('limit', perpage.toString());
    
    // If category is not "all", add it as filter
    if (category && category !== 'all') {
        queryParams.set('category', category);
    }
    
    if (instockfilter) {
        queryParams.set('inStock', instockfilter);
    }
    
    const productslist = await axios.get(`/api/products?${queryParams.toString()}`)
        .then((res) => (res.data))
        .catch((error: any) => {
            axiosErrorLogger({ error });
            return null;
        });

    // Transform backend product data to match frontend expectations
    const rawProducts = productslist?.data || productslist?.products || [];
    const productsData = rawProducts.map((product: any) => ({
        itemid: product._id || product.id,
        i_name: product.name,
        i_slug: product.slug,
        i_price: product.price,
        i_prevprice: product.previousPrice || 0,
        i_instock: product.inStock !== undefined ? product.inStock : true,
        i_mainimg: product.mainImage || '',
        i_category: product.category?.slug || product.category || '',
        i_subcategory: product.subcategory?.slug || product.subcategory || '',
        i_brand: product.brand?.slug || product.brand || '',
    }));
    
    const productsMeta = {
        currentPage: productslist?.meta?.page || productslist?.current_page || pageno,
        lastPage: Math.ceil((productslist?.meta?.total || productslist?.total_items || 0) / perpage),
        totalItems: productslist?.meta?.total || productslist?.total_items || 0,
        itemsPerPage: perpage,
    };


    return (
        <div className="w-full min-h-screen h-fit flex flex-col items-center font-inter">
            <DynamicTextBySlug slug={category} />

            <div className="w-full max-w-[1440px] h-fit pb-12 flex flex-col items-center">
                {/* <div className="flex w-full h-fit px-4 sm:px-8 md:px-12 pt-8 pb-2">
                    <HorizontalMenu menuitems={hrMenuItems} segmentLevelBelowLayout={1} routePrefix={`/products-and-accessories/`} />
                </div> */}

                <div className="flex flex-col w-full px-4 sm:px-8 md:px-12 pt-8 pb-8 gap-3">
                    <ProductsContainer fetchedProductsData={productsData} paginationMetaForData={productsMeta} />
                </div>
            </div>
        </div>
    );
}

export default ProductCategory;
