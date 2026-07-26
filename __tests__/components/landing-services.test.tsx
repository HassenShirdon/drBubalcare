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
    expect(screen.getAllByText('Choose the level of support you need').length).toBeGreaterThan(0);
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

  it('renders a link for each service', () => {
    const { container } = render(<ServicesSection />);
    const links = container.querySelectorAll('a[href="/patient"]');
    expect(links.length).toBe(SERVICES.length);
  });
});