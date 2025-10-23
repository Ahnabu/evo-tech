import { CreateTicketForm } from "@/components/admin/support/create-ticket-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Support Ticket - EvoTech Admin",
  description: "Create a new support ticket",
};

export default function CreateTicketPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Create Support Ticket</h1>
      </div>
      <CreateTicketForm />
    </div>
  );
}