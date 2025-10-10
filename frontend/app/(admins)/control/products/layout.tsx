import { unstable_noStore as noStore } from "next/cache";
import axiosIntercept from "@/utils/axios/axiosIntercept";
import axiosErrorLogger from "@/components/error/axios_error";
import { FeaturedSectionProvider } from "@/components/providers/featured-section-provider";

interface ProductsLayoutProps {
    children: React.ReactNode;
}

const ProductsLayout = async ({ children }: ProductsLayoutProps) => {
    const axioswithIntercept = await axiosIntercept();

    // Fetch featured sections data for all products routes
    noStore();
    const sections = await axioswithIntercept.get(`/api/admin/lp/sections`)
        .then((res) => res.data.sections_data)
        .catch((error: any) => {
            axiosErrorLogger({ error });
            return [];
        });

    return (
        <FeaturedSectionProvider initialData={sections}>
            {children}
        </FeaturedSectionProvider>
    );
};

export default ProductsLayout;
