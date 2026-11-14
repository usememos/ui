import { act, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach } from 'vitest';

// Tells React that act() works in this environment.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const mounted = new Set<() => void>();

afterEach(() => {
  for (const unmount of mounted) unmount();
  document.body.innerHTML = '';
});

export const click = (element: Element) => act(() => (element as HTMLElement).click());
export const settle = () => act(() => new Promise((resolve) => setTimeout(resolve, 20)));

/** Renders into a fresh container and returns it, for tests in happy-dom. */
export function render(node: ReactNode) {
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  act(() => root.render(node));
  const unmount = () => {
    act(() => root.unmount());
    mounted.delete(unmount);
    container.remove();
  };
  mounted.add(unmount);
  return {
    container,
    rerender: (next: ReactNode) => act(() => root.render(next)),
    unmount,
  };
}
