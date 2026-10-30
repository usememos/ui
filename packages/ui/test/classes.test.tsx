// @vitest-environment happy-dom
// The class functions and public classes apps build their own parts with
// (docs/custom-components.md): each component uses its own function, and
// everything the docs promise exists in the stylesheets.
import { act } from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import customDocs from '../../../docs/custom-components.md?raw';
import foundationCss from '../src/styles/foundation.css?raw';
import {
  Badge,
  badgeClasses,
  Button,
  buttonClasses,
  Input,
  inputClasses,
  Menu,
  menuClasses,
  Popover,
  popoverClasses,
  Textarea,
  textareaClasses,
} from '../src';
import { render } from './render';

const componentCss = import.meta.glob<string>('../src/components/*/*.css', { query: '?raw', import: 'default', eager: true });
const allCss = [foundationCss, ...Object.values(componentCss)].join('\n').replace(/\/\*[\s\S]*?\*\//g, '');

/** Classes of an element, as a sorted list. */
const classesOf = (element: Element | null) => [...(element?.classList ?? [])].sort();
const split = (classes: string) => classes.split(' ').filter(Boolean).sort();

/** Rows of the Markdown table under `heading`, by their backticked first cell. */
function firstCells(heading: string) {
  const start = customDocs.indexOf(`## ${heading}`);
  const section = customDocs.slice(start, customDocs.indexOf('\n## ', start + 1));
  return [...section.matchAll(/^\| `([^`]+)` \|/gm)].map(([, name = '']) => name);
}

afterEach(() => {
  document.body.innerHTML = '';
});

const settle = () => act(() => new Promise((resolve) => setTimeout(resolve, 20)));

describe('class functions', () => {
  it('give single components exactly their own classes', () => {
    const { container } = render(
      <>
        <Button variant="ghost" size="sm" icon={<svg />} aria-label="More" />
        <Badge tone="success">Synced</Badge>
        <Input size="sm" aria-label="Tag" />
        <Textarea size="sm" aria-label="Note" />
      </>,
    );
    expect(classesOf(container.querySelector('button'))).toEqual(split(buttonClasses({ variant: 'ghost', size: 'sm', iconOnly: true })));
    expect(classesOf(container.querySelector('.mu-badge'))).toEqual(split(badgeClasses({ tone: 'success' })));
    expect(classesOf(container.querySelector('.mu-input-root'))).toEqual(split(inputClasses({ size: 'sm' })));
    expect(classesOf(container.querySelector('textarea'))).toEqual(split(textareaClasses({ size: 'sm' })));
  });

  it('give each Menu part its own classes', async () => {
    render(
      <Menu.Root size="sm" defaultOpen>
        <Menu.Trigger>Open</Menu.Trigger>
        <Menu.Popup>
          <Menu.Group>
            <Menu.GroupLabel>Note</Menu.GroupLabel>
            <Menu.Item shortcut="P">Pin</Menu.Item>
          </Menu.Group>
          <Menu.Separator />
          <Menu.Item danger>Delete</Menu.Item>
        </Menu.Popup>
      </Menu.Root>,
    );
    await settle();
    const menu = menuClasses({ size: 'sm' });
    const items = document.querySelectorAll('[role="menuitem"]');
    expect(classesOf(document.querySelector('[role="menu"]'))).toEqual(split(menu.popup));
    expect(classesOf(items[0]!)).toEqual(split(menu.item));
    expect(classesOf(items[1]!)).toEqual(split(menu.dangerItem));
    expect(classesOf(items[0]!.querySelector('.mu-menu-label'))).toEqual(split(menu.label));
    expect(classesOf(items[0]!.querySelector('.mu-menu-shortcut'))).toEqual(split(menu.shortcut));
    expect(classesOf(document.querySelector('[role="separator"]'))).toEqual(split(menu.separator));
    expect(classesOf(document.querySelector('.mu-menu-group-label'))).toEqual(split(menu.groupLabel));
  });

  it('give each Popover part its own classes', async () => {
    render(
      <Popover.Root defaultOpen>
        <Popover.Trigger>Share</Popover.Trigger>
        <Popover.Popup>
          <Popover.Title>Share</Popover.Title>
          <Popover.Description>Anyone with the link can view.</Popover.Description>
        </Popover.Popup>
      </Popover.Root>,
    );
    await settle();
    const popover = popoverClasses();
    expect(classesOf(document.querySelector('.mu-popover-popup'))).toEqual(split(popover.popup));
    expect(classesOf(document.querySelector('h2'))).toEqual(split(popover.title));
    expect(classesOf(document.querySelector('p'))).toEqual(split(popover.description));
  });

  it('return only classes the stylesheets define', () => {
    const returned = [
      buttonClasses({ variant: 'primary', iconOnly: true }),
      inputClasses(),
      textareaClasses(),
      badgeClasses({ tone: 'outline' }),
      ...Object.values(menuClasses()),
      ...Object.values(popoverClasses()),
    ].flatMap(split);
    // mu-button-icon and the variant classes are selectors in compound rules, so look for each class anywhere in a selector.
    expect([...new Set(returned)].filter((name) => !new RegExp(`\\.${name}(?![\\w-])`).test(allCss))).toEqual([]);
  });

  it('are each listed in docs/custom-components.md', () => {
    const listed = firstCells('Class functions').map((cell) => cell.split('(')[0]);
    expect(listed).toEqual(['buttonClasses', 'inputClasses', 'textareaClasses', 'badgeClasses', 'menuClasses', 'popoverClasses']);
  });
});

describe('public classes and row variables', () => {
  it('define every public class in docs/custom-components.md', () => {
    const classes = firstCells('Public classes');
    expect(classes.length).toBeGreaterThan(20);
    expect(classes.filter((name) => !new RegExp(`\\.${name}(?![\\w-])`).test(allCss))).toEqual([]);
  });

  it('set every row variable in docs/custom-components.md, with its value, in each size row', () => {
    const start = customDocs.indexOf('## Row variables');
    const rows = [...customDocs.slice(start).matchAll(/^\| `(--mu-row-[\w-]+)` \| ([^|]+) \| ([^|]+) \| ([^|]+) \|$/gm)];
    expect(rows).toHaveLength(10);
    const tokens = { 'var(--mu-control-xs)': '20px', 'var(--mu-control-sm)': '24px', 'var(--mu-control-md)': '32px', 'var(--mu-space-1)': '4px', 'var(--mu-space-2)': '8px', 'var(--mu-space-3)': '12px', 'var(--mu-radius-sm)': '4px', 'var(--mu-radius-md)': '6px', 'var(--mu-icon-xs)': '12px', 'var(--mu-icon-sm)': '14px', 'var(--mu-icon-md)': '16px' } as Record<string, string>;
    for (const [index, size] of ['xs', 'sm', 'md'].entries()) {
      const body = foundationCss.match(new RegExp(`\\.mu-s-${size} \\{([^}]*)\\}`))?.[1] ?? '';
      const set = new Map([...body.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(([, name = '', value = '']) => [name, tokens[value.trim()] ?? value.trim()]));
      expect(set.size, size).toBe(rows.length);
      for (const row of rows) expect(set.get(row[1]!), `${row[1]} at ${size}`).toBe(row[index + 2]!.trim());
    }
  });
});
