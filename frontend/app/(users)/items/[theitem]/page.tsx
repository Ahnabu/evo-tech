import ThumbnailCarousel from "@/components/carousels/thumbnailcarousel";
import { BreadCrumbItems } from "@/utils/types_interfaces/shared_interfaces";
import EvoBreadcrumbs from "@/components/ui/evo_breadcrumbs";
import ItemInteractivePart from "./item-interactive-part";
import ItemSections from "./item-sections";
import { currencyFormatBDT } from "@/lib/all_utils";
import StarRating from "@/components/star-rating";
import { Metadata } from "next";
import { currentRouteProps } from "@/utils/types_interfaces/shared_types";
import axiosErrorLogger from "@/components/error/axios_error";
import axios from "@/utils/axios/axios";
import { Suspense } from "react";


export const generateMetadata = async (
    { params }: currentRouteProps,
): Promise<Metadata> => {
    const itemslug = params.theitem;

    const itemname = itemslug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char: string) => char.toUpperCase())
    .slice(0, 40) + (itemslug.replace(/-/g, " ").length > 40 ? "..." : ""); // later can change this to fetch item name from database using itemslug if needed
    
    return {
        title: itemname,
    };
}


const fetchItemData = async ( itemSlugHere: string ) => {

    // fetch item data from backend
    const itemInfo = await axios.get(`/api/items/item/${itemSlugHere}`)
    .then((res) => res.data)
    .then((data: any) => {
        return data.item_data;
    })
    .catch((error: any) => {
        axiosErrorLogger({ error });
        return null;
    });
    
    return itemInfo;
};


const IndividualItem = async ({ params }: currentRouteProps) => {

    const [ itemInfo ] = await Promise.all([fetchItemData(params.theitem)]);

    if (!itemInfo) {
        return (
            <>
                <div className="w-full min-h-[60px] sm:min-h-[68px] bg-stone-800 translate-y-[-60px] sm:translate-y-[-68px] mb-[-60px] sm:mb-[-68px]">
                </div>
                <div className="w-full h-[400px] flex items-center justify-center font-inter bg-gradient-to-b from-stone-800 from-10% to-transparent">
                    <p className="w-full text-center text-[13px] sm:text-[16px] leading-6 font-[400] text-stone-100">Item not found</p>
                </div>
            </>
        );
    }

    const breadcrumbData: BreadCrumbItems[] = [
        {
            content: <span>Home</span>,
            href: "/",
        },
        {
            content: <span>{itemInfo.i_name}</span>,
            href: `/items/${itemInfo.i_slug}`,
        },
    ];



    return (
        <>
            <div className="w-full min-h-[60px] sm:min-h-[68px] bg-gradient-to-br from-stone-950 via-stone-600 via-60% to-stone-900 translate-y-[-60px] sm:translate-y-[-68px] mb-[-60px] sm:mb-[-68px]">
            </div>

            <div className="w-full max-w-[1440px] h-fit pb-12 flex flex-col items-center font-inter">

                <div id="item-page-header" className="flex flex-col w-full min-h-[400px] px-4 sm:px-8 md:px-12 pt-3 pb-8 sm:pb-12 gap-4">
                    <EvoBreadcrumbs breadcrumbitemsdata={breadcrumbData} />
                    <div className="flex flex-col items-center lg:flex-row lg:justify-end lg:items-start w-full h-fit px-4 gap-4">

                        <ThumbnailCarousel imgdata={itemInfo.i_images} uniqueid="indiv-item-display-carousel" />

                        <div className="flex flex-col w-full lg:max-w-[420px] min-[1100px]:max-w-[500px] min-[1250px]:max-w-[650px] h-fit gap-4 px-4 text-stone-700">
                            <h1 className="w-full h-fit font-[600] text-[20px] leading-7 tracking-tight text-stone-950">
                                {itemInfo.i_name}
                            </h1>

                            <div className="flex flex-wrap justify-between w-full h-fit gap-x-8 gap-y-2 min-[1320px]:pr-10">
                                <div className="flex items-center w-fit h-fit gap-2">
                                    <span className="text-[16px] md:text-[18px] leading-6 font-[600] tracking-tight">{`BDT ${currencyFormatBDT(itemInfo.i_price)}`}</span>
                                    {(currencyFormatBDT(itemInfo.i_prevprice) !== currencyFormatBDT(0)) &&
                                        <span className="text-[14px] md:text-[16px] leading-6 font-[500] tracking-tight line-through text-[#a19d9a]">{currencyFormatBDT(itemInfo.i_prevprice)}</span>
                                    }
                                </div>
                                <div className="flex items-center w-fit h-fit gap-1">
                                    <StarRating rating={itemInfo.i_rating} />
                                    <span className="text-[13px] sm:text-[14px] leading-6 font-[400] text-stone-400 hover:text-stone-500">{`(${itemInfo.i_reviews})`}</span>
                                </div>
                            </div>

                            <div className="flex items-center w-full h-fit gap-2">
                                <p className="w-fit text-[12px] md:text-[13px] leading-5 font-[500] text-stone-600">{`Status: `}<span className={`w-fit h-fit ${itemInfo.i_instock ? 'text-emerald-500' : 'text-red-400'}`}>{`${itemInfo.i_instock ? 'In Stock' : 'Out of Stock'}`}</span></p>
                            </div>

                            {itemInfo.i_features && itemInfo.i_features.length > 0 &&
                                <ul className="flex flex-col w-full h-fit list-disc list-outside border-t border-stone-300 my-2 pl-8 pr-4 pt-5 pb-3 gap-0.5">
                                    {
                                        itemInfo.i_features.map((feature: string, idx: number) => (
                                            <li key={`i_topfeature_${idx}`} className="w-full h-fit text-[12px] md:text-[13px] leading-5 font-[500] text-stone-800">{feature}</li>
                                        ))
                                    }
                                </ul>
                            }

                            <div className="relative flex w-full h-fit my-1">
                                <Suspense
                                    fallback={<div className="w-full min-h-[200px] flex items-center justify-center"><p className="text-[13px] leading-5 font-[500] text-stone-600">Loading...</p></div>}
                                >
                                    <ItemInteractivePart singleitem={itemInfo} />
                                </Suspense>
                            </div>

                        </div>
                    </div>
                </div>

                {itemInfo.i_sectionsdata &&
                    <ItemSections
                        itemId={itemInfo.itemid}
                        featuresdata={itemInfo.i_sectionsdata.features_section}
                        specsdata={itemInfo.i_sectionsdata.specifications_section}
                    />
                }

            </div>
        </>
    );
}

IndividualItem.displayName = "IndividualItem";

export default IndividualItem;
