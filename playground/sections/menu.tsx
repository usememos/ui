import { MenuRowParts } from '../fixtures/option-rows';
import { Button, Menu } from '@usememos/ui';
import { Archive, Copy, Ellipsis, FolderInput, Globe, Lock, Pencil, Pin, Trash2, Users } from 'lucide-react';
import type { RowSize, SectionProps } from '.';

export function MenuSection({ size }: SectionProps<RowSize>) {
  return (
    <div className="pg-row">
      <Menu.Root size={size}>
        <Menu.Trigger render={<Button variant="ghost" size={size} icon={<Ellipsis />} aria-label="More actions" />} />
        <Menu.Popup>
          <Menu.Item icon={<Pin />} shortcut="P">
            Pin
          </Menu.Item>
          <Menu.Item icon={<Pencil />} shortcut="E">
            Edit
          </Menu.Item>
          <Menu.Item icon={<Copy />}>Copy link</Menu.Item>
          <Menu.SubmenuRoot>
            <Menu.SubmenuTrigger icon={<FolderInput />}>Move to</Menu.SubmenuTrigger>
            <Menu.Popup>
              <Menu.Item>Inbox</Menu.Item>
              <Menu.Item>Reading</Menu.Item>
              <Menu.Item disabled>Journal</Menu.Item>
            </Menu.Popup>
          </Menu.SubmenuRoot>
          <Menu.Item icon={<Archive />} disabled>
            Archive
          </Menu.Item>
          <Menu.Separator />
          <Menu.Item icon={<Trash2 />} danger>
            Delete
          </Menu.Item>
        </Menu.Popup>
      </Menu.Root>
      <Menu.Root size={size}>
        <Menu.Trigger render={<Button size={size}>View</Button>} />
        <Menu.Popup>
          <Menu.CheckboxItem defaultChecked>Show completed tasks</Menu.CheckboxItem>
          <Menu.CheckboxItem>Show archived</Menu.CheckboxItem>
          <Menu.Separator />
          <Menu.Group>
            <Menu.RadioGroup defaultValue="updated">
              <Menu.GroupLabel>Sort by</Menu.GroupLabel>
              <Menu.RadioItem value="created">Created</Menu.RadioItem>
              <Menu.RadioItem value="updated">Updated</Menu.RadioItem>
            </Menu.RadioGroup>
          </Menu.Group>
        </Menu.Popup>
      </Menu.Root>
      <Menu.Root size={size}>
        <Menu.Trigger render={<Button size={size}>Visibility</Button>} />
        <Menu.Popup>
          <Menu.RadioGroup defaultValue="private">
            <Menu.RadioItem value="private" icon={<Lock />} description="Only you can see it" closeOnClick>
              Private
            </Menu.RadioItem>
            <Menu.RadioItem value="workspace" icon={<Users />} description="Members of this workspace" closeOnClick>
              Workspace
            </Menu.RadioItem>
            <Menu.RadioItem value="public" icon={<Globe />} description="Anyone with the link" closeOnClick>
              Public
            </Menu.RadioItem>
          </Menu.RadioGroup>
        </Menu.Popup>
      </Menu.Root>
      <MenuRowParts size={size} />
    </div>
  );
}
