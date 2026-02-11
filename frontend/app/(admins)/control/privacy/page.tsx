import { PrivacyManagement } from "@/components/admin/privacy/privacy-management";

const PrivacyPage = () => {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    Privacy Policy Management
                </h1>
                <p className="text-stone-500">
                    Manage your website&apos;s privacy policy. Only one version can be active at a time.
                </p>
            </div>
            <PrivacyManagement />
        </div>
    );
};

export default PrivacyPage;
