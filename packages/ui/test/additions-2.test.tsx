// @vitest-environment happy-dom
// The second batch of parts and options from memos' migration: Table.Actions,
// ToggleGroup fullWidth, full-screen Dialog, the bare Drawer's Close and
// List.ItemButton.
import { act } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { afterEach, describe, expect, it } from 'vitest';
import { Badge, badgeClasses, Button, Dialog, Drawer, Field, Form, Input, List, Table, Toggle, ToggleGroup } from '../src';
import { render } from './render';

afterEach(() => {
  document.body.innerHTML = '';
});

const settle = () => act(() => new Promise((resolve) => setTimeout(resolve, 20)));

describe('Badge primary', () => {
  it('uses the primary tone class', () => {
    const { container } = render(<Badge tone="primary">New</Badge>);
    expect(container.querySelector('span')!.className).toBe(badgeClasses({ tone: 'primary' }));
    expect(badgeClasses({ tone: 'primary' })).toContain('mu-badge-primary');
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

describe('ToggleGroup fullWidth', () => {
  it('adds the full-width class only when set', () => {
    const { container } = render(
      <>
        <ToggleGroup fullWidth aria-label="View" defaultValue={['list']}>
          <Toggle value="list">List</Toggle>
          <Toggle value="grid">Masonry</Toggle>
        </ToggleGroup>
        <ToggleGroup aria-label="Show">
          <Toggle value="all">All</Toggle>
        </ToggleGroup>
      </>,
    );
    const [full, plain] = [...container.querySelectorAll('[role="group"]')] as [Element, Element];
    expect(full.className).toContain('mu-toggle-group-full');
    expect(full.className).toContain('mu-segmented');
    expect(plain.className).not.toContain('mu-toggle-group-full');
  });
});

describe('Dialog fullScreen', () => {
  it('fills the viewport instead of becoming a sheet', async () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Popup variant="bare" fullScreen aria-label="Image" />
      </Dialog.Root>,
    );
    await settle();
    const viewport = document.querySelector('[role="dialog"]')!.parentElement!;
    expect(viewport.className).toContain('mu-dialog-full');
    expect(viewport.className).not.toContain('mu-dialog-sheet');
  });

  it('is a sheet by default', async () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Popup aria-label="Create" />
      </Dialog.Root>,
    );
    await settle();
    const viewport = document.querySelector('[role="dialog"]')!.parentElement!;
    expect(viewport.className).toContain('mu-dialog-sheet');
    expect(viewport.className).not.toContain('mu-dialog-full');
  });
});

describe('Drawer bare', () => {
  it('has a Close for screen readers, out of the tab order, that closes it', async () => {
    render(
      <Drawer.Root side="start" defaultOpen>
        <Drawer.Popup variant="bare" aria-label="Navigation" closeLabel="Close navigation">
          <nav />
        </Drawer.Popup>
      </Drawer.Root>,
    );
    await settle();
    const close = document.querySelector<HTMLButtonElement>('.mu-drawer-sr-close')!;
    expect(close.textContent).toBe('Close navigation');
    expect(close.className).toContain('mu-visually-hidden');
    expect(close.tabIndex).toBe(-1);
    expect(document.querySelector('.mu-drawer-x')).toBeNull();
    // It follows the content, so screen readers reach the content first.
    expect(close.previousElementSibling!.className).toContain('mu-drawer-content');
    await act(async () => close.click());
    await settle();
    expect(document.querySelector('.mu-drawer-popup')?.hasAttribute('data-open') ?? false).toBe(false);
  });

  it('has no screen-reader Close in the panel variant', async () => {
    render(
      <Drawer.Root defaultOpen>
        <Drawer.Popup aria-label="Details" />
      </Drawer.Root>,
    );
    await settle();
    expect(document.querySelector('.mu-drawer-sr-close')).toBeNull();
    expect(document.querySelector('.mu-drawer-x')).not.toBeNull();
  });
});

describe('List.ItemButton', () => {
  it('is a type="button" button by default', () => {
    let clicked = 0;
    const { container } = render(
      <List.Root aria-label="Spaces">
        <List.Item>
          <List.ItemButton onClick={() => clicked++}>Personal</List.ItemButton>
        </List.Item>
      </List.Root>,
    );
    const button = container.querySelector('li > button')!;
    expect(button.getAttribute('type')).toBe('button');
    expect(button.className).toBe('mu-list-item-button mu-focus');
    (button as HTMLButtonElement).click();
    expect(clicked).toBe(1);
  });

  it('renders a link through render, without a type', () => {
    const { container } = render(
      <List.Root aria-label="Spaces">
        <List.Item>
          <List.ItemButton render={<a href="/s/1" />} className="app">
            Personal
          </List.ItemButton>
        </List.Item>
      </List.Root>,
    );
    const link = container.querySelector('li > a')!;
    expect(link.getAttribute('href')).toBe('/s/1');
    expect(link.hasAttribute('type')).toBe(false);
    expect(link.className).toBe('mu-list-item-button mu-focus app');
  });
});

describe('Form', () => {
  it('is a form named by its Title, boxed only when bordered, and md inside a sized parent', () => {
    const { container } = render(
      <Table.Root size="sm" aria-label="Rules">
        <caption>
          <Form.Root bordered>
            <Form.Title>Add a tag rule</Form.Title>
            <Form.Description>Tag new notes.</Form.Description>
            <Field.Root name="tag">
              <Field.Label>Tag</Field.Label>
              <Input />
            </Field.Root>
            <Form.Footer>
              <Button type="submit">Add rule</Button>
            </Form.Footer>
          </Form.Root>
        </caption>
      </Table.Root>,
    );
    const form = container.querySelector('form')!;
    const title = form.querySelector('h2')!;
    expect(form.className).toContain('mu-form-bordered');
    expect(form.getAttribute('aria-labelledby')).toBe(title.id);
    expect(title.className).toBe('mu-form-title mu-label');
    expect(form.querySelector('.mu-form-footer > button')!.className).toContain('mu-s-md');
  });

  it('takes aria-label instead of a title, and render for another heading level', () => {
    const { container } = render(
      <>
        <Form.Root aria-label="Search" />
        <Form.Root>
          <Form.Title render={<h3 />}>Profile</Form.Title>
        </Form.Root>
      </>,
    );
    const [search, profile] = [...container.querySelectorAll('form')] as [HTMLFormElement, HTMLFormElement];
    expect(search.className).not.toContain('mu-form-bordered');
    expect(search.hasAttribute('aria-labelledby')).toBe(false);
    expect(search.getAttribute('aria-label')).toBe('Search');
    expect(profile.getAttribute('aria-labelledby')).toBe(profile.querySelector('h3')!.id);
  });
});
