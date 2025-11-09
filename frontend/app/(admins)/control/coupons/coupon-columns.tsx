"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ICoupon } from "@/hooks/use-coupons-data";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CouponTableRowActions } from "@/components/admin/coupons/comps/coupon-table-row-actions";

export const getCouponsColumns = (refetch: () => Promise<void>): ColumnDef<ICoupon>[] => {
    return [
        {
            accessorKey: "code",
            header: "Code",
            cell: ({ row }) => (
                <div className="text-xs font-bold uppercase tracking-wide">{row.getValue("code")}</div>
            ),
            enableHiding: false,
        },
        {
            accessorKey: "discountType",
            header: "Discount Type",
            cell: ({ row }) => {
                const type = row.getValue("discountType") as string;
                return (
                    <div className="text-xs capitalize">{type}</div>
                );
            },
        },
        {
            accessorKey: "discountValue",
            header: "Discount Value",
            cell: ({ row }) => {
                const value = row.getValue("discountValue") as number;
                const type = row.original.discountType;
                return (
                    <div className="text-xs font-medium">
                        {type === "percentage" ? `${value}%` : `${value} Tk.`}
                    </div>
                );
            },
        },
        {
            accessorKey: "minimumOrderAmount",
            header: "Min. Order",
            cell: ({ row }) => {
                const minAmount = row.getValue("minimumOrderAmount") as number | undefined;
                return (
                    <div className="text-xs">
                        {minAmount ? `${minAmount} Tk.` : "No minimum"}
                    </div>
                );
            },
        },
        {
            accessorKey: "validFrom",
            header: "Valid From",
            cell: ({ row }) => {
                const date = new Date(row.getValue("validFrom"));
                return (
                    <div className="text-xs whitespace-nowrap">{format(date, "MMM dd, yyyy")}</div>
                );
            },
        },
        {
            accessorKey: "validUntil",
            header: "Valid Until",
            cell: ({ row }) => {
                const date = new Date(row.getValue("validUntil"));
                const isExpired = new Date() > date;
                return (
                    <div className={`text-xs whitespace-nowrap ${isExpired ? "text-red-600" : ""}`}>
                        {format(date, "MMM dd, yyyy")}
                    </div>
                );
            },
        },
        {
            accessorKey: "currentUsageCount",
            header: "Usage",
            cell: ({ row }) => {
                const current = row.getValue("currentUsageCount") as number;
                const max = row.original.maxUsageCount;
                const percentage = (current / max) * 100;
                return (
                    <div className="text-xs">
                        <span className={percentage >= 90 ? "text-orange-600 font-medium" : ""}>
                            {current}/{max}
                        </span>
                    </div>
                );
            },
        },
        {
            accessorKey: "isReusable",
            header: "Reusable",
            cell: ({ row }) => {
                const isReusable = row.getValue("isReusable") as boolean;
                return (
                    <Badge variant={isReusable ? "default" : "secondary"} className="text-xs">
                        {isReusable ? "Yes" : "No"}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => {
                const isActive = row.getValue("isActive") as boolean;
                return (
                    <Badge variant={isActive ? "success" : "destructive"} className="text-xs">
                        {isActive ? "Active" : "Inactive"}
                    </Badge>
                );
            },
        },
        {
            id: "actions",
            cell: ({ row }) => {
                return <CouponTableRowActions row={row} refetch={refetch} />;
            },
        },
    ];
};
