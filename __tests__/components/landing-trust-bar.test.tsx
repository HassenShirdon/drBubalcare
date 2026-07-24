// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from "@testing-library/react";
import { TrustBar } from "@/components/landing-page/trust-bar";

describe("TrustBar", () => {
  it("renders all three trust points", () => {
    render(<TrustBar />);
    expect(screen.getByText("HIPAA Compliant")).toBeInTheDocument();
    expect(screen.getByText("Board-Certified Specialists")).toBeInTheDocument();
    expect(screen.getByText("24-48h Turnaround")).toBeInTheDocument();
  });

  it("is hidden on mobile", () => {
    const { container } = render(<TrustBar />);
    const outerDiv = container.firstElementChild as HTMLElement;
    expect(outerDiv.className).toContain("hidden");
    expect(outerDiv.className).toContain("md:block");
  });
});
