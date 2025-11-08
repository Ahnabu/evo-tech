import Link from "next/link";
import { ProductsDataTable } from "@/components/admin/products/comps/products-data-table";
import { ProductHeaderClient } from "@/components/admin/products/product-header-client";
import { Metadata } from "next";
import { ProductsCount } from "@/components/admin/products/comps/products-count";

export const metadata: Metadata = {
    title: "Products",
    description: "View and manage products",
};

const AdminProductsPage = () => {
    return (
        <div className="w-full h-fit flex flex-col px-5 md:px-7 py-8 gap-6 font-inter">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg lg:text-xl font-bold tracking-tight text-stone-900">Products</h2>
                        <ProductsCount />
                    </div>
                    <Link href="/control/products/create" className="px-7 py-2 bg-stone-800 font-[500] text-white rounded text-xs md:text-sm hover:bg-stone-900">
                        Add New Product
                    </Link>
                </div>
                <ProductHeaderClient />
            </div>

            <ProductsDataTable />
        </div>
    );
}

export default AdminProductsPage;
