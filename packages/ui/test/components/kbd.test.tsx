// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { Kbd } from '../../src';
import { render } from '../render';
describe('Kbd', () => {
  it('Kbd renders a kbd element', () => {
    const { container } = render(<Kbd>⌘</Kbd>);
    expect(container.querySelector('kbd.mu-kbd')?.textContent).toBe('⌘');
  });
});

it('render, refs and caller attributes reach the key element', () => {
  const ref = { current: null as HTMLElement | null };
  const { container } = render(<Kbd ref={ref} render={<code />} className="app" data-key="enter">Enter</Kbd>);
  const key = container.querySelector('code')!;
  expect(ref.current).toBe(key);
  expect(key.textContent).toBe('Enter');
  expect(key.getAttribute('data-key')).toBe('enter');
  expect(key.classList.contains('mu-kbd')).toBe(true);
  expect(key.classList.contains('app')).toBe(true);
});
