import { Avatar, Button, Field, Input, Menu, menuClasses, Popover, Select, Switch, ToggleGroup, Toggle } from '@usememos/ui';
import { ChevronRight, Copy, LogOut, Palette, Settings, Share, SlidersHorizontal, User } from 'lucide-react';
import type { SectionProps } from '.';
import { useState } from 'react';
import { CompactReactions } from '../reactions';
import '../reactions.css';

const menu = menuClasses();

export function PopoverSection({ size }: SectionProps) {
  const [reactions, setReactions] = useState([
    { emoji: '👍', label: 'Thumbs up', count: 3, pressed: false },
    { emoji: '❤️', label: 'Heart', count: 2, pressed: true },
  ]);
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
          {/* A row that opens its own Menu beside the panel; the choices line up with the row like a submenu's. */}
          <Menu.Root>
            <Menu.Trigger openOnHover render={<button type="button" className={menu.item} />}>
              <Palette aria-hidden />
              <span className={menu.label}>Theme</span>
              <span className={menu.shortcut}>System</span>
              <ChevronRight aria-hidden />
            </Menu.Trigger>
            <Menu.Popup side="inline-end" align="start">
              <Menu.RadioGroup defaultValue="system">
                <Menu.RadioItem value="system" closeOnClick>System</Menu.RadioItem>
                <Menu.RadioItem value="light" closeOnClick>Light</Menu.RadioItem>
                <Menu.RadioItem value="dark" closeOnClick>Dark</Menu.RadioItem>
              </Menu.RadioGroup>
            </Menu.Popup>
          </Menu.Root>
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
      <CompactReactions reactions={reactions} onPressedChange={(emoji, pressed) => {
        setReactions((current) => {
          const existing = current.find((reaction) => reaction.emoji === emoji);
          return existing
            ? current.map((reaction) => reaction.emoji === emoji ? { ...reaction, pressed, count: reaction.count + (pressed ? 1 : -1) } : reaction)
            : [...current, { emoji, label: emoji, count: 1, pressed }];
        });
      }} />
    </div>
  );
}
