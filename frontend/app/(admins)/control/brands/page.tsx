import { AddBrandForm } from "@/components/admin/taxonomy/brands/add-update-brand-form";
import { BrandsDataTable } from "@/components/admin/taxonomy/brands/comps/brands-datatable";
import axiosErrorLogger from "@/components/error/axios_error";
import { BrandTableType } from "@/schemas/admin/product/taxonomySchemas";
import axios from "@/utils/axios/axios";
// import { unstable_noStore as noStore } from "next/cache";

const getBrands = async (): Promise<BrandTableType[]> => {
    // noStore();
    const brandsData = await axios.get(`/brands`)
        .then((res) => res.data.brands_data)
        .catch((error: any) => {
            axiosErrorLogger({ error });
            return [];
        });

    return brandsData;
};

const BrandsPage = async () => {
    const brandsData = await getBrands();

    return (
        <div className="w-full h-fit flex flex-col px-5 md:px-7 py-8 gap-6 font-inter">
            <div className="flex flex-col gap-4">
                <h2 className="text-lg lg:text-xl font-bold tracking-tight text-stone-900">Brands</h2>
                <AddBrandForm />
            </div>
            <BrandsDataTable brandsData={brandsData} />
        </div>
    )
}

export default BrandsPage;
