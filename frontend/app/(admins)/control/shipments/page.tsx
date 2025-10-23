import Link from "next/link";
import { Metadata } from "next";
import { ShipmentsHeaderClient } from "@/components/admin/shipments/shipments-header-client";
import { ShipmentsDataTable } from "@/components/admin/shipments/shipments-data-table";

export const metadata: Metadata = {
    title: "Shipments",
    description: "View and manage shipments",
};

const AdminShipmentsPage = () => {
    return (
        <div className="w-full h-fit flex flex-col px-5 md:px-7 py-8 gap-6 font-inter">
            <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg lg:text-xl font-bold tracking-tight text-stone-900">Shipments</h2>
                    <Link href="/control/shipments/add" className="px-7 py-2 bg-stone-800 font-[500] text-white rounded text-xs md:text-sm hover:bg-stone-900">
                        Add New Shipment
                    </Link>
                </div>
                <ShipmentsHeaderClient
                 />
            </div>
            <ShipmentsDataTable />
        </div>
    );
};

export default AdminShipmentsPage;