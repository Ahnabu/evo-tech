import { WarrantyManagement } from "@/components/admin/warranty/warranty-management";

const WarrantyPage = () => {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Warranty Information Management
                </h1>
                <p className="text-stone-500">
                    Manage your website&apos;s warranty information. Only one version can be active at a time.
                </p>
            </div>
            <WarrantyManagement />
        </div>
    );
};

export default WarrantyPage;
