// @vitest-environment happy-dom
import { Pin } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { buttonClasses, Select } from '../../src';
import { render, settle } from '../render';
const split = (classes: string) => classes.split(' ').filter(Boolean).sort();

describe('Select', () => {
  it('makes the trigger a neutral key with a chevron, and shows the label of the value', async () => {
    render(
      <Select.Root size="sm" items={{ a: 'Apple', b: 'Banana' }} defaultValue="b">
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Popup>
          <Select.Item value="a">Apple</Select.Item>
          <Select.Item value="b">Banana</Select.Item>
        </Select.Popup>
      </Select.Root>,
    );
    await settle();
    const trigger = document.querySelector('.mu-select-trigger')!;
    expect(trigger.className).toContain('mu-button-neutral');
    expect(trigger.className).toContain('mu-s-sm');
    expect(trigger.querySelector('.mu-select-value')!.textContent).toBe('Banana');
    expect(trigger.querySelector('svg.lucide-chevron-down')).not.toBeNull();
    expect(trigger.querySelector('svg.lucide-chevrons-up-down')).toBeNull();
  });

  it('marks the placeholder', async () => {
    render(
      <Select.Root items={{ a: 'Apple' }}>
        <Select.Trigger>
          <Select.Value placeholder="Pick a fruit" />
        </Select.Trigger>
        <Select.Popup>
          <Select.Item value="a">Apple</Select.Item>
        </Select.Popup>
      </Select.Root>,
    );
    await settle();
    const value = document.querySelector('.mu-select-value')!;
    expect(value.textContent).toBe('Pick a fruit');
    expect(value.hasAttribute('data-placeholder')).toBe(true);
  });
});

describe('Select ghost trigger', () => {
  it('is a ghost button', () => {
    const { container } = render(
      <Select.Root size="sm" items={{ a: 'Personal' }} defaultValue="a">
        <Select.Trigger variant="ghost" aria-label="Space">
          <Select.Value />
        </Select.Trigger>
      </Select.Root>,
    );
    const trigger = container.querySelector('.mu-select-trigger')!;
    expect(split(trigger.className)).toEqual(split(`mu-select-trigger ${buttonClasses({ variant: 'ghost', size: 'sm' })}`));
  });
});

it('container, render, refs and native popup attributes reach the requested portal', async () => {
  const host = document.createElement('div');
  document.body.append(host);
  const ref = { current: null as HTMLDivElement | null };
  render(<Select.Root defaultOpen items={{ a: "A" }} defaultValue="a"><Select.Trigger aria-label="Choice"><Select.Value /></Select.Trigger><Select.Popup container={host} side="top" align="end" positionMethod="fixed" sticky={false} anchor={host} collisionBoundary={host} collisionAvoidance={{ side: "none", align: "none" }} disableAnchorTracking alignItemWithTrigger={false} ref={ref} className="app-popup" data-contract="popup" render={<section />}><Select.Item value="a" icon={<Pin />}>A</Select.Item></Select.Popup></Select.Root>);
  await settle();
  const popup = host.querySelector<HTMLElement>('[data-contract="popup"]')!;
  expect(popup).not.toBeNull();
  expect(ref.current).toBe(popup);
  expect(popup.tagName).toBe('SECTION');
  expect((popup.parentElement as HTMLElement).style.position).toBe('fixed');
  expect(popup.parentElement!.getAttribute('data-side')).toBe('top');
  expect(popup.parentElement!.getAttribute('data-align')).toBe('end');
  expect(popup.hasAttribute('positionMethod')).toBe(false);
  expect(popup.classList.contains('app-popup')).toBe(true);
  expect(popup.querySelector(".lucide-pin")).not.toBeNull();

});

it('Group labels and separators preserve list structure and selected values', async () => {
  const ref = { current: null as HTMLDivElement | null };
  render(<Select.Root defaultOpen defaultValue="a"><Select.Trigger aria-label="Choice"><Select.Value /></Select.Trigger><Select.Popup><Select.Group ref={ref}><Select.GroupLabel>First group</Select.GroupLabel><Select.Item value="a">A</Select.Item></Select.Group><Select.Separator /><Select.Group aria-label="Second group"><Select.Item value="b">B</Select.Item></Select.Group></Select.Popup></Select.Root>);
  await settle();
  const group = document.querySelector('.mu-select-group')!;
  expect(ref.current).toBe(group);
  expect(document.getElementById(group.getAttribute('aria-labelledby')!)!.textContent).toBe('First group');
  expect(document.querySelector('.mu-select-separator')!.getAttribute('role')).toBe('presentation');
  expect(group.querySelector('[aria-selected="true"]')!.textContent).toBe('A');
});
