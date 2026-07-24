// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from "@testing-library/react";
import { TrustChecklist } from "@/components/landing-page/trust-checklist";

describe("TrustChecklist", () => {
  it("renders all five checklist items", () => {
    render(<TrustChecklist />);
    expect(screen.getByText("Encrypted uploads")).toBeInTheDocument();
    expect(screen.getByText("Board-certified only")).toBeInTheDocument();
    expect(screen.getByText("No hidden fees")).toBeInTheDocument();
    expect(screen.getByText("24-48h guarantee")).toBeInTheDocument();
    expect(screen.getByText("Peer review available")).toBeInTheDocument();
  });
});