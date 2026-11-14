// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { Separator } from '../../src';
import { render } from '../render';
describe('Separator', () => {
  it('Separator has an orientation', () => {
    const { container } = render(<Separator orientation="vertical" />);
    const separator = container.querySelector('.mu-separator')!;
    expect(separator.getAttribute('role')).toBe('separator');
    expect(separator.getAttribute('aria-orientation')).toBe('vertical');
  });
});

it.each(['horizontal', 'vertical'] as const)('orientation=%s reaches the custom separator and ref', (orientation) => {
  const ref = { current: null as HTMLDivElement | null };
  const { container } = render(<Separator ref={ref} orientation={orientation} render={<hr />} className="app" />);
  const separator = container.querySelector('hr')!;
  expect(ref.current).toBe(separator);
  expect(separator.getAttribute('aria-orientation')).toBe(orientation);
  expect(separator.classList.contains('mu-separator')).toBe(true);
});
