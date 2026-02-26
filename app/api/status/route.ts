import { NextResponse } from "next/server";
import type { ApiStatusResponse } from "@/lib/types";

const START_TIME = Date.now();

export async function GET(): Promise<NextResponse<ApiStatusResponse>> {
  const uptime = Math.floor((Date.now() - START_TIME) / 1000);

  return NextResponse.json({
    status: "ok",
    version: "1.0.0",
    uptime,
    routes: [
      "GET  /api/status",
      "GET  /api/domains",
      "POST /api/classify",
      "POST /api/build",
      "GET  /api/listings",
    ],
    timestamp: new Date().toISOString(),
  });
}
