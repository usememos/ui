// @vitest-environment happy-dom
import { Heart, Star, Tag } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { Combobox } from '../../src';
import { render, settle } from '../render';
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
      <Combobox.Root size="sm" items={tags} defaultValue="design" defaultOpen>
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
    expect(popup.className).toContain('mu-s-sm');
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

it('container, render, refs and native popup attributes reach the requested portal', async () => {
  const host = document.createElement('div');
  document.body.append(host);
  const ref = { current: null as HTMLDivElement | null };
  render(<Combobox.Root defaultOpen items={["a"]} defaultValue="a"><Combobox.Input aria-label="Choice" style={{ maxWidth: 240 }} /><Combobox.Popup container={host} side="top" align="end" positionMethod="fixed" sticky={false} anchor={host} collisionBoundary={host} collisionAvoidance={{ side: "none", align: "none" }} disableAnchorTracking ref={ref} className="app-popup" data-contract="popup" render={<section />}><Combobox.List><Combobox.Item value="a" icon={<Tag />}>A</Combobox.Item></Combobox.List></Combobox.Popup></Combobox.Root>);
  await settle();
  const popup = host.querySelector<HTMLElement>('[data-contract="popup"]')!;
  expect(popup).not.toBeNull();
  expect(ref.current).toBe(popup);
  expect(popup.tagName).toBe('SECTION');
  expect((popup.parentElement as HTMLElement).style.position).toBe('fixed');
  expect(popup.parentElement!.getAttribute('data-side')).toBe('top');
  expect(popup.parentElement!.getAttribute('data-align')).toBe('end');
  expect(popup.hasAttribute('positionMethod')).toBe(false);
  expect(popup.classList.contains('app-popup')).toBe(true);
  expect(popup.querySelector(".lucide-tag")).not.toBeNull();

});

it('grouped items flow through Collection with named groups, separators and selected state', async () => {
  const groups = [{ value: 'first', label: 'First group', items: ['a', 'b'] }, { value: 'second', label: 'Second group', items: ['c'] }];
  render(<Combobox.Root items={groups} inline defaultValue="b"><Combobox.Input aria-label="Choice" /><Combobox.List>{(group: typeof groups[number]) => <Combobox.Group key={group.value} items={group.items}><Combobox.GroupLabel>{group.label}</Combobox.GroupLabel><Combobox.Collection>{(item: string) => <Combobox.Item key={item} value={item}>{item}</Combobox.Item>}</Combobox.Collection><Combobox.Separator /></Combobox.Group>}</Combobox.List></Combobox.Root>);
  await settle();
  expect([...document.querySelectorAll('.mu-combobox-item-text')].map(node => node.textContent)).toEqual(['a', 'b', 'c']);
  const group = document.querySelector('.mu-combobox-group')!;
  expect(document.getElementById(group.getAttribute('aria-labelledby')!)!.textContent).toBe('First group');
  expect(document.querySelector('[data-selected] .mu-combobox-item-text')!.textContent).toBe('b');
  expect(document.querySelectorAll('.mu-combobox-separator')).toHaveLength(2);
});
