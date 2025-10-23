import { Metadata } from "next";
import { ReportsHeader } from "@/components/admin/reports/reports-header";
import { ReportsDataTable } from "@/components/admin/reports/reports-data-table";

export const metadata: Metadata = {
  title: "Reports & Analytics - EvoTech Admin",
  description: "View comprehensive business reports and analytics",
};

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <ReportsHeader />
      <ReportsDataTable />
    </div>
  );
}