// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CaseStatusTracker } from '@/components/case-status-tracker';

describe('CaseStatusTracker', () => {
  it('renders all status steps', () => {
    render(<CaseStatusTracker currentStatus="OPEN" />);
    expect(screen.getAllByText('Case opened').length).toBeGreaterThan(0);
    expect(screen.getAllByText('AI pre-screened').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Under review').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Opinion ready').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Closed').length).toBeGreaterThan(0);
  });

  it('highlights current status for OPEN', () => {
    render(<CaseStatusTracker currentStatus="OPEN" />);
    const caseOpened = screen.getAllByText('Case opened');
    // First element should have current-step styling (font-semibold, text-pulse-navy)
    expect(caseOpened[0].className).toSatisfy(
      (cls: string) => cls.includes('font-semibold') && cls.includes('text-pulse-navy')
    );
  });

  it('highlights current status for UNDER_REVIEW', () => {
    render(<CaseStatusTracker currentStatus="UNDER_REVIEW" />);
    const underReview = screen.getAllByText('Under review');
    // At least one element should have current-step styling
    expect(underReview.some((el) => el.className.includes('font-semibold'))).toBe(true);
  });

  it('shows completed steps for CLOSED', () => {
    render(<CaseStatusTracker currentStatus="CLOSED" />);
    const caseOpened = screen.getAllByText('Case opened');
    // In CLOSED status, all steps before CLOSED are completed (text-pulse-success)
    expect(caseOpened.some((el) => el.className.includes('text-pulse-success'))).toBe(true);
  });

  it('shows disputed state', () => {
    render(<CaseStatusTracker currentStatus="DISPUTED" />);
    expect(screen.getByText('Case disputed')).toBeInTheDocument();
    expect(screen.getByText(/under review by our team/)).toBeInTheDocument();
  });
});
