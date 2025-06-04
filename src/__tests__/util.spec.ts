import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { isWithinTwoWeeks } from "@/util";

describe("isWithinTwoWeeks", () => {
  const now = new Date("2024-07-01T00:00:00Z");

  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(now);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it("直近2週間以内の日付ならtrueを返す", () => {
    const target = new Date("2024-06-25T00:00:00Z").toISOString();
    expect(isWithinTwoWeeks(target)).toBe(true);
  });

  it("2週間より前の日付ならfalseを返す", () => {
    const target = new Date("2024-06-10T00:00:00Z").toISOString();
    expect(isWithinTwoWeeks(target)).toBe(false);
  });

  it("未来の日付ならfalseを返す", () => {
    const target = new Date("2024-07-10T00:00:00Z").toISOString();
    expect(isWithinTwoWeeks(target)).toBe(false);
  });
});
