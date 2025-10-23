import { UpdateProductForm } from "@/components/admin/products/update-product-form";
import { AddProductFeaturesForm } from "@/components/admin/products/add-features-form";
import { AddProductSpecsForm } from "@/components/admin/products/add-specs-form";
import { currentRouteProps } from "@/utils/types_interfaces/shared_types";
import axiosIntercept from "@/utils/axios/axiosIntercept";
import axiosErrorLogger from "@/components/error/axios_error";
import { unstable_noStore as noStore } from "next/cache";


const AdminUpdateProductsPage = async ({ params }: { params: Promise<{ itemslug: string }> }) => {
    const axioswithIntercept = await axiosIntercept();

    // fetch item data from backend
    noStore();
    const { itemslug } = await params;
    const itemInfo = await axioswithIntercept.get(`/api/admin/items/item/${itemslug}`)
        .then((res) => {
            return res.data.item_data;
        })
        .catch((error: any) => {
            axiosErrorLogger({ error });
            return null;
        });

    if (!itemInfo) {
        return null;
    }

    const hasPrevFeatures = ((itemInfo.i_sectionsdata?.features_section?.header?.length > 0) || (itemInfo.i_sectionsdata?.features_section?.subsections?.length > 0));

    const hasPrevSpecs = (itemInfo.i_sectionsdata?.specifications_section?.length > 0);

    return (
        <div className="w-full min-h-[100vh] md:min-h-[calc(100vh-64px)] h-fit flex flex-col px-5 md:px-7 py-6 bg-stone-100 font-inter">
            <h2 className="w-fit font-[600] text-stone-800 text-sm md:text-[16px] md:leading-6 mb-4 underline underline-offset-4">
                Update a product
            </h2>
            <UpdateProductForm itemInfo={itemInfo} />
            <h2 className="w-fit font-[600] text-stone-800 text-sm md:text-[16px] md:leading-6 mt-8 mb-1 underline underline-offset-4">
                Features Section
            </h2>
            <AddProductFeaturesForm itemInfo={itemInfo} canUpdate={hasPrevFeatures} />
            <h2 className="w-fit font-[600] text-stone-800 text-sm md:text-[16px] md:leading-6 mt-8 mb-1 underline underline-offset-4">
                Specifications Section
            </h2>
            <AddProductSpecsForm itemInfo={itemInfo} canUpdate={hasPrevSpecs} />
        </div>
    );
}

export default AdminUpdateProductsPage;
