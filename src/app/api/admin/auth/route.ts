import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminSessionSecret } from "@/lib/admin-auth";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ADMIN";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || password.trim() !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: "Invalid password. Access denied." },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    const sessionSecret = getAdminSessionSecret();
    cookieStore.set("admin_session", sessionSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({
      success: true,
      message: "Admin authenticated successfully",
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

    if (session && session.value === getAdminSessionSecret()) {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false }, { status: 401 });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    return NextResponse.json({ success: true, message: "Logged out" });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
