// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from "@testing-library/react";
import { TrustChecklist } from "@/components/landing-page/trust-checklist";

describe("TrustChecklist", () => {
  it("renders all five checklist items", () => {
    render(<TrustChecklist />);
    expect(screen.getByText("Encrypted uploads and signed file URLs")).toBeInTheDocument();
    expect(screen.getByText("Board-certified specialists only")).toBeInTheDocument();
    expect(screen.getByText("No hidden fees — prices shown upfront")).toBeInTheDocument();
    expect(screen.getByText("Opinion delivered in 24–48 hours")).toBeInTheDocument();
    expect(screen.getByText("Peer review available on request")).toBeInTheDocument();
  });
});