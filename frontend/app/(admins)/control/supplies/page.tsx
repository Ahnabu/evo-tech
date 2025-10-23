import Link from "next/link";
import { Metadata } from "next";
import { SuppliesHeaderClient } from "@/components/admin/supplies/supplies-header-client";
import { SuppliesDataTable } from "@/components/admin/supplies/supplies-data-table";

export const metadata: Metadata = {
    title: "Supplies",
    description: "View and manage inventory supplies",
};

const AdminSuppliesPage = () => {
    return (
        <div className="w-full h-fit flex flex-col px-5 md:px-7 py-8 gap-6 font-inter">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg lg:text-xl font-bold tracking-tight text-stone-900">Supplies</h2>
                    <Link href="/control/supplies/add" className="px-7 py-2 bg-stone-800 font-[500] text-white rounded text-xs md:text-sm hover:bg-stone-900">
                        Add New Supply
                    </Link>
                </div>
                <SuppliesHeaderClient />
            </div>
            <SuppliesDataTable />
        </div>
    );
};

export default AdminSuppliesPage;