// @vitest-environment happy-dom
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Button, Drawer } from '../../src';
import { click, render, settle } from '../render';
describe('Drawer', () => {
  it('slides from the end edge by default, with an X', async () => {
    render(
      <Drawer.Root defaultOpen>
        <Drawer.Popup closeLabel="Close details">
          <Drawer.Title>Details</Drawer.Title>
        </Drawer.Popup>
      </Drawer.Root>,
    );
    await settle();
    const popup = document.querySelector('.mu-drawer-popup')!;
    expect(popup.getAttribute('role')).toBe('dialog');
    expect(popup.parentElement!.className).toContain('mu-drawer-right');
    expect(popup.getAttribute('data-swipe-direction')).toBe('right');
    expect(popup.querySelector('.mu-drawer-x')!.getAttribute('aria-label')).toBe('Close details');
    expect(popup.querySelector('.mu-drawer-content > h2')!.className).toContain('mu-drawer-title');
    expect(document.querySelector('.mu-drawer-backdrop')).not.toBeNull();
  });

  it('puts start on the right in a right-to-left page, and bare has no X', async () => {
    render(
      <DirectionProvider direction="rtl">
        <Drawer.Root side="start" defaultOpen>
          <Drawer.Popup variant="bare" aria-label="Navigation" />
        </Drawer.Root>
      </DirectionProvider>,
    );
    await settle();
    const popup = document.querySelector('.mu-drawer-popup')!;
    expect(popup.parentElement!.className).toContain('mu-drawer-right');
    expect(popup.getAttribute('data-swipe-direction')).toBe('right');
    expect(popup.className).toContain('mu-drawer-bare');
    expect(popup.querySelector('.mu-drawer-x')).toBeNull();
  });

  it('slides from the bottom with side="bottom"', async () => {
    render(
      <Drawer.Root side="bottom" defaultOpen>
        <Drawer.Popup aria-label="Share" />
      </Drawer.Root>,
    );
    await settle();
    const popup = document.querySelector('.mu-drawer-popup')!;
    expect(popup.parentElement!.className).toContain('mu-drawer-bottom');
    expect(popup.getAttribute('data-swipe-direction')).toBe('down');
  });
});

describe('Drawer bare', () => {
  it('has a Close for screen readers, out of the tab order, that closes it', async () => {
    render(
      <Drawer.Root side="start" defaultOpen>
        <Drawer.Popup variant="bare" aria-label="Navigation" closeLabel="Close navigation">
          <nav />
        </Drawer.Popup>
      </Drawer.Root>,
    );
    await settle();
    const close = document.querySelector<HTMLButtonElement>('.mu-drawer-sr-close')!;
    expect(close.textContent).toBe('Close navigation');
    expect(close.className).toContain('mu-visually-hidden');
    expect(close.tabIndex).toBe(-1);
    expect(document.querySelector('.mu-drawer-x')).toBeNull();
    // It follows the content, so screen readers reach the content first.
    expect(close.previousElementSibling!.className).toContain('mu-drawer-content');
    await act(async () => close.click());
    await settle();
    expect(document.querySelector('.mu-drawer-popup')?.hasAttribute('data-open') ?? false).toBe(false);
  });

  it('has no screen-reader Close in the panel variant', async () => {
    render(
      <Drawer.Root defaultOpen>
        <Drawer.Popup aria-label="Details" />
      </Drawer.Root>,
    );
    await settle();
    expect(document.querySelector('.mu-drawer-sr-close')).toBeNull();
    expect(document.querySelector('.mu-drawer-x')).not.toBeNull();
  });
});

it('container, render, refs and native popup attributes reach the requested portal', async () => {
  const host = document.createElement('div');
  document.body.append(host);
  const ref = { current: null as HTMLDivElement | null };
  render(<Drawer.Root defaultOpen><Drawer.Popup container={host} ref={ref} className="app-popup" data-contract="popup" render={<section />}><Drawer.Title>Details</Drawer.Title><Drawer.Description>Additional information</Drawer.Description></Drawer.Popup></Drawer.Root>);
  await settle();
  const popup = host.querySelector<HTMLElement>('[data-contract="popup"]')!;
  expect(popup).not.toBeNull();
  expect(ref.current).toBe(popup);
  expect(popup.tagName).toBe('SECTION');
  expect(popup.classList.contains('app-popup')).toBe(true);


});

it('Trigger and Close preserve rendered controls and report the open lifecycle', async () => {
  const change = vi.fn();
  const ref = { current: null as HTMLButtonElement | null };
  const { container } = render(<Drawer.Root onOpenChange={change}><Drawer.Trigger ref={ref} render={<Button />}>Open</Drawer.Trigger><Drawer.Popup><Drawer.Title>Details</Drawer.Title><Drawer.Close data-close="explicit">Close</Drawer.Close></Drawer.Popup></Drawer.Root>);
  const trigger = container.querySelector('button')!;
  expect(ref.current).toBe(trigger);
  click(trigger); await settle();
  expect(change).toHaveBeenLastCalledWith(true, expect.anything());
  const close = document.querySelector('[data-close="explicit"]')!;
  expect(close).not.toBeNull();
  click(close); await settle();
  expect(change).toHaveBeenLastCalledWith(false, expect.anything());
});
