// @vitest-environment happy-dom
import { Lock, Pin } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { Menu } from '../../src';
import { click, render, settle } from '../render';
describe('Menu', () => {
  it('passes the Root size to the popup, and builds rows with icon, label and shortcut', async () => {
    render(
      <Menu.Root size="sm" defaultOpen>
        <Menu.Trigger>More</Menu.Trigger>
        <Menu.Popup>
          <Menu.Item icon={<Pin />} shortcut="P">
            Pin
          </Menu.Item>
          <Menu.Item danger>Delete</Menu.Item>
          <Menu.CheckboxItem defaultChecked>Show completed</Menu.CheckboxItem>
        </Menu.Popup>
      </Menu.Root>,
    );
    await settle();
    const popup = document.querySelector('.mu-menu-popup')!;
    expect(popup.className).toContain('mu-s-sm');
    const [pin, remove, check] = popup.querySelectorAll('[role^="menuitem"]');
    expect(pin!.querySelector('svg.lucide-pin')).not.toBeNull();
    expect(pin!.querySelector('.mu-menu-label')!.textContent).toBe('Pin');
    expect(pin!.querySelector('.mu-menu-shortcut')!.textContent).toBe('P');
    expect(remove!.className).toContain('mu-menu-item-danger');
    expect(check!.getAttribute('aria-checked')).toBe('true');
    expect(check!.querySelector('.mu-menu-indicator svg.lucide-check')).not.toBeNull();
  });
});

describe('Menu description', () => {
  it('stacks the label over the description, and names and describes the item by them', async () => {
    render(
      <Menu.Root defaultOpen>
        <Menu.Trigger>Visibility</Menu.Trigger>
        <Menu.Popup>
          <Menu.RadioGroup defaultValue="private">
            <Menu.RadioItem value="private" icon={<Lock />} description="Only you can see it">
              Private
            </Menu.RadioItem>
          </Menu.RadioGroup>
          <Menu.Item>Plain</Menu.Item>
        </Menu.Popup>
      </Menu.Root>,
    );
    await settle();
    const [item, plain] = [...document.querySelectorAll('[role="menuitemradio"], [role="menuitem"]')];
    const text = item!.querySelector('.mu-menu-text')!;
    expect([...text.children].map((child) => child.className)).toEqual(['mu-menu-label', 'mu-menu-description mu-caption']);
    expect(item!.hasAttribute('aria-labelledby')).toBe(false);
    expect(text.querySelector('.mu-menu-label')!.textContent).toBe('Private');
    const description = document.getElementById(item!.getAttribute('aria-describedby')!)!;
    expect(description.textContent).toBe('Only you can see it');
    expect(description.getAttribute('aria-hidden')).toBe('true');
    expect(plain!.hasAttribute('aria-labelledby')).toBe(false);
    expect(plain!.querySelector('.mu-menu-text')).toBeNull();
  });
});

it('container, render, refs and native popup attributes reach the requested portal', async () => {
  const host = document.createElement('div');
  document.body.append(host);
  const ref = { current: null as HTMLDivElement | null };
  render(<Menu.Root defaultOpen><Menu.Popup container={host} side="top" align="end" positionMethod="fixed" sticky={false} anchor={host} collisionBoundary={host} collisionAvoidance={{ side: "none", align: "none" }} disableAnchorTracking ref={ref} className="app-popup" data-contract="popup" render={<section />}><Menu.Item>Action</Menu.Item></Menu.Popup></Menu.Root>);
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


});

it('all row types keep optional content and selected state separate from their accessible descriptions', async () => {
  const change = vi.fn();
  render(<Menu.Root defaultOpen><Menu.Popup>
    <Menu.Item icon={<Pin />} description="Action details" shortcut="P">Pin</Menu.Item>
    <Menu.CheckboxItem icon={<Pin />} description="Saved choice" shortcut="A" checked onCheckedChange={change}>Archived</Menu.CheckboxItem>
    <Menu.RadioGroup value="a"><Menu.RadioItem value="a" icon={<Pin />} shortcut="R" description="Radio details">A</Menu.RadioItem></Menu.RadioGroup>
    <Menu.SubmenuRoot><Menu.SubmenuTrigger icon={<Pin />}>More</Menu.SubmenuTrigger><Menu.Popup><Menu.Item>Nested</Menu.Item></Menu.Popup></Menu.SubmenuRoot>
  </Menu.Popup></Menu.Root>);
  await settle();
  const rows = document.querySelectorAll('.mu-menu-item');
  for (const row of [...rows].slice(0, 3)) {
    expect(row.querySelector('.lucide-pin')).not.toBeNull();
    expect(row.querySelector('.mu-menu-shortcut')).not.toBeNull();
    const description = document.getElementById(row.getAttribute('aria-describedby')!);
    expect(description!.textContent).toBeTruthy();
  }
  const checkbox = document.querySelector('[role="menuitemcheckbox"]')!;
  click(checkbox);
  expect(change).toHaveBeenCalledWith(false, expect.anything());
  expect(checkbox.getAttribute('aria-checked')).toBe('true');
  expect(document.querySelector('[role="menuitemradio"]')!.getAttribute('aria-checked')).toBe('true');
  expect(document.querySelector('.mu-menu-submenu-trigger .lucide-chevron-right')).not.toBeNull();
});

it('Group, GroupLabel and Separator preserve group naming and caller refs', async () => {
  const ref = { current: null as HTMLDivElement | null };
  render(<Menu.Root defaultOpen><Menu.Popup><Menu.Group ref={ref} className="app-group"><Menu.GroupLabel>Actions</Menu.GroupLabel><Menu.Item>First</Menu.Item></Menu.Group><Menu.Separator /><Menu.Group aria-label="Other"><Menu.Item>Second</Menu.Item></Menu.Group></Menu.Popup></Menu.Root>);
  await settle();
  const group = document.querySelector('.mu-menu-group')!;
  expect(ref.current).toBe(group);
  expect(group.classList.contains('app-group')).toBe(true);
  expect(document.getElementById(group.getAttribute('aria-labelledby')!)!.textContent).toBe('Actions');
  expect(document.querySelector('.mu-menu-separator')!.getAttribute('role')).toBe('separator');
});
