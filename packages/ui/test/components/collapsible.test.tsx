// @vitest-environment happy-dom
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Collapsible } from '../../src';
import { click, render } from '../render';
describe('Collapsible', () => {
  it('renders the trigger as a ghost key at the Root size, with a chevron after the label', () => {
    const { container } = render(
      <Collapsible.Root size="sm">
        <Collapsible.Trigger>Advanced settings</Collapsible.Trigger>
        <Collapsible.Panel>Webhooks</Collapsible.Panel>
      </Collapsible.Root>,
    );
    const trigger = container.querySelector('button')!;
    expect(trigger.className).toContain('mu-button-ghost');
    expect(trigger.className).toContain('mu-s-sm');
    expect(trigger.lastElementChild!.getAttribute('class')).toContain('mu-collapsible-chevron');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(container.querySelector('.mu-collapsible-panel')).toBeNull();
    act(() => trigger.click());
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(container.querySelector('.mu-collapsible-panel')!.textContent).toBe('Webhooks');
  });
});

it('controlled open keeps its panel tied to the parent', () => {
  const change = vi.fn();
  const panel = (open: boolean) => <Collapsible.Root open={open} onOpenChange={change}><Collapsible.Trigger>Details</Collapsible.Trigger><Collapsible.Panel>Content</Collapsible.Panel></Collapsible.Root>;
  const { container, rerender } = render(panel(false));
  click(container.querySelector('button')!);
  expect(change).toHaveBeenCalledWith(true, expect.anything());
  expect(container.querySelector('button')!.getAttribute('aria-expanded')).toBe('false');
  rerender(panel(true));
  expect(container.querySelector('button')!.getAttribute('aria-expanded')).toBe('true');
  expect(container.querySelector('.mu-collapsible-panel')!.textContent).toBe('Content');
});
