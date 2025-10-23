import { Metadata } from "next";
import { AddShipmentForm } from "@/components/admin/shipments/add-shipment-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
    title: "Add New Shipment",
    description: "Create new shipment record",
};

const AddShipmentPage = () => {
    return (
        <div className="w-full h-fit flex flex-col px-5 md:px-7 py-8 gap-6 font-inter">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <Link 
                        href="/control/shipments" 
                        className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Shipments
                    </Link>
                </div>
                <h2 className="text-lg lg:text-xl font-bold tracking-tight text-stone-900">Add New Shipment</h2>
            </div>
            <AddShipmentForm />
        </div>
    );
};

export default AddShipmentPage;