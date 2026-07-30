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
  it('renders the services section with heading', () => {
    render(<ServicesSection />);
    expect(screen.getAllByText('Our Services').length).toBeGreaterThan(0);
  });

  it('shows service titles from data.ts', () => {
    render(<ServicesSection />);
    for (const service of SERVICES) {
      const elements = screen.getAllByText(service.title);
      expect(elements.length).toBeGreaterThan(0);
    }
  });

  it('shows service short descriptions from data.ts', () => {
    render(<ServicesSection />);
    for (const service of SERVICES) {
      const elements = screen.getAllByText(service.shortDescription);
      expect(elements.length).toBeGreaterThan(0);
    }
  });

  it('renders a link for each service', () => {
    const { container } = render(<ServicesSection />);
    const links = container.querySelectorAll('a[href^="/services/"]');
    expect(links.length).toBe(SERVICES.length);
  });

  it('renders highlights for each service', () => {
    render(<ServicesSection />);
    for (const service of SERVICES) {
      for (const highlight of service.highlights) {
        const elements = screen.getAllByText(highlight);
        expect(elements.length).toBeGreaterThan(0);
      }
    }
  });
});
