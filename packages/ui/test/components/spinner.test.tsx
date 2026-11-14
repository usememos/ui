// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { Spinner } from '../../src';
import { render } from '../render';
describe('Spinner', () => {
  it('Spinner is a named status', () => {
    const { container } = render(<Spinner size="sm" label="Loading notes" />);
    const spinner = container.querySelector('.mu-spinner')!;
    expect(spinner.getAttribute('role')).toBe('status');
    expect(spinner.getAttribute('aria-label')).toBe('Loading notes');
    expect(spinner.className).toContain('mu-s-sm');
  });
});

it.each(['xs', 'sm', 'md'] as const)('size=%s keeps its accessible label through render and ref', (size) => {
  const ref = { current: null as HTMLSpanElement | null };
  const { container } = render(<Spinner ref={ref} size={size} label="Working" render={<div />} className="app" />);
  const spinner = container.firstElementChild!;
  expect(ref.current).toBe(spinner);
  expect(spinner.tagName).toBe('DIV');
  expect(spinner.getAttribute('aria-label')).toBe('Working');
  expect(spinner.getAttribute('role')).toBe('status');
  expect(spinner.classList.contains(`mu-s-${size}`)).toBe(true);
});
