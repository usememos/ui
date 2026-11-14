// @vitest-environment happy-dom
import { act } from 'react';
import { describe, expect, it } from 'vitest';
import { Toggle, ToggleGroup } from '../../src';
import { click, render } from '../render';
describe('ToggleGroup', () => {
  const group = (props: Partial<React.ComponentProps<typeof ToggleGroup>> = {}) => (
    <ToggleGroup aria-label="Show" {...props}>
      <Toggle value="all">All</Toggle>
      <Toggle value="pinned">Pinned</Toggle>
    </ToggleGroup>
  );

  it('is a segmented well with a key, and puts its size on every toggle', () => {
    const { container } = render(group({ size: 'sm', defaultValue: ['all'] }));
    const root = container.querySelector('.mu-toggle-group') as HTMLElement;
    expect(root.className).toContain('mu-segmented');
    expect(root.querySelector(':scope > .mu-segmented-key')).not.toBeNull();
    expect([...root.querySelectorAll('button')].every((button) => button.className.includes('mu-s-sm'))).toBe(true);
  });

  it('places the key under the pressed toggle and drops it when none is pressed', async () => {
    const { container } = render(group({ defaultValue: ['all'] }));
    const root = container.querySelector('.mu-toggle-group') as HTMLElement;
    expect(root.hasAttribute('data-keyed')).toBe(true);
    expect(root.style.getPropertyValue('--key-width')).toMatch(/px$/);
    const [all, pinned] = container.querySelectorAll('button');
    click(pinned!);
    expect(pinned!.hasAttribute('data-pressed')).toBe(true);
    expect(all!.hasAttribute('data-pressed')).toBe(false);
    click(pinned!);
    // The MutationObserver runs as a microtask.
    await act(async () => { });
    expect(root.hasAttribute('data-keyed')).toBe(false);
  });

  it('follows a controlled value', () => {
    const { container, rerender } = render(group({ value: ['all'] }));
    const [all, pinned] = container.querySelectorAll('button');
    click(pinned!);
    expect(all!.hasAttribute('data-pressed')).toBe(true);
    rerender(group({ value: ['pinned'] }));
    expect(pinned!.hasAttribute('data-pressed')).toBe(true);
  });

  it('has no key with multiple', () => {
    const { container } = render(group({ multiple: true, defaultValue: ['all', 'pinned'] }));
    const root = container.querySelector('.mu-toggle-group')!;
    expect(root.className).not.toContain('mu-segmented');
    expect(root.querySelector('.mu-segmented-key')).toBeNull();
    expect(container.querySelectorAll('[data-pressed]').length).toBe(2);
  });
});

describe('ToggleGroup fullWidth', () => {
  it('adds the full-width class only when set', () => {
    const { container } = render(
      <>
        <ToggleGroup fullWidth aria-label="View" defaultValue={['list']}>
          <Toggle value="list">List</Toggle>
          <Toggle value="grid">Masonry</Toggle>
        </ToggleGroup>
        <ToggleGroup aria-label="Show">
          <Toggle value="all">All</Toggle>
        </ToggleGroup>
      </>,
    );
    const [full, plain] = [...container.querySelectorAll('[role="group"]')] as [Element, Element];
    expect(full.className).toContain('mu-toggle-group-full');
    expect(full.className).toContain('mu-segmented');
    expect(plain.className).not.toContain('mu-toggle-group-full');
  });
});

it.each(['xs', 'sm', 'md'] as const)('size=%s reaches items, which may explicitly override it', (size) => {
  const { container } = render(<ToggleGroup size={size} aria-label="Choices"><Toggle value="a">A</Toggle><Toggle value="b" size="sm">B</Toggle></ToggleGroup>);
  const [a, b] = container.querySelectorAll('button');
  expect(a!.classList.contains(`mu-s-${size}`)).toBe(true);
  expect(b!.classList.contains('mu-s-sm')).toBe(true);
});
