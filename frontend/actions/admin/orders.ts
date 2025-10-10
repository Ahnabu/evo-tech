"use server";

import { getErrorMessage } from "@/components/error/handle-error";
import axiosIntercept from "@/utils/axios/axiosIntercept";

// deleting an order
export async function deleteOrder(input: { id: string }) {
    const axiosWithIntercept = await axiosIntercept();

    try {
        const backendRes = await axiosWithIntercept.delete(`/api/admin/order/delete/${input.id}`);

        if (backendRes.status !== 200) {
            throw new Error(backendRes.data.message || "Something went wrong");
        }

        return {
            data: backendRes.data,
            error: null,
        };
    } catch (err) {
        return {
            data: null,
            error: getErrorMessage(err),
        };
    }
}
