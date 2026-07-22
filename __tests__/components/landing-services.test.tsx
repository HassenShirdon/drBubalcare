// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ServicesSection from '@/components/landing-page/services-section';
import { SERVICES } from '@/components/landing-page/data';

vi.mock('motion/react', () => ({
  motion: {
    section: ({ children, ...props }: any) => <section {...props}>{children}</section>,
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
}));

vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => <a href={href} {...props}>{children}</a>,
}));

describe('ServicesSection', () => {
  it('renders service cards', () => {
    render(<ServicesSection />);
    expect(screen.getAllByText('Our services').length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Evidence-based pathways/).length).toBeGreaterThan(0);
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

  it('renders Learn More links', () => {
    render(<ServicesSection />);
    const links = screen.getAllByText('Learn More');
    // Each service card has a Learn More link; may be duplicated in dev mode
    expect(links.length % SERVICES.length).toBe(0);
    for (const link of links) {
      expect(link.closest('a')).toHaveAttribute('href', '#');
    }
  });
});
