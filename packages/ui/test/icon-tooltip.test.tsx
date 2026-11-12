// @vitest-environment happy-dom
import { Pin } from 'lucide-react';
import { act, createRef } from 'react';
import { createPortal } from 'react-dom';
import { expect, it, vi } from 'vitest';
import { Button } from '../src';
import { IconTooltip } from '../src/internal/icon-tooltip';
import { render } from './render';

const hover = async (element: Element) => {
  await act(async () => {
    element.dispatchEvent(new MouseEvent('mouseenter'));
    element.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 1, clientY: 1 }));
    await new Promise((resolve) => setTimeout(resolve, 450));
  });
};

it('uses the supplied label and container without adding a button or replacing its ref and action', async () => {
  const portal = document.createElement('div');
  document.body.append(portal);
  const ref = createRef<HTMLElement>();
  const action = vi.fn();
  const view = render(
    <IconTooltip label="Anheften" container={portal}>
      <Button ref={ref} icon={<Pin />} aria-label="Anheften" onClick={action} />
    </IconTooltip>,
  );
  const button = view.container.querySelector('button')!;
  expect(view.container.querySelectorAll('button')).toHaveLength(1);
  expect(ref.current).toBe(button);
  await hover(button);
  expect(portal.querySelector('.mu-tooltip-popup')?.textContent).toBe('Anheften');
  act(() => button.click());
  expect(action).toHaveBeenCalledOnce();
  view.unmount();
  portal.remove();
});

it('keeps an inferred tooltip portal in the trigger shadow root', async () => {
  const host = document.createElement('div');
  document.body.append(host);
  const shadow = host.attachShadow({ mode: 'open' });
  const view = render(createPortal(
    <IconTooltip label="Pin">
      <Button icon={<Pin />} aria-label="Pin" />
    </IconTooltip>,
    shadow,
  ));
  await hover(shadow.querySelector('button')!);
  expect(shadow.querySelector('.mu-tooltip-popup')?.textContent).toBe('Pin');
  expect(document.querySelector('.mu-tooltip-popup')).toBeNull();
  view.unmount();
  host.remove();
});
