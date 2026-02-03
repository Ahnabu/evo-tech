"use server";

import { getErrorMessage } from "@/components/error/handle-error";

// deleting an order
export async function deleteOrder(input: { id: string }) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_FEND_URL}/api/admin/orders/${input.id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to delete order");
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
