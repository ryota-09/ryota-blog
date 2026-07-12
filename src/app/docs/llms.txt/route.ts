import type { NextResponse } from "next/server";

import {
  buildRootLlmsTxt,
  createLlmsTxtErrorResponse,
  createLlmsTxtSuccessResponse,
} from "@/lib/llmsTxt";

/**
 * llms.txt APIエンドポイント(ロケール無し)
 * 生成ロジックは src/lib/llmsTxt.ts に集約されている
 */
export async function GET(): Promise<NextResponse> {
  try {
    const content = buildRootLlmsTxt();
    return createLlmsTxtSuccessResponse(content);
  } catch (error) {
    return createLlmsTxtErrorResponse(error);
  }
}
