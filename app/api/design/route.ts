import { NextRequest, NextResponse } from "next/server";
import { callAutoModel } from "@/lib/models";
import { getUnsplashImageUrls } from "@/lib/unsplash";
import type { DesignRequestPayload } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const payload: DesignRequestPayload = await req.json();
    if (!payload?.brief?.goal?.trim()) {
      return NextResponse.json({ error: "brief.goal is required" }, { status: 400 });
    }
    const imageUrls = await getUnsplashImageUrls(payload.brief.imageryKeywords ?? []);
    const { html, model } = await callAutoModel(payload, imageUrls);

    // Strip markdown fences if model wrapped output
    const clean = html
      .replace(/^```html\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    return NextResponse.json({ previewHtml: clean, modelUsed: model, imageUrls });
  } catch (e) {
    const msg = (e as Error).message ?? "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
