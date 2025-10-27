"use client";

import * as React from "react";
import type { Row } from "@tanstack/react-table";
import { OrderWithItemsType } from "@/schemas/admin/sales/orderSchema";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from '@/store/store';
import { removeAnOrder } from "@/store/slices/orderSlice";
import { DeleteDialog } from "@/components/dialogs/delete-dialog";
import { toast } from "sonner";
import { deleteOrder } from "@/actions/admin/orders";
import { updateOrderStatus } from "@/actions/admin/update-order-status";
import { usePendingOrders } from "@/contexts/PendingOrdersContext";

interface RowActionProps {
    row: Row<OrderWithItemsType>;
    onDataChange?: () => Promise<void>;
}

const OrderTableRowActions = ({ row, onDataChange }: RowActionProps) => {

    const [isOpen, setIsOpen] = React.useState(false);
    const [isDeletePending, startDeleteTransition] = React.useTransition();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();

    const handleOrdersUpdateAfterDeletion = () => {
        dispatch(removeAnOrder({
            orderId: row.original.orderid,
        }));
    };

    const handleDelete = () => {
        const order = row.original;
        if (order) {
            startDeleteTransition(async () => {
                const { data, error } = await deleteOrder({
                    id: order.orderid,
                });

                if (error) {
                    toast.error(error || "An error occured while deleting the order");
                    return;
                }

                setIsOpen(false); // Close on success
                toast.success(data.message || "Order has been deleted");
                handleOrdersUpdateAfterDeletion(); // update redux state
                if (onDataChange) {
                    await onDataChange(); // refetch to update the table and pagination
                }
            });
        } else {
            toast.error('Something went wrong!');
        }
    };

    const handleCancel = () => {
        const order = row.original;
        if (!order) return toast.error('Order not found');

        if (order.order_status === 'cancelled') {
            return toast.error('Order is already cancelled');
        }

        // simple confirmation dialog
        const confirmed = window.confirm('Are you sure you want to cancel this order? This action will mark the order as cancelled.');
        if (!confirmed) return;

        startDeleteTransition(async () => {
            const { data, error } = await updateOrderStatus({
                id: order.orderid,
                payload: { orderStatus: 'cancelled' }
            });

            if (error) {
                toast.error(error || 'Failed to cancel order');
                return;
            }

            toast.success(data?.message || 'Order cancelled');
            // trigger table/pagination refresh
            if (onDataChange) await onDataChange();
        });
    };

    return (
        <div className="px-2 flex justify-end items-center gap-1" role="group" aria-label="Actions">
            <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full bg-blue-100 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                aria-label={`View Order details`}
                onClick={() => router.push(`/control/orders/${row.original.orderid}`)}
            >
                <Eye className="h-4 w-4" />
            </Button>

            <DeleteDialog<OrderWithItemsType>
                rowitem={row.original}
                open={isOpen}
                onOpenChange={setIsOpen}
                onDelete={handleDelete}
                isDeletePending={isDeletePending}
                entityName="order"
            />
            {/* Cancel button - visible only if order not already cancelled */}
            {row.original.order_status !== 'cancelled' && (
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 rounded-full bg-yellow-100 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                    aria-label={`Cancel order`}
                    onClick={handleCancel}
                >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10h4l3 9 4-18 3 9h4"/></svg>
                </Button>
            )}
        </div>
    );
}

export default OrderTableRowActions;
