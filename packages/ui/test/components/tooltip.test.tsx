// @vitest-environment happy-dom
import { Pin } from 'lucide-react';
import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button, Tooltip } from '../../src';
import { render, settle } from '../render';
afterEach(() => vi.useRealTimers());

describe('Tooltip', () => {
  it('renders into the given container', async () => {
    const host = document.createElement('div');
    document.body.append(host);
    render(
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger render={<Button icon={<Pin />} aria-label="Pin" />} />
        <Tooltip.Popup container={host} side="top" align="end" positionMethod="fixed" sticky={false} anchor={host} collisionBoundary={host} collisionAvoidance={{ side: "none", align: "none" }} disableAnchorTracking shortcut="P">
          Pin
        </Tooltip.Popup>
      </Tooltip.Root>,
    );
    await settle();
    const popup = host.querySelector('.mu-tooltip-popup')!;
    expect(popup.textContent).toBe('PinP');
    expect((popup.parentElement as HTMLElement).style.position).toBe('fixed');
    expect(popup.parentElement!.getAttribute('data-side')).toBe('top');
    expect(popup.parentElement!.getAttribute('data-align')).toBe('end');
    expect(popup.hasAttribute('positionMethod')).toBe(false);
    expect(popup.querySelector('.mu-tooltip-shortcut')!.textContent).toBe('P');
  });
});

it.each([75, 400])('delay=%s controls pointer opening', async (delay) => {
  vi.useFakeTimers();
  const { container } = render(<Tooltip.Provider><Tooltip.Root><Tooltip.Trigger delay={delay}>Help</Tooltip.Trigger><Tooltip.Popup>Help text</Tooltip.Popup></Tooltip.Root></Tooltip.Provider>);
  const trigger = container.querySelector('button')!;
  await act(async () => {
    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    trigger.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 1, clientY: 1 }));
  });
  await act(async () => vi.advanceTimersByTime(delay - 1));
  expect(document.querySelector('.mu-tooltip-popup')).toBeNull();
  await act(async () => vi.advanceTimersByTime(1));
  expect(document.querySelector('.mu-tooltip-popup')!.textContent).toBe('Help text');
});
