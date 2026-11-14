// @vitest-environment happy-dom
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Input } from '../../src';
import { render } from '../render';

describe('Input', () => {
  it('puts className and style on the box, and the ref and props on the input', () => {
    const ref = { current: null as HTMLInputElement | null };
    const { container } = render(<Input ref={ref} className="app" style={{ maxWidth: 200 }} placeholder="Title" prefix="#" suffix="px" />);
    const box = container.querySelector('.mu-input-root') as HTMLElement;
    expect(box.className.split(' ').at(-1)).toBe('app');
    expect(box.style.maxWidth).toBe('200px');
    expect(ref.current).toBe(container.querySelector('input'));
    expect(ref.current!.placeholder).toBe('Title');
    expect(ref.current!.className).toBe('mu-input');
    expect([...box.children].map((child) => child.className)).toEqual(['mu-input-prefix', 'mu-input', 'mu-input-suffix']);
  });

  it('calls onValueChange as the user types', () => {
    const onValueChange = vi.fn();
    const { container } = render(<Input onValueChange={onValueChange} />);
    const input = container.querySelector('input')!;
    act(() => {
      // React reads the value through the prototype setter it tracks.
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, 'hi');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(onValueChange).toHaveBeenCalledWith('hi', expect.anything());
  });
});

it.each(['sm', 'md'] as const)('size=%s preserves the controlled value, native props and ref', (size) => {
  const ref = { current: null as HTMLInputElement | null };
  const { container, rerender } = render(<Input ref={ref} size={size} value="first" readOnly name="title" />);
  expect(container.querySelector('.mu-input-root')!.classList.contains(`mu-s-${size}`)).toBe(true);
  expect(ref.current!.value).toBe('first');
  expect(ref.current!.readOnly).toBe(true);
  expect(ref.current!.name).toBe('title');
  rerender(<Input ref={ref} size={size} value="second" readOnly />);
  expect(ref.current!.value).toBe('second');
});
