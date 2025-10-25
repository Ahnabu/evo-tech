import { AddCategoryForm } from "@/components/admin/taxonomy/categories/add-update-category-form";
import { CategoriesDataTable } from "@/components/admin/taxonomy/categories/comps/categories-datatable";
import axiosErrorLogger from "@/components/error/axios_error";
import { CategoryTableType } from "@/schemas/admin/product/taxonomySchemas";
import axios from "@/utils/axios/axios";
// import { unstable_noStore as noStore } from "next/cache";

const getCategories = async (): Promise<CategoryTableType[]> => {
    // noStore();
    const categoriesData = await axios.get(`/categories`)
        .then((res) => res.data.categories_data)
        .catch((error: any) => {
            axiosErrorLogger({ error });
            return [];
        });

    return categoriesData;
};

const CategoriesPage = async () => {
    const categoriesData = await getCategories();

    return (
        <div className="w-full h-fit flex flex-col px-5 md:px-7 py-8 gap-6 font-inter">
            <div className="flex flex-col gap-4">
                <h2 className="text-lg lg:text-xl font-bold tracking-tight text-stone-900">Categories</h2>
                <AddCategoryForm />
            </div>
            <CategoriesDataTable categoriesData={categoriesData} />
        </div>
    )
}

export default CategoriesPage;
