"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { getFinanceColumns, FinanceTransactionType } from "@/app/(admins)/control/finance/finance-columns";
import { ServerSidePaginationProps } from "@/utils/types_interfaces/data-table-props";
import { Loader2 } from "lucide-react";

interface FinanceTransactionTableProps {
  transactions: FinanceTransactionType[];
  isLoading: boolean;
  serverSidePagination?: ServerSidePaginationProps;
}

export const FinanceTransactionTable = ({
  transactions,
  isLoading,
  serverSidePagination,
}: FinanceTransactionTableProps) => {
  const columns = useMemo(() => getFinanceColumns(), []);

  if (isLoading && transactions.length === 0) {
    return (
      <div className="w-full h-64 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-stone-500" />
      </div>
    );
  }

  return (
    <div className="w-full h-fit mt-5">
      <DataTable
        columns={columns}
        data={transactions}
        enableSelectedRowsCount={false}
        serverSidePagination={serverSidePagination}
      />
    </div>
  );
};
