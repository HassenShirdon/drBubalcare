// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from "@testing-library/react";
import { SocialProofSection } from "@/components/landing-page/social-proof-section";

vi.mock("motion/react", () => {
  const Div = ({ children, className }: any) => <div className={className}>{children}</div>;
  const H2 = ({ children, className }: any) => <h2 className={className}>{children}</h2>;
  const Span = ({ children, className }: any) => <span className={className}>{children}</span>;
  const P = ({ children, className }: any) => <p className={className}>{children}</p>;
  return {
    motion: { div: Div, h2: H2, span: Span, p: P },
    useReducedMotion: () => false,
  };
});

describe("SocialProofSection", () => {
  it("renders section heading", () => {
    render(<SocialProofSection />);
    expect(screen.getAllByText("Real clarity from real patients").length).toBeGreaterThanOrEqual(1);
  });

  it("renders all three testimonials", () => {
    render(<SocialProofSection />);
    expect(screen.getAllByText(/Sarah M/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/James K/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Amina H/).length).toBeGreaterThanOrEqual(1);
  });

  it("renders trust badges", () => {
    render(<SocialProofSection />);
    expect(screen.getAllByText("Encrypted Uploads").length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getAllByText("Physicians of the Global Doctors Network").length
    ).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("HIPAA-Aware Processes").length).toBeGreaterThanOrEqual(1);
  });
});