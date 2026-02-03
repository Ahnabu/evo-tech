"use server";

import { getErrorMessage } from "@/components/error/handle-error";

interface Input {
    id: string;
    payload: Record<string, any>;
}

export async function updateOrderStatus(input: Input) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_FEND_URL}/api/admin/orders/${input.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(input.payload),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update order status");
        }

        const data = await response.json();
        return {
            data,
            error: null,
        };
    } catch (err) {
        return {
            data: null,
            error: getErrorMessage(err),
        };
    }
}
