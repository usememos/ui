// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { Textarea } from '../../src';
import { render } from '../render';
describe('Textarea', () => {
  it('is a textarea with three rows by default', () => {
    const ref = { current: null as HTMLTextAreaElement | null };
    const { container } = render(<Textarea ref={ref} size="sm" />);
    const textarea = container.querySelector('textarea')!;
    expect(ref.current).toBe(textarea);
    expect(textarea.getAttribute('rows')).toBe('3');
    expect(textarea.className).toContain('mu-s-sm');
  });
});

it('rows overrides the default while controlled text and native attributes reach the textarea', () => {
  const { container, rerender } = render(<Textarea rows={5} value="first" readOnly name="body" className="app" />);
  const textarea = container.querySelector('textarea')!;
  expect(textarea.getAttribute('rows')).toBe('5');
  expect(textarea.value).toBe('first');
  expect(textarea.name).toBe('body');
  expect(textarea.classList.contains('app')).toBe(true);
  rerender(<Textarea rows={2} value="second" readOnly />);
  expect(textarea.getAttribute('rows')).toBe('2');
  expect(textarea.value).toBe('second');
});
