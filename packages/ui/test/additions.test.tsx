// @vitest-environment happy-dom
// Parts and options added for memos' migration: Button iconEnd, two-line menu
// rows, Popover list, ghost Select trigger, bare Dialog, Drawer, horizontal
// Field, the inline grid Combobox, List and the bordered Table.
import { DirectionProvider } from '@base-ui/react/direction-provider';
import { act } from 'react';
import { ChevronDown, Heart, Lock, Star } from 'lucide-react';
import { afterEach, describe, expect, it } from 'vitest';
import { Button, buttonClasses, Combobox, Dialog, Drawer, Field, List, Menu, Popover, popoverClasses, Select, Switch, Table } from '../src';
import { render } from './render';

afterEach(() => {
  document.body.innerHTML = '';
});

const settle = () => act(() => new Promise((resolve) => setTimeout(resolve, 20)));
const split = (classes: string) => classes.split(' ').filter(Boolean).sort();

describe('Button iconEnd', () => {
  it('puts the end icon after the label', () => {
    const { container } = render(<Button iconEnd={<ChevronDown />}>Show more</Button>);
    const button = container.querySelector('button')!;
    expect([...button.children].map((child) => child.tagName.toLowerCase())).toEqual(['span', 'svg']);
    expect(button.querySelector('.mu-button-label')!.textContent).toBe('Show more');
    expect(button.className).not.toContain('mu-button-icon');
  });

  it('is square with only an end icon', () => {
    const { container } = render(<Button iconEnd={<ChevronDown />} aria-label="Expand" />);
    const button = container.querySelector('button')!;
    expect(button.className).toContain('mu-button-icon');
    expect(button.querySelector('.mu-button-label')).toBeNull();
    expect(button.querySelectorAll('svg')).toHaveLength(1);
  });
});

describe('Menu description', () => {
  it('stacks the label over the description, and names and describes the item by them', async () => {
    render(
      <Menu.Root defaultOpen>
        <Menu.Trigger>Visibility</Menu.Trigger>
        <Menu.Popup>
          <Menu.RadioGroup defaultValue="private">
            <Menu.RadioItem value="private" icon={<Lock />} description="Only you can see it">
              Private
            </Menu.RadioItem>
          </Menu.RadioGroup>
          <Menu.Item>Plain</Menu.Item>
        </Menu.Popup>
      </Menu.Root>,
    );
    await settle();
    const [item, plain] = [...document.querySelectorAll('[role="menuitemradio"], [role="menuitem"]')];
    const text = item!.querySelector('.mu-menu-text')!;
    expect([...text.children].map((child) => child.className)).toEqual(['mu-menu-label', 'mu-menu-description mu-caption']);
    expect(document.getElementById(item!.getAttribute('aria-labelledby')!)!.textContent).toBe('Private');
    expect(document.getElementById(item!.getAttribute('aria-describedby')!)!.textContent).toBe('Only you can see it');
    expect(plain!.hasAttribute('aria-labelledby')).toBe(false);
    expect(plain!.querySelector('.mu-menu-text')).toBeNull();
  });
});

describe('Popover list', () => {
  it('uses the list classes', async () => {
    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>Account</Popover.Trigger>
        <Popover.Popup variant="list" aria-label="Account" />
      </Popover.Root>,
    );
    await settle();
    expect(split(document.querySelector('.mu-popover-popup')!.className)).toEqual(split(popoverClasses({ variant: 'list' }).popup));
    expect(popoverClasses().popup).not.toContain('mu-popover-list');
  });
});

describe('Select ghost trigger', () => {
  it('is a ghost button', () => {
    const { container } = render(
      <Select.Root size="sm" items={{ a: 'Personal' }} defaultValue="a">
        <Select.Trigger variant="ghost" aria-label="Space">
          <Select.Value />
        </Select.Trigger>
      </Select.Root>,
    );
    const trigger = container.querySelector('.mu-select-trigger')!;
    expect(split(trigger.className)).toEqual(split(`mu-select-trigger ${buttonClasses({ variant: 'ghost', size: 'sm' })}`));
  });
});

describe('Dialog bare', () => {
  it('has no X', async () => {
    render(
      <Dialog.Root defaultOpen>
        <Dialog.Popup variant="bare" aria-label="Quick find">
          <input aria-label="Find" />
        </Dialog.Popup>
      </Dialog.Root>,
    );
    await settle();
    const popup = document.querySelector('[role="dialog"]')!;
    expect(popup.className).toContain('mu-dialog-bare');
    expect(popup.querySelector('.mu-dialog-x')).toBeNull();
  });
});

describe('Drawer', () => {
  it('slides from the end edge by default, with an X', async () => {
    render(
      <Drawer.Root defaultOpen>
        <Drawer.Popup closeLabel="Close details">
          <Drawer.Title>Details</Drawer.Title>
        </Drawer.Popup>
      </Drawer.Root>,
    );
    await settle();
    const popup = document.querySelector('.mu-drawer-popup')!;
    expect(popup.getAttribute('role')).toBe('dialog');
    expect(popup.parentElement!.className).toContain('mu-drawer-right');
    expect(popup.getAttribute('data-swipe-direction')).toBe('right');
    expect(popup.querySelector('.mu-drawer-x')!.getAttribute('aria-label')).toBe('Close details');
    expect(popup.querySelector('.mu-drawer-content > h2')!.className).toContain('mu-drawer-title');
    expect(document.querySelector('.mu-drawer-backdrop')).not.toBeNull();
  });

  it('puts start on the right in a right-to-left page, and bare has no X', async () => {
    render(
      <DirectionProvider direction="rtl">
        <Drawer.Root side="start" defaultOpen>
          <Drawer.Popup variant="bare" aria-label="Navigation" />
        </Drawer.Root>
      </DirectionProvider>,
    );
    await settle();
    const popup = document.querySelector('.mu-drawer-popup')!;
    expect(popup.parentElement!.className).toContain('mu-drawer-right');
    expect(popup.getAttribute('data-swipe-direction')).toBe('right');
    expect(popup.className).toContain('mu-drawer-bare');
    expect(popup.querySelector('.mu-drawer-x')).toBeNull();
  });

  it('slides from the bottom with side="bottom"', async () => {
    render(
      <Drawer.Root side="bottom" defaultOpen>
        <Drawer.Popup aria-label="Share" />
      </Drawer.Root>,
    );
    await settle();
    const popup = document.querySelector('.mu-drawer-popup')!;
    expect(popup.parentElement!.className).toContain('mu-drawer-bottom');
    expect(popup.getAttribute('data-swipe-direction')).toBe('down');
  });
});

describe('Field horizontal', () => {
  it('marks the orientation and labels a Switch placed after the label', () => {
    const { container } = render(
      <Field.Root orientation="horizontal">
        <Field.Label>Compact mode</Field.Label>
        <Field.Description>Show more notes.</Field.Description>
        <Switch />
      </Field.Root>,
    );
    const root = container.querySelector('.mu-field-root')!;
    expect(root.className).toContain('mu-field-horizontal');
    expect(root.getAttribute('data-orientation')).toBe('horizontal');
    const control = container.querySelector('[role="switch"]')!;
    const label = container.querySelector('label')!;
    const named = control.getAttribute('aria-labelledby') === label.id || label.htmlFor === control.id;
    expect(named).toBe(true);
    expect(control.getAttribute('aria-describedby')).toBe(container.querySelector('.mu-field-description')!.id);
  });

  it('stays vertical by default', () => {
    const { container } = render(
      <Field.Root>
        <Field.Label>Name</Field.Label>
      </Field.Root>,
    );
    expect(container.querySelector('.mu-field-root')!.className).not.toContain('mu-field-horizontal');
  });
});

describe('Combobox inline grid', () => {
  const icons = [
    { value: 'heart', label: 'Heart', icon: <Heart /> },
    { value: 'star', label: 'Star', icon: <Star /> },
  ];

  it('drops the chevron and lays the items out in rows', async () => {
    const { container } = render(
      <Combobox.Root items={icons} inline grid defaultValue={icons[0]} itemToStringLabel={(item) => item.label}>
        <Combobox.Input aria-label="Find an icon" />
        <Combobox.List aria-label="Icons">
          <Combobox.Row>
            {icons.map((item) => (
              <Combobox.Item key={item.value} value={item} aria-label={item.label}>
                {item.icon}
              </Combobox.Item>
            ))}
          </Combobox.Row>
        </Combobox.List>
      </Combobox.Root>,
    );
    await settle();
    expect(container.querySelector('.mu-combobox-trigger')).toBeNull();
    expect(container.querySelector('.mu-input-root')!.className).not.toContain('mu-combobox-input-root');
    const row = container.querySelector('.mu-combobox-row')!;
    expect(row.querySelectorAll('.mu-combobox-item')).toHaveLength(2);
    expect(row.querySelector('[aria-label="Heart"]')!.hasAttribute('data-selected')).toBe(true);
  });
});

describe('List', () => {
  it('renders a sized ul of li rows and passes its size to controls inside', () => {
    const { container } = render(
      <List.Root size="sm" aria-label="Webhooks">
        <List.Item>
          <Button>Edit</Button>
        </List.Item>
        <List.Item className="app-row">Second</List.Item>
      </List.Root>,
    );
    const list = container.querySelector('ul')!;
    expect(list.className).toContain('mu-list');
    expect(list.className).toContain('mu-s-sm');
    expect(list.getAttribute('aria-label')).toBe('Webhooks');
    const items = list.querySelectorAll(':scope > li.mu-list-item');
    expect(items).toHaveLength(2);
    expect(items[1]!.className).toContain('app-row');
    expect(list.querySelector('button')!.className).toContain('mu-s-sm');
  });

  it('takes the size around it, and md by default', () => {
    const { container } = render(<List.Root><List.Item>One</List.Item></List.Root>);
    expect(container.querySelector('ul')!.className).toContain('mu-s-md');
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
