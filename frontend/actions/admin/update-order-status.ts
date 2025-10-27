"use server";

import { getErrorMessage } from "@/components/error/handle-error";
import axiosIntercept from "@/utils/axios/axiosIntercept";

interface Input {
    id: string;
    payload: Record<string, any>;
}

export async function updateOrderStatus(input: Input) {
    const axiosWithIntercept = await axiosIntercept();

    try {
        const backendRes = await axiosWithIntercept.put(`/orders/${input.id}`, input.payload);

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
