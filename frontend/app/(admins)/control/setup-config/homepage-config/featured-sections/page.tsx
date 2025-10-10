import { AddFeaturedSectionForm } from "@/components/admin/setup_config/homepage/add-update-feat-section-form";
import { FeaturedSectionDataTable } from "@/components/admin/setup_config/homepage/comps/featured-section-datatable";
import axiosErrorLogger from "@/components/error/axios_error";
import { FeaturedSectionDisplayType } from "@/schemas/admin/setupconfig/homepage/featuredSections/featuredSchema";
import axiosIntercept from "@/utils/axios/axiosIntercept";
// import { unstable_noStore as noStore } from "next/cache";

const getFeaturedSections = async (): Promise<FeaturedSectionDisplayType[]> => {
    const axioswithIntercept = await axiosIntercept();

    // noStore();
    const featSectionsData = await axioswithIntercept.get(`/api/admin/lp/sections`)
        .then((res) => res.data.sections_data)
        .catch((error: any) => {
            axiosErrorLogger({ error });
            return [];
        });

    return featSectionsData;
};

const FeaturedSectionsPage = async () => {
    const featuredSectionsData = await getFeaturedSections();

    return (
        <div className="w-full h-fit flex flex-col px-5 md:px-7 py-8 gap-6 font-inter">
            <div className="flex flex-col gap-4">
                <h2 className="text-lg lg:text-xl font-bold tracking-tight text-stone-900">Featured Sections</h2>
                <AddFeaturedSectionForm />
            </div>
            <FeaturedSectionDataTable featuredSectionsData={featuredSectionsData} />
        </div>
    )
}

export default FeaturedSectionsPage;
