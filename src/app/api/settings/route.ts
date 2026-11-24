import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { getAdminSessionSecret } from "@/lib/admin-auth";
import { requireAdminSession } from "@/lib/admin-auth";

export async function GET() {
  try {
    const db = getDb();
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");
    const isAdmin = session?.value === getAdminSessionSecret();

    const list = await db.select().from(siteSettings);
    const settingsMap: Record<string, string> = {};
    list.forEach((s) => {
      if (
        isAdmin ||
        s.settingKey === "welcome_marquee_en" ||
        s.settingKey === "welcome_marquee_hi"
      ) {
        settingsMap[s.settingKey] = s.settingValue;
      }
    });

    return NextResponse.json({ success: true, settings: settingsMap });
  } catch (err) {
    console.error("GET /api/settings error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const unauthorized = await requireAdminSession();
    if (unauthorized) return unauthorized;

    const body = await request.json();
    const { settings } = body; // Record<string, string>

    if (!settings || typeof settings !== "object") {
      return NextResponse.json(
        { success: false, error: "Settings object is required" },
        { status: 400 }
      );
    }

    const db = getDb();
    for (const [key, val] of Object.entries(settings)) {
      await db
        .insert(siteSettings)
        .values({
          settingKey: key,
          settingValue: String(val),
        })
        .onConflictDoUpdate({
          target: siteSettings.settingKey,
          set: {
            settingValue: String(val),
            updatedAt: new Date(),
          },
        });
    }

    return NextResponse.json({ success: true, message: "Settings saved successfully" });
  } catch (err) {
    console.error("POST /api/settings error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
