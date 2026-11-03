import { AlertDialog, Button, Dialog, Field, Input, menuClasses, Select } from '@usememos/ui';
import { FileText, Search, Trash2 } from 'lucide-react';

const menu = menuClasses();
import type { SectionProps } from '.';

export function DialogSection({ size }: SectionProps) {
  return (
    <div className="pg-row">
      <Dialog.Root>
        <Dialog.Trigger render={<Button size={size}>Create access token</Button>} />
        <Dialog.Popup>
          <Dialog.Title>Create access token</Dialog.Title>
          <Dialog.Description>Use it to call the API from scripts.</Dialog.Description>
          <Field.Root>
            <Field.Label>Description</Field.Label>
            <Input placeholder="Backup script" />
          </Field.Root>
          <Field.Root>
            <Field.Label>Expires</Field.Label>
            <Select.Root items={{ 30: 'In 30 days', 90: 'In 90 days', 0: 'Never' }} defaultValue="30">
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Popup>
                <Select.Item value="30">In 30 days</Select.Item>
                <Select.Item value="90">In 90 days</Select.Item>
                <Select.Item value="0">Never</Select.Item>
              </Select.Popup>
            </Select.Root>
          </Field.Root>
          <Dialog.Footer>
            <Dialog.Close render={<Button variant="ghost">Cancel</Button>} />
            <Button variant="primary">Create</Button>
          </Dialog.Footer>
        </Dialog.Popup>
      </Dialog.Root>
      <Dialog.Root>
        <Dialog.Trigger render={<Button size={size} icon={<Search />}>Quick find</Button>} />
        <Dialog.Popup variant="bare" aria-label="Quick find">
          <Input prefix={<Search />} placeholder="Find notes and pages" aria-label="Find" className="pg-bare-search" />
          <div className="pg-bare-list">
            {['Reading list', 'Weekly review', 'Trip to Lisbon'].map((title) => (
              <Dialog.Close key={title} className={menu.item}>
                <FileText aria-hidden />
                <span className={menu.label}>{title}</span>
              </Dialog.Close>
            ))}
          </div>
        </Dialog.Popup>
      </Dialog.Root>
      <AlertDialog.Root>
        <AlertDialog.Trigger render={<Button size={size} icon={<Trash2 />}>Delete note</Button>} />
        <AlertDialog.Popup>
          <AlertDialog.Title>Delete this note?</AlertDialog.Title>
          <AlertDialog.Description>It moves to the trash for 30 days, then it is gone.</AlertDialog.Description>
          <AlertDialog.Footer>
            <AlertDialog.Close render={<Button variant="ghost">Cancel</Button>} />
            <AlertDialog.Close render={<Button variant="danger">Delete</Button>} />
          </AlertDialog.Footer>
        </AlertDialog.Popup>
      </AlertDialog.Root>
    </div>
  );
}
