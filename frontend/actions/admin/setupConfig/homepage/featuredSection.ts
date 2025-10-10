"use server";

import { getErrorMessage } from "@/components/error/handle-error";
import axiosIntercept from "@/utils/axios/axiosIntercept";

// deleting an order
export async function deleteFeaturedSection(input: { id: string }) {
    const axiosWithIntercept = await axiosIntercept();

    try {
        const backRes = await axiosWithIntercept.delete(`/api/admin/lp/sections/delete/${input.id}`);

        return {
            data: backRes.data,
            error: null,
        };
    } catch (err) {
        return {
            data: null,
            error: getErrorMessage(err),
        };
    }
}
