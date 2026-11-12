// @vitest-environment happy-dom
// Our wiring on top of Base UI for the Phase 3 overlays: the folded Popup
// (portal, positioner props, container), size through Roots, built-in
// indicators, and the toast tones.
import { act } from 'react';
import { Pin } from 'lucide-react';
import { afterEach, describe, expect, it } from 'vitest';
import { AlertDialog, Button, Dialog, Field, Input, Menu, Popover, Select, Table, Toast, ToggleGroup, Tooltip } from '../src';
import { render } from './render';

afterEach(() => {
  document.body.innerHTML = '';
});

/** Lets Base UI's positioning and open effects settle. */
const settle = () => act(() => new Promise((resolve) => setTimeout(resolve, 20)));

describe('folded Popup', () => {
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

  it('renders into the given container', async () => {
    const host = document.createElement('div');
    document.body.append(host);
    render(
      <Tooltip.Root defaultOpen>
        <Tooltip.Trigger render={<Button icon={<Pin />} aria-label="Pin" />} />
        <Tooltip.Popup container={host} shortcut="P">
          Pin
        </Tooltip.Popup>
      </Tooltip.Root>,
    );
    await settle();
    const popup = host.querySelector('.mu-tooltip-popup')!;
    expect(popup.textContent).toBe('PinP');
    expect(popup.querySelector('.mu-tooltip-shortcut')!.textContent).toBe('P');
  });
});

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

describe('size inside panels', () => {
  // React context crosses the portal, so without a reset a panel declared
  // inside a sized Root would render its controls at that size.
  const contents = (
    <>
      <Field.Root>
        <Field.Label>Name</Field.Label>
        <Input />
      </Field.Root>
      <Button>Save</Button>
      <Button size="sm">Small on purpose</Button>
    </>
  );
  const expectMd = () => {
    expect(document.querySelector('.mu-input-root')!.className).toContain('mu-s-md');
    const buttons = [...document.querySelectorAll('button')];
    expect(buttons.find((b) => b.textContent === 'Save')!.className).toContain('mu-s-md');
    expect(buttons.find((b) => b.textContent === 'Small on purpose')!.className).toContain('mu-s-sm');
  };
  const inSmTable = (node: React.ReactNode) => (
    <Table.Root size="sm">
      <Table.Body>
        <Table.Row>
          <Table.Cell>{node}</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );

  it('Dialog starts at md inside a sm Table', async () => {
    render(inSmTable(<Dialog.Root defaultOpen><Dialog.Popup><Dialog.Title>Edit</Dialog.Title>{contents}</Dialog.Popup></Dialog.Root>));
    await settle();
    expectMd();
  });

  it('AlertDialog starts at md inside a sm Table', async () => {
    render(inSmTable(<AlertDialog.Root defaultOpen><AlertDialog.Popup><AlertDialog.Title>Delete?</AlertDialog.Title>{contents}</AlertDialog.Popup></AlertDialog.Root>));
    await settle();
    expectMd();
  });

  it('Popover starts at md inside a sm ToggleGroup', async () => {
    render(
      <ToggleGroup multiple size="sm" aria-label="Tools">
        <Popover.Root defaultOpen>
          <Popover.Trigger render={<Button>Filter</Button>} />
          <Popover.Popup aria-label="Filter">{contents}</Popover.Popup>
        </Popover.Root>
      </ToggleGroup>,
    );
    await settle();
    expect([...document.querySelectorAll('button')].find((b) => b.textContent === 'Filter')!.className).toContain('mu-s-sm');
    expectMd();
  });
});

describe('Toast', () => {
  it('shows each toast with the icon of its tone, and the action', async () => {
    const manager = Toast.createToastManager();
    render(
      <Toast.Provider toastManager={manager}>
        <Toast.Viewport />
      </Toast.Provider>,
    );
    act(() => {
      manager.add({ title: 'Settings saved', type: 'success' });
      manager.add({ title: 'Note archived', actionProps: { children: 'Undo' } });
    });
    await settle();
    const toasts = [...document.querySelectorAll('.mu-toast')];
    const saved = toasts.find((toast) => toast.textContent?.includes('Settings saved'))!;
    const archived = toasts.find((toast) => toast.textContent?.includes('Note archived'))!;
    expect(saved.className).toContain('mu-toast-success');
    expect(saved.querySelector('svg.lucide-circle-check')).not.toBeNull();
    expect(saved.querySelector('.mu-toast-action')).toBeNull();
    expect(archived.className).toContain('mu-toast-neutral');
    expect(archived.querySelector('.mu-toast-action')!.textContent).toBe('Undo');
    expect(archived.querySelector('.mu-toast-close')!.getAttribute('aria-label')).toBe('Close');
  });
});
