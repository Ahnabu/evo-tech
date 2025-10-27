"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { orderStatusesUpdateSchema, OrderStatusesUpdateType, OrderWithItemsType } from "@/schemas/admin/sales/orderSchema";

interface OrderUpdateFormProps {
    orderData: OrderWithItemsType;
    onSuccess?: (orderData: OrderWithItemsType) => void;
}

const OrderUpdateForm = ({ orderData, onSuccess }: OrderUpdateFormProps) => {
    const router = useRouter();
    const form = useForm<OrderStatusesUpdateType>({
        resolver: zodResolver(orderStatusesUpdateSchema),
        defaultValues: {
            orderStatus: orderData.orderStatus,
            paymentStatus: orderData.paymentStatus,
            trackingCode: orderData.trackingCode || "",
        },
    });

    const onSubmit = async (data: OrderStatusesUpdateType) => {
        try {
            // Filter out undefined values and empty strings for trackingCode
            const updateData: any = {};
            if (data.orderStatus !== undefined) updateData.orderStatus = data.orderStatus;
            if (data.paymentStatus !== undefined) updateData.paymentStatus = data.paymentStatus;
            if (data.trackingCode !== undefined) {
                updateData.trackingCode = data.trackingCode || null;
            }

            const orderId = orderData._id || orderData.orderNumber;
            console.log('📤 Updating order:', orderId, 'with data:', updateData);

            // Use relative URL for API route (works in both dev and production)
            const response = await axios.put(`/api/admin/orders/${orderId}`,
                updateData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('✅ Update response:', response.data);

            if (response.data.success) {
                toast.success(response.data.message || "Order updated successfully");

                // Refresh the page data
                router.refresh();

                // Call onSuccess if provided
                if (onSuccess && response.data.data) {
                    onSuccess(response.data.data);
                }
            } else {
                toast.error(response.data.message || "Failed to update order");
            }
        } catch (error: any) {
            console.error('❌ Update error:', error.response?.data || error.message);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error("Failed to update order. Please try again later.");
            }
        }
    };

    return (
        <div className="w-full bg-stone-50 rounded-lg border p-6 mb-6">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full flex flex-col xl:flex-row gap-4 items-end"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                        <FormField
                            control={form.control}
                            name="orderStatus"
                            render={({ field }) => (
                                <FormItem>
                                    <p className="text-xs font-medium whitespace-nowrap">Order Status</p>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="text-xs bg-white">
                                                <SelectValue placeholder="Select order status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                                <SelectItem value="processing">Processing</SelectItem>
                                                <SelectItem value="shipped">Shipped</SelectItem>
                                                <SelectItem value="delivered">Delivered</SelectItem>
                                                <SelectItem value="cancelled">Cancelled</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="paymentStatus"
                            render={({ field }) => (
                                <FormItem>
                                    <p className="text-xs font-medium whitespace-nowrap">Payment Status</p>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className="text-xs bg-white">
                                                <SelectValue placeholder="Select payment status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="paid">Paid</SelectItem>
                                                <SelectItem value="failed">Failed</SelectItem>
                                                <SelectItem value="refunded">Refunded</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="trackingCode"
                            render={({ field }) => (
                                <FormItem>
                                    <p className="text-xs font-medium whitespace-nowrap">Tracking Code</p>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter tracking code"
                                            {...field}
                                            value={field.value || ""}
                                            disabled={form.formState.isSubmitting}
                                            className="text-xs bg-white placeholder:text-stone-400 placeholder:text-xs"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex gap-2 items-center py-0.5">
                        <Button
                            type="submit"
                            size="sm"
                            variant="default"
                            className="min-w-32"
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? "Updating..." : "Update"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export { OrderUpdateForm };
