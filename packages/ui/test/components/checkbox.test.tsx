// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';
import { Checkbox } from '../../src';
import { SizeContext } from '../../src/internal/size';
import { click, render } from '../render';
describe('Checkbox', () => {
  it('toggles uncontrolled and reports the change', () => {
    const onCheckedChange = vi.fn();
    const { container } = render(<Checkbox aria-label="Done" onCheckedChange={onCheckedChange} />);
    const box = container.querySelector('[role="checkbox"]')!;
    click(box);
    expect(box.getAttribute('aria-checked')).toBe('true');
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it('shows a minus when indeterminate', () => {
    const { container } = render(<Checkbox aria-label="All" indeterminate />);
    expect(container.querySelector('.mu-checkbox-indicator svg')!.getAttribute('class')).toContain('lucide-minus');
  });
});

it.each(['xs', 'sm', 'md'] as const)('size=%s overrides an inherited size and keeps disabled state', (size) => {
  const { container } = render(<SizeContext.Provider value="sm"><Checkbox size={size} disabled aria-label="Choice" /></SizeContext.Provider>);
  const control = container.querySelector('[role="checkbox"]')!;
  expect(control.classList.contains(`mu-s-${size}`)).toBe(true);
  expect(control.getAttribute('aria-disabled')).toBe('true');
});

it('controlled checked reports a change and waits for the parent value', () => {
  const change = vi.fn();
  const { container, rerender } = render(<Checkbox checked={false} onCheckedChange={change} aria-label="Choice" />);
  const control = container.querySelector('[role="checkbox"]')!;
  click(control);
  expect(change).toHaveBeenCalledWith(true, expect.anything());
  expect(control.getAttribute('aria-checked')).toBe('false');
  rerender(<Checkbox checked aria-label="Choice" />);
  expect(control.getAttribute('aria-checked')).toBe('true');
});
