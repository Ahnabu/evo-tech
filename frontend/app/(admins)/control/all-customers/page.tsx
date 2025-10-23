import { CustomersDataTable } from "@/components/admin/customers/customers-data-table";
import { CustomersHeaderClient } from "@/components/admin/customers/customers-header-client";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Customers",
    description: "View and manage customers",
};

const AdminCustomersPage = () => {
    return (
        <div className="w-full h-fit flex flex-col px-5 md:px-7 py-8 gap-6 font-inter">
            <div className="flex flex-col gap-4">
                <h2 className="text-lg lg:text-xl font-bold tracking-tight text-stone-900">All Customers</h2>
                <CustomersHeaderClient />
            </div>
            <CustomersDataTable />
        </div>
    );
};

export default AdminCustomersPage;