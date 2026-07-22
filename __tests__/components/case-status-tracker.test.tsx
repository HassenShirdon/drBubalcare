// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CaseStatusTracker } from '@/components/case-status-tracker';

describe('CaseStatusTracker', () => {
  it('renders all status steps', () => {
    render(<CaseStatusTracker currentStatus="OPEN" />);
    expect(screen.getAllByText('Case Opened').length).toBeGreaterThan(0);
    expect(screen.getAllByText('AI Pre-screened').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Under Review').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Opinion Ready').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Closed').length).toBeGreaterThan(0);
  });

  it('highlights current status for OPEN', () => {
    render(<CaseStatusTracker currentStatus="OPEN" />);
    const caseOpened = screen.getAllByText('Case Opened');
    // First element should have current-step styling (font-bold, text-clinical-navy)
    expect(caseOpened[0].className).toSatisfy(
      (cls: string) => cls.includes('font-bold') && cls.includes('text-clinical-navy')
    );
  });

  it('highlights current status for UNDER_REVIEW', () => {
    render(<CaseStatusTracker currentStatus="UNDER_REVIEW" />);
    const underReview = screen.getAllByText('Under Review');
    // At least one element should have current-step styling
    expect(underReview.some((el) => el.className.includes('font-bold'))).toBe(true);
  });

  it('shows completed steps for CLOSED', () => {
    render(<CaseStatusTracker currentStatus="CLOSED" />);
    const caseOpened = screen.getAllByText('Case Opened');
    // In CLOSED status, all steps before CLOSED are completed (text-healing-teal)
    expect(caseOpened.some((el) => el.className.includes('text-healing-teal'))).toBe(true);
  });

  it('shows disputed state', () => {
    render(<CaseStatusTracker currentStatus="DISPUTED" />);
    expect(screen.getByText('Case Disputed')).toBeInTheDocument();
    expect(screen.getByText(/under review by our team/)).toBeInTheDocument();
  });
});
