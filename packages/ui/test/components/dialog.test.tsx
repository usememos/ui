// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';
import { Button, Dialog } from '../../src';
import { click, render, settle } from '../render';
describe('Dialog', () => {
  it('draws a backdrop and an X named by closeLabel', async () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Popup closeLabel="Schließen">
          <Dialog.Title>Create access token</Dialog.Title>
          <Dialog.Footer>
            <Dialog.Close>Cancel</Dialog.Close>
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog.Root>,
    );
    await settle();
    expect(document.querySelector('.mu-dialog-backdrop')).not.toBeNull();
    expect(document.querySelector('.mu-dialog-viewport')!.className).toContain('mu-dialog-sheet');
    const popup = document.querySelector('[role="dialog"]')!;
    expect(popup.querySelector('.mu-dialog-x')!.getAttribute('aria-label')).toBe('Schließen');
    expect(popup.querySelector('.mu-dialog-footer')).not.toBeNull();
  });
  it('can stay centered on small screens', async () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Popup sheet={false}>
          <Dialog.Title>Title</Dialog.Title>
        </Dialog.Popup>
      </Dialog.Root>,
    );
    await settle();
    expect(document.querySelector('.mu-dialog-viewport')!.className).not.toContain('mu-dialog-sheet');
  });
});

describe('Dialog bare', () => {
  it('has no X', async () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Popup variant="bare" aria-label="Quick find">
          <input aria-label="Find" />
        </Dialog.Popup>
      </Dialog.Root>,
    );
    await settle();
    const popup = document.querySelector('[role="dialog"]')!;
    expect(popup.className).toContain('mu-dialog-bare');
    expect(popup.querySelector('.mu-dialog-x')).toBeNull();
  });
});

describe('Dialog fullScreen', () => {
  it('fills the viewport instead of becoming a sheet', async () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Popup variant="bare" fullScreen aria-label="Image" />
      </Dialog.Root>,
    );
    await settle();
    const viewport = document.querySelector('[role="dialog"]')!.parentElement!;
    expect(viewport.className).toContain('mu-dialog-full');
    expect(viewport.className).not.toContain('mu-dialog-sheet');
  });

  it('is a sheet by default', async () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Popup aria-label="Create" />
      </Dialog.Root>,
    );
    await settle();
    const viewport = document.querySelector('[role="dialog"]')!.parentElement!;
    expect(viewport.className).toContain('mu-dialog-sheet');
    expect(viewport.className).not.toContain('mu-dialog-full');
  });
});

it('container, render, refs and native popup attributes reach the requested portal', async () => {
  const host = document.createElement('div');
  document.body.append(host);
  const ref = { current: null as HTMLDivElement | null };
  render(<Dialog.Root defaultOpen><Dialog.Popup container={host} ref={ref} className="app-popup" data-contract="popup" render={<section />}><Dialog.Title>Details</Dialog.Title><Dialog.Description>Additional information</Dialog.Description></Dialog.Popup></Dialog.Root>);
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
  const { container } = render(<Dialog.Root onOpenChange={change}><Dialog.Trigger ref={ref} render={<Button />}>Open</Dialog.Trigger><Dialog.Popup><Dialog.Title>Details</Dialog.Title><Dialog.Close data-close="explicit">Close</Dialog.Close></Dialog.Popup></Dialog.Root>);
  const trigger = container.querySelector('button')!;
  expect(ref.current).toBe(trigger);
  click(trigger); await settle();
  expect(change).toHaveBeenLastCalledWith(true, expect.anything());
  const close = document.querySelector('[data-close="explicit"]')!;
  expect(close).not.toBeNull();
  click(close); await settle();
  expect(change).toHaveBeenLastCalledWith(false, expect.anything());
});
