import { NextRequest, NextResponse } from "next/server";
import { analyzeDomain } from "@/lib/classifier";
import type { ClassifyResponse } from "@/lib/types";

export async function POST(
  req: NextRequest
): Promise<NextResponse<ClassifyResponse>> {
  try {
    const body = await req.json();
    const { domain } = body as { domain?: string };

    if (!domain || typeof domain !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid 'domain' field." },
        { status: 400 }
      );
    }

    // Basic domain format validation
    const domainRegex =
      /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain.trim())) {
      return NextResponse.json(
        { success: false, error: "Invalid domain format. Example: example.com" },
        { status: 422 }
      );
    }

    const analysis = analyzeDomain(domain.trim().toLowerCase());

    return NextResponse.json({ success: true, analysis });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to parse request body." },
      { status: 400 }
    );
  }
}
