import { Metadata } from "next";
import { MarketingDataTable } from "@/components/admin/marketing/marketing-data-table";
import { MarketingHeader } from "@/components/admin/marketing/marketing-header";

export const metadata: Metadata = {
  title: "Marketing Management - EvoTech Admin",
  description: "Manage flash deals, coupons, newsletter, and subscribers",
};

export default function MarketingPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <MarketingHeader />
      <MarketingDataTable />
    </div>
  );
}