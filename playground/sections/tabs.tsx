import { Tabs } from '@usememos/ui';
import { Bell, Settings, User } from 'lucide-react';
import type { RowSize, SectionProps } from '.';

export function TabsSection({ size }: SectionProps<RowSize>) {
  return (
    <Tabs.Root size={size} defaultValue="account">
      <Tabs.List aria-label="Settings sections">
        <Tabs.Tab value="account" icon={<User aria-hidden />}>
          Account
        </Tabs.Tab>
        <Tabs.Tab value="notifications" icon={<Bell aria-hidden />}>
          Notifications
        </Tabs.Tab>
        <Tabs.Tab value="system" icon={<Settings aria-hidden />}>
          System
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="account" className="mu-body">
        Your name, email and password.
      </Tabs.Panel>
      <Tabs.Panel value="notifications" className="mu-body">
        What we tell you about, and how.
      </Tabs.Panel>
      <Tabs.Panel value="system" className="mu-body">
        Storage, backups and the instance.
      </Tabs.Panel>
    </Tabs.Root>
  );
}
