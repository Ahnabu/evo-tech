"use server";

import { cookies } from "next/headers";

type LogoutResult = {
  success: boolean;
  error?: string;
};

export const logout = async (): Promise<LogoutResult> => {
  try {
    const cookieStore = await cookies();

    // Clear any custom cookies we control; NextAuth cookies are handled client-side
    cookieStore.delete("last_pg");

    return { success: true };
  } catch (err) {
    console.error("Logout error:", err);
    return { success: false, error: "Failed to clear session cookies" };
  }
};
