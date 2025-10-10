"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios from "axios";
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
import { frontBaseURL } from "@/lib/env-vars";

interface OrderUpdateFormProps {
    orderData: OrderWithItemsType;
    onSuccess?: (orderData: OrderWithItemsType) => void;
}

const OrderUpdateForm = ({ orderData, onSuccess }: OrderUpdateFormProps) => {
    const form = useForm<OrderStatusesUpdateType>({
        resolver: zodResolver(orderStatusesUpdateSchema),
        defaultValues: {
            order_status: orderData.order_status,
            payment_status: orderData.payment_status,
            tracking_code: orderData.tracking_code || "",
        },
    });

    const onSubmit = async (data: OrderStatusesUpdateType) => {
        try {
            // Filter out undefined values and empty strings for tracking_code
            const updateData: any = {};
            if (data.order_status !== undefined) updateData.order_status = data.order_status;
            if (data.payment_status !== undefined) updateData.payment_status = data.payment_status;
            if (data.tracking_code !== undefined) {
                updateData.tracking_code = data.tracking_code || null;
            }

            const response = await axios.put(`${frontBaseURL}/api/admin/orders/${orderData.orderid}`,
                updateData,
                {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    withCredentials: true,
                }
            );

            if (response.data.success) {
                toast.success(response.data.message || "Order updated successfully");

                // Call onSuccess with the updated order data from the response
                if (onSuccess && response.data.order_data) {
                    onSuccess(response.data.order_data);
                }
            } else {
                toast.error(response.data.message || "Failed to update order");
            }
        } catch (error: any) {
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
                            name="order_status"
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
                                                <SelectItem value="placed">Placed</SelectItem>
                                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                                <SelectItem value="picked_up">Picked Up</SelectItem>
                                                <SelectItem value="on_the_way">On The Way</SelectItem>
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
                            name="payment_status"
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
                                                <SelectItem value="paid">Paid</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="refunded">Refunded</SelectItem>
                                                <SelectItem value="partial">Partial</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="tracking_code"
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
