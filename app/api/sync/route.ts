import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);

export async function POST() {
  try {
    // Run the sync script
    const { stdout, stderr } = await execAsync("node scripts/sync-data.mjs");
    console.log("Sync output:", stdout);
    if (stderr) console.warn("Sync stderr:", stderr);

    // Read the newly created db.json
    const dbPath = path.resolve("./data/generated/db.json");
    if (fs.existsSync(dbPath)) {
      const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
      return NextResponse.json({ success: true, message: "Sync completed", data });
    }

    return NextResponse.json({ success: true, message: stdout });
  } catch (error: any) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to sync" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const dbPath = path.resolve("./data/generated/db.json");
    if (fs.existsSync(dbPath)) {
      const data = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
      return NextResponse.json(data);
    }
    return NextResponse.json({ error: "Database not generated yet" }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
