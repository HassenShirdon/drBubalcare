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
  };
});

describe("SocialProofSection", () => {
  it("renders section heading", () => {
    render(<SocialProofSection />);
    expect(screen.getAllByText("Trusted by patients and specialists worldwide").length).toBeGreaterThanOrEqual(1);
  });

  it("renders all three testimonials", () => {
    render(<SocialProofSection />);
    expect(screen.getAllByText(/Sarah M/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/James K/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Amina H/).length).toBeGreaterThanOrEqual(1);
  });

  it("renders specialist names", () => {
    render(<SocialProofSection />);
    expect(screen.getAllByText("Dr. A. Mensah").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Dr. K. Okafor").length).toBeGreaterThanOrEqual(1);
  });

  it("renders certification badges", () => {
    render(<SocialProofSection />);
    expect(screen.getAllByText("HIPAA Compliant").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("GDPR Certified").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Board-Certified Specialists").length).toBeGreaterThanOrEqual(1);
  });
});