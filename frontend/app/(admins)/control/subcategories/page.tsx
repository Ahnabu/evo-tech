import { AddSubcategoryForm } from "@/components/admin/taxonomy/subcategories/add-update-subcategory-form";
import { SubcategoriesDataTable } from "@/components/admin/taxonomy/subcategories/comps/subcategories-datatable";
import axiosErrorLogger from "@/components/error/axios_error";
import { SubcategoryTableType } from "@/schemas/admin/product/taxonomySchemas";
import axiosIntercept from "@/utils/axios/axiosIntercept";
// import { unstable_noStore as noStore } from "next/cache";

const getSubcategories = async (): Promise<SubcategoryTableType[]> => {
    const axioswithIntercept = await axiosIntercept();

    // noStore();
    const subcategoriesData = await axioswithIntercept.get(`/api/admin/subcategory/all`)
        .then((res) => res.data.subcategories_data)
        .catch((error: any) => {
            axiosErrorLogger({ error });
            return [];
        });

    return subcategoriesData;
};

const SubcategoriesPage = async () => {
    const subcategoriesData = await getSubcategories();

    return (
        <div className="w-full h-fit flex flex-col px-5 md:px-7 py-8 gap-6 font-inter">
            <div className="flex flex-col gap-4">
                <h2 className="text-lg lg:text-xl font-bold tracking-tight text-stone-900">Subcategories</h2>
                <AddSubcategoryForm />
            </div>
            <SubcategoriesDataTable subcategoriesData={subcategoriesData} />
        </div>
    )
}

export default SubcategoriesPage;
