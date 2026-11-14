// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { AlertDialog, Button, Dialog, Field, Input, Popover, Table, ToggleGroup } from '../../src';
import { render, settle } from '../render';
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
