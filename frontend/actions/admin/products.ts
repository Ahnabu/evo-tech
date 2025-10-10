"use server";

import { getErrorMessage } from "@/components/error/handle-error";
import axiosIntercept from "@/utils/axios/axiosIntercept";

// deleting an item
export async function deleteItem(input: { id: string }) {
    const axiosWithIntercept = await axiosIntercept();

    try {
        await axiosWithIntercept.delete(`/api/admin/items/delete/${input.id}`);

        return {
            data: null,
            error: null,
        };
    } catch (err) {
        return {
            data: null,
            error: getErrorMessage(err),
        };
    }
}

// toggle publishing an item

type TogglePublishedResponse = {
    message: string;
    published: boolean;
};

export async function toggleItemPublished(itemId: string) {
    const axiosWithIntercept = await axiosIntercept();

    try {
        const response = await axiosWithIntercept.patch<TogglePublishedResponse>(
            `/api/admin/items/${itemId}/toggle-published`
        );

        return {
            success: true,
            published: response.data.published,
        };

    } catch (error: any) {
        // Handle error types
        if (error.response?.status === 404) {
            return {
                success: false,
                error: error.response?.data?.message || 'Item not found',
            };
        }

        if (error.response?.status === 500) {
            return {
                success: false,
                error: error.response?.data?.message || 'Server error occurred while updating status',
            };
        }

        return {
            success: false,
            error: error.response?.data?.message || 'Failed to update published status',
        };
    }
}
