"use server";

import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/components/error/handle-error";

export interface CreateCouponData {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumOrderAmount?: number;
  validFrom: string;
  validUntil: string;
  maxUsageCount: number;
  isReusable: boolean;
  applicableCategories?: string[];
  applicableProducts?: string[];
}

export async function createCoupon(data: CreateCouponData) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FEND_URL}/api/admin/coupons`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create coupon");
    }

    const result = await response.json();
    revalidatePath("/control/coupons");
    return { success: true, data: result };
  } catch (error: any) {
    return {
      error: getErrorMessage(error) || "Failed to create coupon",
    };
  }
}

export async function updateCoupon(id: string, data: Partial<CreateCouponData>) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FEND_URL}/api/admin/coupons/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update coupon");
    }

    const result = await response.json();
    revalidatePath("/control/coupons");
    return { success: true, data: result };
  } catch (error: any) {
    return {
      error: getErrorMessage(error) || "Failed to update coupon",
    };
  }
}

export async function deleteCoupon(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FEND_URL}/api/admin/coupons/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete coupon");
    }

    revalidatePath("/control/coupons");
    return { success: true };
  } catch (error: any) {
    return {
      error: getErrorMessage(error) || "Failed to delete coupon",
    };
  }
}

export async function toggleCouponStatus(id: string, isActive: boolean) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FEND_URL}/api/admin/coupons/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update coupon status");
    }

    revalidatePath("/control/coupons");
    return { success: true };
  } catch (error: any) {
    return {
      error: getErrorMessage(error) || "Failed to update coupon status",
    };
  }
}

export async function getCouponById(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_FEND_URL}/api/admin/coupons/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch coupon");
    }

    const result = await response.json();
    return { success: true, data: result.data };
  } catch (error: any) {
    return {
      error: getErrorMessage(error) || "Failed to fetch coupon",
    };
  }
}
