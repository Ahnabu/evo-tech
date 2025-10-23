import { SupportDataTable } from "@/components/admin/support/support-data-table";
import { SupportHeader } from "@/components/admin/support/support-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support System - EvoTech Admin",
  description: "Manage customer support tickets, queries, and contacts",
};

export default function SupportPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <SupportHeader />
      <SupportDataTable />
    </div>
  );
}