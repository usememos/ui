import { Button, Menu, Table } from '@usememos/ui';
import { Ellipsis } from 'lucide-react';
import type { RowSize, SectionProps } from '.';

const tokens = [
  { id: 1, name: 'Backup script', created: '12 May 2026', uses: 1204 },
  { id: 2, name: 'Raycast', created: '3 Jun 2026', uses: 87 },
  { id: 3, name: 'Shortcuts on iPhone', created: '28 Oct 2026', uses: 3 },
];

const members = [
  { name: 'steven', role: 'Admin', memos: 120 },
  { name: 'lily', role: 'Member', memos: 48 },
];

export function TableSection({ size }: SectionProps<RowSize>) {
  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 560 }}>
      <Table.Root size={size}>
        <Table.Caption>Access tokens</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
            <Table.Head>Created</Table.Head>
            <Table.Head num>Uses</Table.Head>
            <Table.Head>
              <span className="mu-visually-hidden">Actions</span>
            </Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tokens.map((token) => (
            <Table.Row key={token.id}>
              <Table.Cell>{token.name}</Table.Cell>
              <Table.Cell muted>{token.created}</Table.Cell>
              <Table.Cell num>{token.uses.toLocaleString('en')}</Table.Cell>
              <Table.Cell num>
                <Menu.Root size={size}>
                  <Menu.Trigger render={<Button variant="ghost" size={size} icon={<Ellipsis />} aria-label={`Actions for ${token.name}`} />} />
                  <Menu.Popup align="end">
                    <Menu.Item>Rename</Menu.Item>
                    <Menu.Item danger>Revoke</Menu.Item>
                  </Menu.Popup>
                </Menu.Root>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
      <Table.Root size={size} bordered aria-label="Members">
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
            <Table.Head>Role</Table.Head>
            <Table.Head num>Memos</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {members.map((member) => (
            <Table.Row key={member.name}>
              <Table.Cell>{member.name}</Table.Cell>
              <Table.Cell muted>{member.role}</Table.Cell>
              <Table.Cell num>{member.memos}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
