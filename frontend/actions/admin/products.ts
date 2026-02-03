"use server";

import { getErrorMessage } from "@/components/error/handle-error";

// deleting an item
export async function deleteItem(input: { id: string }) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FEND_URL}/api/admin/products/${input.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete product");
    }

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
    // First get the current product to check its published status
    const currentProduct = await axiosWithIntercept.get(`/products/${itemId}`);
    const currentPublishedStatus = currentProduct.data.data.published;

    // Update with the opposite value
    const response = await axiosWithIntercept.put(`/products/${itemId}`, {
      published: !currentPublishedStatus,
    });

    return {
      success: true,
      published: !currentPublishedStatus,
    };
  } catch (error: any) {
    // Handle error types
    if (error.response?.status === 404) {
      return {
        success: false,
        error: error.response?.data?.message || "Item not found",
      };
    }

    if (error.response?.status === 500) {
      return {
        success: false,
        error:
          error.response?.data?.message ||
          "Server error occurred while updating status",
      };
    }

    return {
      success: false,
      error:
        error.response?.data?.message || "Failed to update published status",
    };
  }
}
