import { z } from "zod";

export const orderSchema = z.object({
    orderid: z.string(),
    order_key: z.string(), // uuid
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
    email: z.string().nullable(),
    housestreet: z.string(),
    city: z.string(),
    subdistrict: z.string(),
    postcode: z.string().nullable(),
    country: z.string(),
    notes: z.string().nullable(),
    shipping_type: z.enum([
        "regular_delivery",
        "express_delivery",
        "pickup_point",
    ]),
    payment_method: z.enum([
        "cod", // cash on delivery
        "cop", // cash on pickup
        "bkash", // bkash payment
        "bank_transfer", // bank transfer payment
    ]),
    transaction_id: z.string().nullable(), // for bkash payment/bank transfer payment (temporary way)
    terms: z.string(),
    subtotal: z.number(),
    discount: z.number(),
    delivery_charge: z.number(),
    additional_charge: z.number(),
    total_payable: z.number(),
    order_status: z.enum([
        "placed",
        "confirmed",
        "picked_up",
        "on_the_way",
        "delivered",
        "cancelled",
    ], { message: "Invalid order status." }),
    payment_status: z.enum([
        "paid",
        "pending",
        "refunded",
        "partial"
    ], { message: "Invalid payment status." }),
    pickup_point_id: z.number().nullable(),
    tracking_code: z.string().nullable(),
    viewed: z.boolean(),
    unpaid_notified: z.boolean(),
    order_date: z.string(),
    delivery_date: z.string().nullable(),
    // reward_points: z.number(), // has to make proper structure to sync across all places
});

export const orderedItemSchema = z.object({
    item_id: z.string(),
    item_image: z.string(),
    item_name: z.string(),
    item_price: z.number(),
    item_quantity: z.number(),
    item_color: z.string(),
});

export const orderStatusesUpdateSchema = z.object({
    order_status: z.enum([
        "placed",
        "confirmed",
        "picked_up",
        "on_the_way",
        "delivered",
        "cancelled",
    ], { message: "Invalid order status." }).optional(),
    payment_status: z.enum([
        "paid",
        "pending",
        "refunded",
        "partial"
    ], { message: "Invalid payment status." }).optional(),
    tracking_code: z.string().nullable().optional(),
});


export type OrderType = z.infer<typeof orderSchema>;
export type OrderedItemType = z.infer<typeof orderedItemSchema>;
export type OrderStatusesUpdateType = z.infer<typeof orderStatusesUpdateSchema>;

export type OrderWithItemsType = OrderType & {
    order_items: OrderedItemType[];
};
