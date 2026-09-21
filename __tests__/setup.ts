import '@testing-library/jest-dom/vitest';
import { createElement } from 'react';
import { vi } from 'vitest';

vi.mock('motion/react', () => ({
  useReducedMotion: () => false,
  motion: new Proxy({}, {
    get: () => (props: Record<string, unknown>) => {
      const { children, ...rest } = props;
      return createElement('div', rest, children);
    },
  }),
  AnimatePresence: (props: { children?: React.ReactNode }) => props.children ?? null,
}));
