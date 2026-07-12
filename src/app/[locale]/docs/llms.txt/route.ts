import type { NextResponse } from "next/server";

import {
  buildLocalizedLlmsTxt,
  createLlmsTxtErrorResponse,
  createLlmsTxtSuccessResponse,
} from "@/lib/llmsTxt";

// Next.js 16では、Route Handlerのparamsは非同期になった
type RouteContext = {
  params: Promise<{
    locale: string;
  }>;
};

/**
 * llms.txt APIエンドポイント(ロケール付き)
 * 生成ロジックは src/lib/llmsTxt.ts に集約されている
 */
export async function GET(
  request: Request,
  { params }: RouteContext,
): Promise<NextResponse> {
  const { locale } = await params;

  try {
    const content = await buildLocalizedLlmsTxt(locale);
    return createLlmsTxtSuccessResponse(content);
  } catch (error) {
    return createLlmsTxtErrorResponse(error);
  }
}
