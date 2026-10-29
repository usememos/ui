import { Button, Field, Input, Popover, Switch } from '@usememos/ui';
import { Copy, Share } from 'lucide-react';
import type { SectionProps } from '.';

export function PopoverSection({ size }: SectionProps) {
  return (
    <div className="pg-row">
      <Popover.Root>
        <Popover.Trigger render={<Button size={size} icon={<Share />}>Share</Button>} />
        <Popover.Popup align="start">
          <Popover.Title>Share this note</Popover.Title>
          <Popover.Description>Anyone with the link can read it.</Popover.Description>
          <Input readOnly defaultValue="https://memos.example.com/m/42" aria-label="Link" suffix={<Button variant="ghost" size="sm" icon={<Copy />} aria-label="Copy link" />} />
          <Field.Root>
            <Field.Label>
              <Switch defaultChecked /> Public
            </Field.Label>
          </Field.Root>
        </Popover.Popup>
      </Popover.Root>
    </div>
  );
}
