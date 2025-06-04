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

  it("returns true for a date within the last two weeks", () => {
    const target = new Date("2024-06-25T00:00:00Z").toISOString();
    expect(isWithinTwoWeeks(target)).toBe(true);
  });

  it("returns false for a date older than two weeks", () => {
    const target = new Date("2024-06-10T00:00:00Z").toISOString();
    expect(isWithinTwoWeeks(target)).toBe(false);
  });

  it("returns false for a future date", () => {
    const target = new Date("2024-07-10T00:00:00Z").toISOString();
    expect(isWithinTwoWeeks(target)).toBe(false);
  });
});
