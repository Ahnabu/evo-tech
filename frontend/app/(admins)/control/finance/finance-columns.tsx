"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { currencyFormatBDT } from "@/lib/all_utils";
import { Badge } from "@/components/ui/badge";

export type FinanceTransactionType = {
  _id: string;
  type: "investment" | "withdraw" | "expense";
  amount: number;
  description: string;
  date: string;
  createdBy: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

export const getFinanceColumns = (): ColumnDef<FinanceTransactionType>[] => [
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => format(new Date(row.original.date), "dd MMM yyyy"),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;
      let variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "failed" | "inprogress" = "default";
      if (type === "investment") variant = "success"; 
      else if (type === "withdraw") variant = "failed";
      else if (type === "expense") variant = "warning";

      return (
        <Badge variant={variant} className="capitalize">
          {type}
        </Badge>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-semibold">{currencyFormatBDT(row.original.amount)}</span>
    ),
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
    cell: ({ row }) => {
      const creator = row.original.createdBy;
      return creator ? `${creator.firstName} ${creator.lastName}` : "Unknown";
    },
  },
];
