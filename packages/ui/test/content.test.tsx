// @vitest-environment happy-dom
// Our wiring for the Phase 4 components: Combobox's input box and folded
// Popup, Collapsible's trigger, Table's size and cell options, and Prose.
import { act } from 'react';
import { Tag } from 'lucide-react';
import { afterEach, describe, expect, it } from 'vitest';
import { Collapsible, Combobox, Prose, Table } from '../src';
import { render } from './render';

afterEach(() => {
  document.body.innerHTML = '';
});

/** Lets Base UI's positioning and open effects settle. */
const settle = () => act(() => new Promise((resolve) => setTimeout(resolve, 20)));

const tags = ['book', 'design', 'travel'];

describe('Combobox', () => {
  it('puts the input in a sized box with a search icon and a labeled chevron', () => {
    const { container } = render(
      <Combobox.Root size="sm" items={tags}>
        <Combobox.Input aria-label="Tag" className="extra" triggerLabel="Show tags" />
      </Combobox.Root>,
    );
    const box = container.querySelector('.mu-combobox-input-root')!;
    expect(box.className).toContain('mu-input-root');
    expect(box.className).toContain('mu-s-sm');
    expect(box.className).toContain('extra');
    expect(box.querySelector('.mu-input-prefix svg')).not.toBeNull();
    expect(box.querySelector('input')!.getAttribute('role')).toBe('combobox');
    expect(box.querySelector('input')!.className).toBe('mu-input');
    expect(box.querySelector('.mu-combobox-trigger')!.getAttribute('aria-label')).toBe('Show tags');
  });

  it('drops the icon with icon={null} and takes another icon', () => {
    const { container, rerender } = render(
      <Combobox.Root items={tags}>
        <Combobox.Input aria-label="Tag" icon={null} />
      </Combobox.Root>,
    );
    expect(container.querySelector('.mu-input-prefix')).toBeNull();
    rerender(
      <Combobox.Root items={tags}>
        <Combobox.Input aria-label="Tag" icon={<Tag />} />
      </Combobox.Root>,
    );
    expect(container.querySelector('.mu-input-prefix .lucide-tag')).not.toBeNull();
  });

  it('portals the list, sizes its rows from the Root, and checks the chosen item', async () => {
    render(
      <Combobox.Root size="lg" items={tags} defaultValue="design" defaultOpen>
        <Combobox.Input aria-label="Tag" />
        <Combobox.Popup side="top">
          <Combobox.Empty>No tags found</Combobox.Empty>
          <Combobox.List>
            {(tag: string) => (
              <Combobox.Item key={tag} value={tag}>
                {tag}
              </Combobox.Item>
            )}
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Root>,
    );
    await settle();
    const popup = document.querySelector('.mu-combobox-popup')!;
    expect(popup.className).toContain('mu-s-lg');
    expect(popup.parentElement!.className).toContain('mu-positioner');
    expect(popup.parentElement!.getAttribute('data-side')).toBe('top');
    const items = [...popup.querySelectorAll('.mu-combobox-item')];
    expect(items.map((item) => item.textContent)).toEqual(tags);
    const chosen = items.find((item) => item.hasAttribute('data-selected'))!;
    expect(chosen.textContent).toBe('design');
    expect(chosen.querySelector('.mu-combobox-indicator svg')).not.toBeNull();
    expect(popup.querySelector('.mu-combobox-empty')!.textContent).toBe('');
  });
});

describe('Collapsible', () => {
  it('renders the trigger as a ghost key at the Root size, with a chevron after the label', () => {
    const { container } = render(
      <Collapsible.Root size="sm">
        <Collapsible.Trigger>Advanced settings</Collapsible.Trigger>
        <Collapsible.Panel>Webhooks</Collapsible.Panel>
      </Collapsible.Root>,
    );
    const trigger = container.querySelector('button')!;
    expect(trigger.className).toContain('mu-button-ghost');
    expect(trigger.className).toContain('mu-s-sm');
    expect(trigger.lastElementChild!.getAttribute('class')).toContain('mu-collapsible-chevron');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(container.querySelector('.mu-collapsible-panel')).toBeNull();
    act(() => trigger.click());
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(container.querySelector('.mu-collapsible-panel')!.textContent).toBe('Webhooks');
  });
});

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
    expect(table.className).toContain('mu-body-sm');
    const [name, uses] = [...table.querySelectorAll('th')];
    expect(name!.getAttribute('scope')).toBe('col');
    expect(uses!.className).toContain('mu-table-num');
    const [muted, num] = [...table.querySelectorAll('td')];
    expect(muted!.className).toContain('mu-table-muted');
    expect(num!.className).toContain('mu-table-num');
    expect(table.querySelector('caption')!.className).toContain('mu-caption');
  });
});

describe('Prose', () => {
  it('is one class, plus mu-prose-sm at sm', () => {
    const { container, rerender } = render(<Prose dangerouslySetInnerHTML={{ __html: '<p>Hello</p>' }} />);
    expect(container.firstElementChild!.className).toBe('mu-prose');
    expect(container.querySelector('p')!.textContent).toBe('Hello');
    rerender(<Prose size="sm" className="extra" />);
    expect(container.firstElementChild!.className).toBe('mu-prose mu-prose-sm extra');
  });
});
