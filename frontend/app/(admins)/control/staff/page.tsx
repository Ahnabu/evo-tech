import { StaffDataTable } from "@/components/admin/staff/staff-data-table";
import { StaffHeader } from "@/components/admin/staff/staff-header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Staff Management - EvoTech Admin",
  description: "Manage staff members, roles, and permissions",
};

export default function StaffPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <StaffHeader />
      <StaffDataTable />
    </div>
  );
}