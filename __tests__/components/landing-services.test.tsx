// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ServicesSection from '@/components/landing-page/services-section';
import { SERVICES } from '@/components/landing-page/data';

vi.mock('motion/react', () => ({
  motion: {
    section: ({ children, className }: any) => <section className={className}>{children}</section>,
    div: ({ children, className }: any) => <div className={className}>{children}</div>,
  },
}));

describe('ServicesSection', () => {
  it('renders service cards', () => {
    render(<ServicesSection />);
    expect(screen.getAllByText('How we help you').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/From one-time opinions to ongoing monitoring/).length).toBeGreaterThan(0);
  });

  it('shows service titles from data.ts', () => {
    render(<ServicesSection />);
    for (const service of SERVICES) {
      const elements = screen.getAllByText(service.title);
      expect(elements.length).toBeGreaterThan(0);
    }
  });

  it('shows service descriptions from data.ts', () => {
    render(<ServicesSection />);
    for (const service of SERVICES) {
      const elements = screen.getAllByText(service.description);
      expect(elements.length).toBeGreaterThan(0);
    }
  });

  it('renders Get Started buttons', () => {
    render(<ServicesSection />);
    const buttons = screen.getAllByText('Get Started →');
    expect(buttons.length % SERVICES.length).toBe(0);
    for (const button of buttons) {
      expect(button.tagName).toBe('BUTTON');
    }
  });
});