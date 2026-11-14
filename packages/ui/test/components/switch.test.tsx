// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';
import { Switch } from '../../src';
import { SizeContext } from '../../src/internal/size';
import { click, render } from '../render';
describe('Switch', () => {
  it('stays where a controlled value puts it', () => {
    const { container } = render(<Switch aria-label="Public" checked={false} />);
    const control = container.querySelector('[role="switch"]')!;
    click(control);
    expect(control.getAttribute('aria-checked')).toBe('false');
  });
});

it.each(['xs', 'sm', 'md'] as const)('size=%s overrides an inherited size and keeps disabled state', (size) => {
  const { container } = render(<SizeContext.Provider value="sm"><Switch size={size} disabled aria-label="Choice" /></SizeContext.Provider>);
  const control = container.querySelector('[role="switch"]')!;
  expect(control.classList.contains(`mu-s-${size}`)).toBe(true);
  expect(control.getAttribute('aria-disabled')).toBe('true');
});

it('defaultChecked updates internally and reports the new value', () => {
  const change = vi.fn();
  const { container } = render(<Switch defaultChecked onCheckedChange={change} aria-label="Choice" />);
  const control = container.querySelector('[role="switch"]')!;
  click(control);
  expect(change).toHaveBeenCalledWith(false, expect.anything());
  expect(control.getAttribute('aria-checked')).toBe('false');
});
