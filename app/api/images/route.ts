import { NextRequest, NextResponse } from "next/server";
import { getUnsplashImageUrls } from "@/lib/unsplash";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";
  const max = parseInt(req.nextUrl.searchParams.get("max") ?? "4");
  const urls = await getUnsplashImageUrls(q.split(",").map(s => s.trim()), max);
  return NextResponse.json({ urls });
}
