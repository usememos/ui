// @vitest-environment happy-dom
import { Bold } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { Tabs } from '../../src';
import { click, render } from '../render';
describe('Tabs', () => {
  it('builds the indicator into the list and passes the size', () => {
    const { container } = render(
      <Tabs.Root size="sm" defaultValue="a">
        <Tabs.List aria-label="Sections">
          <Tabs.Tab value="a" icon={<Bold />}>
            A
          </Tabs.Tab>
          <Tabs.Tab value="b">B</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="a">Panel A</Tabs.Panel>
        <Tabs.Panel value="b">Panel B</Tabs.Panel>
      </Tabs.Root>,
    );
    const list = container.querySelector('[role="tablist"]')!;
    expect(list.className).toContain('mu-s-sm');
    expect(list.querySelector('.mu-tabs-indicator')).not.toBeNull();
    const [a, b] = container.querySelectorAll('[role="tab"]');
    expect(a!.querySelector('svg')).not.toBeNull();
    click(b!);
    expect(b!.getAttribute('aria-selected')).toBe('true');
    // Panel A stays mounted, inert, while it animates out.
    expect(container.querySelector('[role="tabpanel"]:not([inert])')!.textContent).toBe('Panel B');
  });
});

it('controlled value reports navigation and waits for the selected panel prop', () => {
  const change = vi.fn();
  const tabs = (value: string) => <Tabs.Root value={value} onValueChange={change}><Tabs.List aria-label="Sections"><Tabs.Tab value="a">A</Tabs.Tab><Tabs.Tab value="b">B</Tabs.Tab></Tabs.List><Tabs.Panel value="a">Panel A</Tabs.Panel><Tabs.Panel value="b">Panel B</Tabs.Panel></Tabs.Root>;
  const { container, rerender } = render(tabs('a'));
  const controls = container.querySelectorAll('[role="tab"]');
  click(controls[1]!); expect(change).toHaveBeenCalledWith('b', expect.anything());
  expect(controls[0]!.getAttribute('aria-selected')).toBe('true');
  rerender(tabs('b'));
  expect(controls[1]!.getAttribute('aria-selected')).toBe('true');
  expect(container.querySelector('[role="tabpanel"]:not([hidden]):not([inert])')!.textContent).toBe('Panel B');
});
