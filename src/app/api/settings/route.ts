import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const db = getDb();
    const list = await db.select().from(siteSettings);
    const settingsMap: Record<string, string> = {};
    list.forEach((s) => {
      settingsMap[s.settingKey] = s.settingValue;
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
