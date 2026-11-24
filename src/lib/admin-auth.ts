import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export function getAdminSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || "devotional-admin-session-change-me";
}

export async function requireAdminSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session || session.value !== getAdminSessionSecret()) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  return null;
}
