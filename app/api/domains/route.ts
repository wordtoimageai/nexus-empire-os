import { NextRequest, NextResponse } from "next/server";
import { getDomainRecords, getEmpireStats } from "@/lib/data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const status = searchParams.get("status");
  const limit = parseInt(searchParams.get("limit") ?? "100", 10);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  let records = getDomainRecords();

  if (category) {
    records = records.filter((r) => r.category === category);
  }
  if (status) {
    records = records.filter((r) => r.status === status);
  }

  const total = records.length;
  const paginated = records.slice(offset, offset + limit);
  const stats = getEmpireStats();

  return NextResponse.json({
    domains: paginated,
    total,
    offset,
    limit,
    stats,
    filters: { category, status },
  });
}
