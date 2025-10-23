import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AddSupplyForm } from "@/components/admin/supplies/add-supply-form";

export const metadata: Metadata = {
    title: "Add New Supply",
    description: "Add new inventory supply",
};

const AddSupplyPage = () => {
    return (
        <div className="w-full h-fit flex flex-col px-5 md:px-7 py-8 gap-6 font-inter">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <Link 
                        href="/control/supplies" 
                        className="flex items-center gap-2 text-stone-600 hover:text-stone-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Supplies
                    </Link>
                </div>
                <h2 className="text-lg lg:text-xl font-bold tracking-tight text-stone-900">Add New Supply</h2>
            </div>
            <AddSupplyForm />
        </div>
    );
};

export default AddSupplyPage;