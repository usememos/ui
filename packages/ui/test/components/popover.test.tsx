// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { Popover, popoverClasses } from '../../src';
import { render, settle } from '../render';
const split = (classes: string) => classes.split(' ').filter(Boolean).sort();

describe('Popover', () => {
  it('portals to the body and forwards positioner props', async () => {
    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>Share</Popover.Trigger>
        <Popover.Popup side="top" align="start">
          <Popover.Title>Share</Popover.Title>
        </Popover.Popup>
      </Popover.Root>,
    );
    await settle();
    const popup = document.querySelector('.mu-popover-popup')!;
    const positioner = popup.parentElement!;
    expect(positioner.className).toContain('mu-positioner');
    expect(positioner.getAttribute('data-side')).toBe('top');
    expect(positioner.getAttribute('data-align')).toBe('start');
    expect(popup.closest('[data-base-ui-portal], body > div')).not.toBeNull();
    expect(popup.querySelector('h2')!.className).toContain('mu-popover-title');
  });
});

describe('Popover list', () => {
  it('uses the list classes', async () => {
    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>Account</Popover.Trigger>
        <Popover.Popup variant="list" aria-label="Account" />
      </Popover.Root>,
    );
    await settle();
    expect(split(document.querySelector('.mu-popover-popup')!.className)).toEqual(split(popoverClasses({ variant: 'list' }).popup));
    expect(popoverClasses().popup).not.toContain('mu-popover-list');
  });
});

it('container, render, refs and native popup attributes reach the requested portal', async () => {
  const host = document.createElement('div');
  document.body.append(host);
  const ref = { current: null as HTMLDivElement | null };
  render(<Popover.Root defaultOpen><Popover.Popup container={host} side="top" align="end" positionMethod="fixed" sticky={false} anchor={host} collisionBoundary={host} collisionAvoidance={{ side: "none", align: "none" }} disableAnchorTracking ref={ref} className="app-popup" data-contract="popup" render={<section />}><Popover.Title>Details</Popover.Title><Popover.Description>Additional information</Popover.Description><Popover.Close>Close</Popover.Close></Popover.Popup></Popover.Root>);
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
