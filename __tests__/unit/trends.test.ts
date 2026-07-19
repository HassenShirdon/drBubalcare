import { describe, it, expect } from "vitest";
import { analyzeTrend } from "@/lib/ai/trends";

describe("analyzeTrend", () => {
  it("returns stable for single data point", () => {
    const result = analyzeTrend([
      { value: 100, status: "NORMAL" },
    ]);
    expect(result.trend).toBe("stable");
    expect(result.significant).toBe(false);
  });

  it("detects rising trend", () => {
    const result = analyzeTrend([
      { value: 90, status: "NORMAL" },
      { value: 100, status: "NORMAL" },
      { value: 110, status: "HIGH" },
    ]);
    expect(result.trend).toBe("rising");
    expect(result.significant).toBe(true);
  });

  it("detects falling trend", () => {
    const result = analyzeTrend([
      { value: 150, status: "HIGH" },
      { value: 120, status: "HIGH" },
      { value: 90, status: "NORMAL" },
    ]);
    expect(result.trend).toBe("falling");
    expect(result.significant).toBe(true);
  });

  it("detects fluctuating trend", () => {
    const result = analyzeTrend([
      { value: 90, status: "NORMAL" },
      { value: 110, status: "HIGH" },
      { value: 95, status: "NORMAL" },
      { value: 105, status: "HIGH" },
    ]);
    expect(result.trend).toBe("fluctuating");
    expect(result.significant).toBe(true);
  });

  it("detects significant when 2+ out of range", () => {
    const result = analyzeTrend([
      { value: 100, status: "NORMAL" },
      { value: 150, status: "HIGH" },
      { value: 160, status: "HIGH" },
    ]);
    expect(result.significant).toBe(true);
  });

  it("returns stable when values are consistent", () => {
    const result = analyzeTrend([
      { value: 100, status: "NORMAL" },
      { value: 101, status: "NORMAL" },
      { value: 99, status: "NORMAL" },
    ]);
    expect(result.trend).toBe("stable");
    expect(result.significant).toBe(false);
  });
});
