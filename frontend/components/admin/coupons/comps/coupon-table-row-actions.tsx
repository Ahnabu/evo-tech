"use client";

import * as React from "react";
import type { Row } from "@tanstack/react-table";
import { ICoupon } from "@/hooks/use-coupons-data";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";
import { Switch } from "@/components/ui/switch";
import { deleteCoupon, toggleCouponStatus } from "@/actions/admin/coupons";

interface RowActionProps {
    row: Row<ICoupon>;
    refetch: () => Promise<void>;
}

export const CouponTableRowActions = ({ row, refetch }: RowActionProps) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isDeletePending, startDeleteTransition] = React.useTransition();
    const [isTogglePending, startToggleTransition] = React.useTransition();
    const router = useRouter();

    const handleDelete = () => {
        const coupon = row.original;
        if (coupon) {
            startDeleteTransition(async () => {
                const { error } = await deleteCoupon(coupon._id);

                if (error) {
                    toast.error(error || "Failed to delete coupon");
                    return;
                }

                setIsOpen(false);
                toast.success("Coupon has been deleted");
                await refetch();
            });
        } else {
            toast.error("Something went wrong!");
        }
    };

    const handleToggleStatus = async (checked: boolean) => {
        startToggleTransition(async () => {
            const { error } = await toggleCouponStatus(row.original._id, checked);

            if (error) {
                toast.error(error || "Failed to update coupon status");
                return;
            }

            toast.success(`Coupon ${checked ? "activated" : "deactivated"}`);
            await refetch();
        });
    };

    return (
        <div className="px-2 flex justify-end items-center gap-2" role="group" aria-label="Actions">
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600">Active:</span>
                <Switch
                    checked={row.original.isActive}
                    onCheckedChange={handleToggleStatus}
                    disabled={isTogglePending}
                />
            </div>

            <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full bg-yellow-200 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100"
                aria-label={`Edit ${row.original.code}`}
                onClick={() => router.push(`/control/coupons/edit/${row.original._id}`)}
            >
                <Edit className="h-4 w-4" />
            </Button>

            <DeleteDialog<ICoupon>
                rowitem={row.original}
                open={isOpen}
                onOpenChange={setIsOpen}
                onDelete={handleDelete}
                isDeletePending={isDeletePending}
                entityName="coupon"
            />
        </div>
    );
};
