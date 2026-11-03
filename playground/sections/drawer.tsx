import { Button, Drawer, Field, menuClasses, Switch } from '@usememos/ui';
import { Archive, Inbox, Menu as MenuIcon, PanelRight, Settings } from 'lucide-react';
import type { RowSize, SectionProps } from '.';

const menu = menuClasses();

export function DrawerSection({ size }: SectionProps<RowSize>) {
  return (
    <div className="pg-row">
      <Drawer.Root side="start">
        <Drawer.Trigger render={<Button size={size} icon={<MenuIcon />}>Open navigation</Button>} />
        <Drawer.Popup variant="bare" className="pg-drawer-nav">
          <Drawer.Title className="mu-visually-hidden">Navigation</Drawer.Title>
          <nav className="pg-drawer-links">
            {[
              { label: 'Inbox', icon: <Inbox /> },
              { label: 'Archive', icon: <Archive /> },
              { label: 'Settings', icon: <Settings /> },
            ].map((link) => (
              <Drawer.Close key={link.label} className={menu.item} render={<a href="#drawer" />}>
                {link.icon}
                <span className={menu.label}>{link.label}</span>
              </Drawer.Close>
            ))}
          </nav>
        </Drawer.Popup>
      </Drawer.Root>
      <Drawer.Root>
        <Drawer.Trigger render={<Button size={size} icon={<PanelRight />}>Note details</Button>} />
        <Drawer.Popup>
          <Drawer.Title>Note details</Drawer.Title>
          <Drawer.Description>Created 2 November 2026.</Drawer.Description>
          <Field.Root orientation="horizontal">
            <Field.Label>Pinned</Field.Label>
            <Switch />
          </Field.Root>
        </Drawer.Popup>
      </Drawer.Root>
      <Drawer.Root side="bottom">
        <Drawer.Trigger render={<Button size={size}>Open sheet</Button>} />
        <Drawer.Popup>
          <Drawer.Title>Share</Drawer.Title>
          <Drawer.Description>Anyone with the link can read it.</Drawer.Description>
          <Drawer.Close render={<Button variant="primary">Copy link</Button>} />
        </Drawer.Popup>
      </Drawer.Root>
    </div>
  );
}
