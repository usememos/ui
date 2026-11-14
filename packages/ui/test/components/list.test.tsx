// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { Button, List } from '../../src';
import { render } from '../render';
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
