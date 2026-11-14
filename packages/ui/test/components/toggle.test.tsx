// @vitest-environment happy-dom
import { Bold } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { Toggle, type ToggleVariant } from '../../src';
import { click, render } from '../render';
describe('Toggle', () => {
  it('keeps the default classes and passes soft pill state through Base UI', () => {
    const { container, rerender } = render(<Toggle>Filter</Toggle>);
    const button = container.querySelector('button')!;
    const original = button.className;
    rerender(<Toggle variant="ghost" shape="default">Filter</Toggle>);
    expect(button.className).toBe(original);
    rerender(<Toggle variant="soft" shape="pill" size="sm" disabled>Filter</Toggle>);
    expect(button.classList.contains('mu-toggle-soft')).toBe(true);
    expect(button.classList.contains('mu-toggle-pill')).toBe(true);
    expect(button.classList.contains('mu-s-sm')).toBe(true);
    expect(button.hasAttribute('variant')).toBe(false);
    expect(button.hasAttribute('shape')).toBe(false);
    expect(button.hasAttribute('data-disabled')).toBe(true);
  });

  it('keeps soft emoji content controlled without using the Lucide icon slot', () => {
    let next: boolean | undefined;
    const { container, rerender } = render(
      <Toggle variant="soft" pressed={false} onPressedChange={(pressed) => { next = pressed; }} aria-label="Heart">
        <span aria-hidden>❤️</span>
      </Toggle>,
    );
    const button = container.querySelector('button')!;
    click(button);
    expect(next).toBe(true);
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.className).not.toContain('mu-toggle-icon');
    expect(button.querySelector('.mu-toggle-label')!.textContent).toBe('❤️');
    rerender(<Toggle variant="soft" pressed aria-label="Heart"><span aria-hidden>❤️</span></Toggle>);
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.hasAttribute('data-pressed')).toBe(true);
  });

  it('is square with only an icon', () => {
    const { container } = render(<Toggle icon={<Bold />} aria-label="Bold" />);
    const button = container.querySelector('button')!;
    expect(button.className).toContain('mu-toggle-icon');
    expect(button.querySelector('.mu-toggle-label')).toBeNull();
  });

  it('stays pressed while on', () => {
    const { container } = render(<Toggle>Pinned</Toggle>);
    const button = container.querySelector('button')!;
    click(button);
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.hasAttribute('data-pressed')).toBe(true);
  });
});

const variants = { ghost: 'mu-toggle', soft: 'mu-toggle-soft' } satisfies Record<ToggleVariant, string>;
it.each(Object.entries(variants))('variant=%s preserves the saved selection through disabled and shape changes', (variant, className) => {
  const change = vi.fn();
  const { container, rerender } = render(<Toggle variant={variant as ToggleVariant} shape="default" pressed onPressedChange={change}>Pinned</Toggle>);
  const button = container.querySelector('button')!;
  expect(button.classList.contains(className)).toBe(true);
  click(button); expect(change).toHaveBeenCalledWith(false, expect.anything());
  expect(button.getAttribute('aria-pressed')).toBe('true');
  rerender(<Toggle variant={variant as ToggleVariant} shape="pill" pressed disabled>Pinned</Toggle>);
  expect(button.classList.contains('mu-toggle-pill')).toBe(true);
  expect(button.getAttribute('aria-pressed')).toBe('true');
  expect(button.disabled).toBe(true);
});
