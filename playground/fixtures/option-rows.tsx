import { Button, Combobox, Field, Menu, Select } from '@usememos/ui';
import { Pin } from 'lucide-react';
import type { RowSize } from '../sections';

const choices = ['Pinned', 'Archived', 'Everything'];

export function MenuRowParts({ size }: { size: RowSize; }) {
  return (
    <Menu.Root size={size}>
      <Menu.Trigger render={<Button size={size}>Collection actions</Button>} />
      <Menu.Popup>
        <Menu.Group>
          <Menu.GroupLabel>Actions</Menu.GroupLabel>
          <Menu.Item icon={<Pin />} shortcut="P">Pin</Menu.Item>
          <Menu.Item shortcut="⇧⌘E" description="Exportieren Sie alle Einträge einschließlich ihrer Anhänge.">Export all entries with attachments</Menu.Item>
          <Menu.CheckboxItem checked disabled shortcut="A" description="This saved choice is currently unavailable">Archived</Menu.CheckboxItem>
          <Menu.Item danger disabled>Delete</Menu.Item>
        </Menu.Group>
        <Menu.Separator />
        <Menu.Group>
          <Menu.GroupLabel>Text only</Menu.GroupLabel>
          <Menu.Item>Everything</Menu.Item>
          <Menu.SubmenuRoot>
            <Menu.SubmenuTrigger>More collections</Menu.SubmenuTrigger>
            <Menu.Popup>
              <Menu.Item>Personal</Menu.Item>
              <Menu.Item>Shared</Menu.Item>
            </Menu.Popup>
          </Menu.SubmenuRoot>
        </Menu.Group>
      </Menu.Popup>
    </Menu.Root>
  );
}

export function SelectDisabledChoice({ size }: { size: RowSize; }) {
  return (
    <Select.Root size={size} defaultValue="Archived">
      <Select.Trigger aria-label="Collection choice"><Select.Value /></Select.Trigger>
      <Select.Popup>
        <Select.Group>
          <Select.GroupLabel>Collections</Select.GroupLabel>
          {choices.map((choice, index) => (
            <Select.Item key={choice} value={choice} icon={index === 0 ? <Pin /> : undefined} disabled={choice === 'Archived'}>{choice}</Select.Item>
          ))}
        </Select.Group>
        <Select.Group>
          <Select.GroupLabel>Text only</Select.GroupLabel>
          <Select.Item value="Personal">Personal</Select.Item>
        </Select.Group>
      </Select.Popup>
    </Select.Root>
  );
}

export function ComboboxMixedIcons({ size }: { size: RowSize; }) {
  return (
    <Field.Root>
      <Field.Label>Filter collections</Field.Label>
      <Combobox.Root size={size} items={choices} defaultValue="Archived">
        <Combobox.Input />
        <Combobox.Popup>
          <Combobox.List aria-label="Collection results">
            {(choice: string) => (
              <Combobox.Item key={choice} value={choice} icon={choice === 'Pinned' ? <Pin /> : undefined} disabled={choice === 'Archived'}>{choice}</Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Root>
      <Field.Description>workspace_export_2026_11_14_with_all_original_attachments_and_metadata</Field.Description>
    </Field.Root>
  );
}
