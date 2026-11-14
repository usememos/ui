// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { Skeleton } from '../../src';
import { render } from '../render';
describe('Skeleton', () => {
  it('Skeleton is hidden from screen readers and a round one is square', () => {
    const { container } = render(<Skeleton round height={40} />);
    const skeleton = container.querySelector<HTMLElement>('.mu-skeleton')!;
    expect(skeleton.getAttribute('aria-hidden')).toBe('true');
    expect(skeleton.style.width).toBe('40px');
    expect(skeleton.style.height).toBe('40px');
  });
});

it.each(['xs', 'sm', 'md'] as const)('size=%s keeps explicit string dimensions and a custom element', (size) => {
  const ref = { current: null as HTMLDivElement | null };
  const { container, rerender } = render(<Skeleton ref={ref} size={size} width="60%" height="2em" render={<span />} className="app" />);
  const skeleton = container.firstElementChild as HTMLElement;
  expect(ref.current).toBe(skeleton);
  expect(skeleton.tagName).toBe('SPAN');
  expect(skeleton.classList.contains(`mu-s-${size}`)).toBe(true);
  expect(skeleton.style.width).toBe('60%');
  expect(skeleton.style.height).toBe('2em');
  rerender(<Skeleton size={size} width={80} height={40} round />);
  expect((container.firstElementChild as HTMLElement).style.width).toBe('80px');
});
