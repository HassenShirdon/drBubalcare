// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from "@testing-library/react";
import { MiniFaq } from "@/components/landing-page/mini-faq";

describe("MiniFaq", () => {
  it("renders all FAQ questions", () => {
    render(<MiniFaq />);
    expect(screen.getAllByText("How much does it cost?").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("What files can I upload?").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("How long does it take?").length).toBeGreaterThanOrEqual(1);
  });

  it("expands and collapses answer on click", () => {
    render(<MiniFaq />);
    const buttons = screen.getAllByText("How much does it cost?");
    fireEvent.click(buttons[0]);
    expect(screen.getByText(/Pricing varies by service/)).toBeInTheDocument();
    fireEvent.click(buttons[0]);
    expect(screen.queryAllByText(/Pricing varies by service/).length).toBe(0);
  });
});