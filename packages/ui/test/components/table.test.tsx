// @vitest-environment happy-dom
import { Pencil, Trash2 } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { Button, Table } from '../../src';
import { render } from '../render';
describe('Table', () => {
  it('sizes the table, scopes column heads, and marks number and muted cells', () => {
    const { container } = render(
      <Table.Root size="sm">
        <Table.Caption>Tokens</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
            <Table.Head num>Uses</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell muted>Raycast</Table.Cell>
            <Table.Cell num>87</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );
    const table = container.querySelector('table')!;
    expect(table.parentElement!.className).toBe('mu-table-scroll');
    expect(table.className).toContain('mu-s-sm');
    expect(table.className).toContain('mu-caption');
    const [name, uses] = [...table.querySelectorAll('th')];
    expect(name!.getAttribute('scope')).toBe('col');
    expect(uses!.className).toContain('mu-table-num');
    const [muted, num] = [...table.querySelectorAll('td')];
    expect(muted!.className).toContain('mu-table-muted');
    expect(num!.className).toContain('mu-table-num');
    expect(table.querySelector('caption')!.className).toContain('mu-caption');
  });
});

describe('Table bordered', () => {
  it('boxes the scrolling wrapper only when set', () => {
    const { container } = render(
      <>
        <Table.Root bordered aria-label="Members">
          <Table.Body><Table.Row><Table.Cell>Ada</Table.Cell></Table.Row></Table.Body>
        </Table.Root>
        <Table.Root aria-label="Plain">
          <Table.Body><Table.Row><Table.Cell>Bo</Table.Cell></Table.Row></Table.Body>
        </Table.Root>
      </>,
    );
    const [bordered, plain] = [...container.querySelectorAll('.mu-table-scroll')];
    expect(bordered!.className).toContain('mu-table-bordered');
    expect(plain!.className).not.toContain('mu-table-bordered');
    expect(bordered!.querySelector('table')!.getAttribute('aria-label')).toBe('Members');
    expect(bordered!.querySelector('table')!.hasAttribute('bordered')).toBe(false);
  });
});

describe('Table.Actions', () => {
  it('groups the buttons of a cell in a div', () => {
    const { container } = render(
      <Table.Root size="sm" aria-label="Webhooks">
        <Table.Body>
          <Table.Row>
            <Table.Cell num>
              <Table.Actions className="app">
                <Button variant="ghost" icon={<Pencil />} aria-label="Edit" />
                <Button variant="ghost" icon={<Trash2 />} aria-label="Delete" />
              </Table.Actions>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>,
    );
    const actions = container.querySelector('td > div')!;
    expect(actions.className).toBe('mu-table-actions app');
    expect(actions.querySelectorAll('button')).toHaveLength(2);
    // The table's size reaches the buttons.
    expect(actions.querySelector('button')!.className).toContain('mu-s-sm');
  });
});
