import { describe, it, expect } from "vitest";
import { stripPHI } from "@/lib/ai/phi-stripper";

describe("stripPHI", () => {
  it("strips patient names when provided in context", () => {
    const input = "Patient John Doe presents with chest pain.";
    const result = stripPHI(input, { patientName: "John Doe" });
    expect(result).toBe("Patient [PATIENT] presents with chest pain.");
    expect(result).not.toContain("John Doe");
  });

  it("strips email addresses", () => {
    const input = "Contact: patient@example.com for follow-up.";
    const result = stripPHI(input);
    expect(result).toContain("[EMAIL]");
    expect(result).not.toContain("patient@example.com");
  });

  it("strips phone numbers", () => {
    const input = "Call patient at +1-555-123-4567.";
    const result = stripPHI(input);
    expect(result).toContain("[PHONE]");
    expect(result).not.toContain("555-123-4567");
  });

  it("strips dates of birth patterns", () => {
    const input = "DOB: 01/15/1985 or born 1985-01-15.";
    const result = stripPHI(input);
    expect(result).toContain("[DOB]");
    expect(result).not.toContain("01/15/1985");
    expect(result).not.toContain("1985-01-15");
  });

  it("strips MRN patterns", () => {
    const input = "MRN: 12345678 or MRN# 87654321.";
    const result = stripPHI(input);
    expect(result).toContain("[MRN]");
    expect(result).not.toContain("12345678");
    expect(result).not.toContain("87654321");
  });

  it("strips US street addresses", () => {
    const input = "Patient lives at 123 Main Street, Apt 4.";
    const result = stripPHI(input);
    expect(result).toContain("[ADDRESS]");
    expect(result).not.toContain("123 Main Street");
  });

  it("preserves clinical content", () => {
    const input = "Diagnosis: Type 2 Diabetes Mellitus. HbA1c: 8.2%. Metformin 500mg BID.";
    const result = stripPHI(input);
    expect(result).toContain("Type 2 Diabetes Mellitus");
    expect(result).toContain("8.2%");
    expect(result).toContain("Metformin 500mg BID");
  });

  it("handles empty string", () => {
    expect(stripPHI("")).toBe("");
  });

  it("handles text with no PII", () => {
    const input = "Chest pain, acute onset, 3 hours duration.";
    expect(stripPHI(input)).toBe(input);
  });
});
