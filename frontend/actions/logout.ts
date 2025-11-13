"use server";

import { signOut } from "@/auth";
import { cookies } from "next/headers";

export const logout = async () => {
  try {
    // Clear all auth-related cookies
    const cookieStore = await cookies();

    // Clear session token cookies
    cookieStore.delete("authjs.session-token");
    cookieStore.delete("__Secure-authjs.session-token");

    // Clear last page cookie
    cookieStore.delete("last_pg");

    // Clear CSRF token
    cookieStore.delete("authjs.csrf-token");
    cookieStore.delete("__Host-authjs.csrf-token");

    // Sign out from NextAuth (this will also clear the session)
    await signOut({ redirect: false });
  } catch (err) {
    console.error("Logout error:", err);
  }
};
