import { NextRequest, NextResponse } from "next/server";
import { getListings } from "@/lib/data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status"); // "active" | "sold"
  const platform = searchParams.get("platform");

  let listings = getListings();

  if (status) {
    listings = listings.filter((l) => l.status === status);
  }
  if (platform) {
    listings = listings.filter((l) => l.platform === platform);
  }

  const totalAskingValue = listings.reduce(
    (sum, l) => sum + l.askingPrice,
    0
  );
  const avgScore =
    listings.length > 0
      ? Math.round(
          listings.reduce((sum, l) => sum + l.valueScore, 0) / listings.length
        )
      : 0;

  return NextResponse.json({
    listings,
    total: listings.length,
    totalAskingValue,
    avgValueScore: avgScore,
    platforms: ["flippa", "sedo", "dan", "afternic", "empireflippers"],
  });
}
