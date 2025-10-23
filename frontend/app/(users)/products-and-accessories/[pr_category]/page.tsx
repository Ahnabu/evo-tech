
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


const ProductCategory = async ({ params, searchParams }: { params: Promise<{ pr_category: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {

    const { pr_category: category } = await params;
    const resolvedSearchParams = await searchParams;
    const pageno = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page as string) : 1;
    const perpage = resolvedSearchParams.perpage ? parseInt(resolvedSearchParams.perpage as string) : 12;
    const instockfilter = resolvedSearchParams.instock ? resolvedSearchParams.instock as string : null;

    noStore(); // equivalent to cache: 'no-store' in fetch API
    const productslist = await axios.get(`/api/items/category/${category}?page=${pageno}&perpage=${perpage}${instockfilter ? `&instock=${instockfilter}` : ''}`)
        .then((res) => (res.data))
        .catch((error: any) => {
            axiosErrorLogger({ error });
            return null;
        });


    const productsData = productslist?.items_data || [];
    const productsMeta = {
        currentPage: productslist?.current_page || 1,
        lastPage: productslist?.last_page || 1,
        totalItems: productslist?.total_items || 0,
        itemsPerPage: productslist?.per_page || 12,
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
