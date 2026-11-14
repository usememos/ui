// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';
import { AlertDialog, Button } from '../../src';
import { click, render, settle } from '../render';
describe('AlertDialog', () => {
  it('AlertDialog has no X', async () => {
    render(
      <AlertDialog.Root defaultOpen>
        <AlertDialog.Popup>
          <AlertDialog.Title>Delete this note?</AlertDialog.Title>
        </AlertDialog.Popup>
      </AlertDialog.Root>,
    );
    await settle();
    expect(document.querySelector('[role="alertdialog"]')).not.toBeNull();
    expect(document.querySelector('.mu-dialog-x')).toBeNull();
  });
});

it('container, render, refs and native popup attributes reach the requested portal', async () => {
  const host = document.createElement('div');
  document.body.append(host);
  const ref = { current: null as HTMLDivElement | null };
  render(<AlertDialog.Root defaultOpen><AlertDialog.Popup container={host} sheet={false} ref={ref} className="app-popup" data-contract="popup" render={<section />}><AlertDialog.Title>Confirm</AlertDialog.Title><AlertDialog.Description>Continue?</AlertDialog.Description><AlertDialog.Footer><AlertDialog.Close>Cancel</AlertDialog.Close></AlertDialog.Footer></AlertDialog.Popup></AlertDialog.Root>);
  await settle();
  const popup = host.querySelector<HTMLElement>('[data-contract="popup"]')!;
  expect(popup).not.toBeNull();
  expect(ref.current).toBe(popup);
  expect(popup.tagName).toBe('SECTION');
  expect(popup.classList.contains('app-popup')).toBe(true);

  expect(host.querySelector(".mu-dialog-viewport")!.classList.contains("mu-dialog-sheet")).toBe(false);
});

it('Trigger and Close preserve rendered controls and report the open lifecycle', async () => {
  const change = vi.fn();
  const ref = { current: null as HTMLButtonElement | null };
  const { container } = render(<AlertDialog.Root onOpenChange={change}><AlertDialog.Trigger ref={ref} render={<Button />}>Open</AlertDialog.Trigger><AlertDialog.Popup><AlertDialog.Title>Details</AlertDialog.Title><AlertDialog.Close data-close="explicit">Close</AlertDialog.Close></AlertDialog.Popup></AlertDialog.Root>);
  const trigger = container.querySelector('button')!;
  expect(ref.current).toBe(trigger);
  click(trigger); await settle();
  expect(change).toHaveBeenLastCalledWith(true, expect.anything());
  const close = document.querySelector('[data-close="explicit"]')!;
  expect(close).not.toBeNull();
  click(close); await settle();
  expect(change).toHaveBeenLastCalledWith(false, expect.anything());
});
