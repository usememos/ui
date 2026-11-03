import { Avatar, Button, Field, Input, menuClasses, Popover, Select, Switch, ToggleGroup, Toggle } from '@usememos/ui';
import { Copy, LogOut, Settings, Share, SlidersHorizontal, User } from 'lucide-react';
import type { SectionProps } from '.';

const menu = menuClasses();

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
      <Popover.Root>
        <Popover.Trigger render={<Button size={size} icon={<User />}>Account</Button>} />
        <Popover.Popup align="start" variant="list">
          <Popover.Title>Alex Kim</Popover.Title>
          <Popover.Description>alex@example.com</Popover.Description>
          <div className={menu.separator} role="separator" />
          <button type="button" className={menu.item}>
            <Settings aria-hidden />
            <span className={menu.label}>Settings</span>
          </button>
          <a className={menu.item} href="#popover">
            <LogOut aria-hidden />
            <span className={menu.label}>Sign out</span>
          </a>
        </Popover.Popup>
      </Popover.Root>
      <Popover.Root>
        <Popover.Trigger render={<Button size={size} icon={<SlidersHorizontal />}>View options</Button>} />
        <Popover.Popup align="start">
          <Popover.Title>View options</Popover.Title>
          <Field.Root orientation="horizontal">
            <Field.Label>Sort by</Field.Label>
            <Select.Root size="sm" items={{ updated: 'Updated', created: 'Created' }} defaultValue="updated">
              <Select.Trigger>
                <Select.Value />
              </Select.Trigger>
              <Select.Popup>
                <Select.Item value="updated">Updated</Select.Item>
                <Select.Item value="created">Created</Select.Item>
              </Select.Popup>
            </Select.Root>
          </Field.Root>
          <Field.Root orientation="horizontal">
            <Field.Label>Show pinned first</Field.Label>
            <Switch defaultChecked />
          </Field.Root>
          <ToggleGroup size="sm" defaultValue={['list']} aria-label="Izkārtojums">
            <Toggle value="list">Saraksta skats</Toggle>
            <Toggle value="masonry">Mūra izkārtojums</Toggle>
          </ToggleGroup>
        </Popover.Popup>
      </Popover.Root>
    </div>
  );
}
