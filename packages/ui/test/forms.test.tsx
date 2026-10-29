// @vitest-environment happy-dom
// Our behavior on top of Base UI for the Phase 2 components: classes, size
// through Roots, the Input box, and the ToggleGroup's sliding key.
import { act } from 'react';
import { Bold } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { Checkbox, Field, Fieldset, Input, Radio, RadioGroup, Switch, Tabs, Textarea, Toggle, ToggleGroup } from '../src';
import { render } from './render';

const click = (element: Element) => act(() => (element as HTMLElement).click());

describe('Field', () => {
  it('passes its size to the control inside', () => {
    const { container } = render(
      <Field.Root size="sm">
        <Field.Label>Name</Field.Label>
        <Input />
      </Field.Root>,
    );
    expect(container.querySelector('.mu-input-root')!.className).toContain('mu-s-sm');
    const input = container.querySelector('input')!;
    expect(container.querySelector('label')!.htmlFor).toBe(input.id);
  });

  it('shows the error with an icon and marks the control invalid', () => {
    const { container } = render(
      <Field.Root invalid>
        <Field.Label>Email</Field.Label>
        <Input />
        <Field.Description>Help</Field.Description>
        <Field.Error match>Enter an email address.</Field.Error>
      </Field.Root>,
    );
    const error = container.querySelector('.mu-field-error')!;
    expect(error.textContent).toBe('Enter an email address.');
    expect(error.querySelector('svg.mu-icon')).not.toBeNull();
    expect(container.querySelector('input')!.hasAttribute('data-invalid')).toBe(true);
  });

  it('passes a Fieldset size to every control', () => {
    const { container } = render(
      <Fieldset.Root size="lg">
        <Fieldset.Legend>Notifications</Fieldset.Legend>
        <Field.Root>
          <Field.Label>
            <Checkbox /> Mentions
          </Field.Label>
        </Field.Root>
        <Field.Root>
          <Field.Label>
            <Switch size="sm" /> News
          </Field.Label>
        </Field.Root>
      </Fieldset.Root>,
    );
    expect(container.querySelector('.mu-checkbox')!.className).toContain('mu-s-lg');
    expect(container.querySelector('.mu-switch')!.className).toContain('mu-s-sm');
  });
});

describe('Input', () => {
  it('puts className and style on the box, and the ref and props on the input', () => {
    const ref = { current: null as HTMLInputElement | null };
    const { container } = render(<Input ref={ref} className="app" style={{ maxWidth: 200 }} placeholder="Title" prefix="#" suffix="px" />);
    const box = container.querySelector('.mu-input-root') as HTMLElement;
    expect(box.className.split(' ').at(-1)).toBe('app');
    expect(box.style.maxWidth).toBe('200px');
    expect(ref.current).toBe(container.querySelector('input'));
    expect(ref.current!.placeholder).toBe('Title');
    expect(ref.current!.className).toBe('mu-input');
    expect([...box.children].map((child) => child.className)).toEqual(['mu-input-prefix', 'mu-input', 'mu-input-suffix']);
  });

  it('calls onValueChange as the user types', () => {
    const onValueChange = vi.fn();
    const { container } = render(<Input onValueChange={onValueChange} />);
    const input = container.querySelector('input')!;
    act(() => {
      // React reads the value through the prototype setter it tracks.
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, 'hi');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(onValueChange).toHaveBeenCalledWith('hi', expect.anything());
  });
});

describe('Textarea', () => {
  it('is a textarea with three rows by default', () => {
    const ref = { current: null as HTMLTextAreaElement | null };
    const { container } = render(<Textarea ref={ref} size="sm" />);
    const textarea = container.querySelector('textarea')!;
    expect(ref.current).toBe(textarea);
    expect(textarea.getAttribute('rows')).toBe('3');
    expect(textarea.className).toContain('mu-s-sm');
  });
});

describe('Checkbox', () => {
  it('toggles uncontrolled and reports the change', () => {
    const onCheckedChange = vi.fn();
    const { container } = render(<Checkbox aria-label="Done" onCheckedChange={onCheckedChange} />);
    const box = container.querySelector('[role="checkbox"]')!;
    click(box);
    expect(box.getAttribute('aria-checked')).toBe('true');
    expect(onCheckedChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it('shows a minus when indeterminate', () => {
    const { container } = render(<Checkbox aria-label="All" indeterminate />);
    expect(container.querySelector('.mu-checkbox-indicator svg')!.getAttribute('class')).toContain('lucide-minus');
  });
});

describe('Switch', () => {
  it('stays where a controlled value puts it', () => {
    const { container } = render(<Switch aria-label="Public" checked={false} />);
    const control = container.querySelector('[role="switch"]')!;
    click(control);
    expect(control.getAttribute('aria-checked')).toBe('false');
  });
});

describe('RadioGroup', () => {
  it('passes its size to each radio and sets the orientation', () => {
    const { container } = render(
      <RadioGroup size="lg" orientation="horizontal" defaultValue="a" aria-label="Choice">
        <Radio value="a" aria-label="A" />
        <Radio value="b" aria-label="B" />
      </RadioGroup>,
    );
    const group = container.querySelector('[role="radiogroup"]')!;
    expect(group.getAttribute('data-orientation')).toBe('horizontal');
    expect(group.getAttribute('aria-orientation')).toBe('horizontal');
    const radios = container.querySelectorAll('[role="radio"]');
    expect([...radios].map((radio) => radio.className.includes('mu-s-lg'))).toEqual([true, true]);
    click(radios[1]!);
    expect(radios[1]!.getAttribute('aria-checked')).toBe('true');
    expect(radios[0]!.getAttribute('aria-checked')).toBe('false');
  });
});

describe('Toggle', () => {
  it('is square with only an icon', () => {
    const { container } = render(<Toggle icon={<Bold />} aria-label="Bold" />);
    const button = container.querySelector('button')!;
    expect(button.className).toContain('mu-toggle-icon');
    expect(button.querySelector('.mu-toggle-label')).toBeNull();
  });

  it('stays pressed while on', () => {
    const { container } = render(<Toggle>Pinned</Toggle>);
    const button = container.querySelector('button')!;
    click(button);
    expect(button.getAttribute('aria-pressed')).toBe('true');
    expect(button.hasAttribute('data-pressed')).toBe(true);
  });
});

describe('ToggleGroup', () => {
  const group = (props: Partial<React.ComponentProps<typeof ToggleGroup>> = {}) => (
    <ToggleGroup aria-label="Show" {...props}>
      <Toggle value="all">All</Toggle>
      <Toggle value="pinned">Pinned</Toggle>
    </ToggleGroup>
  );

  it('is a segmented well with a key, and puts its size on every toggle', () => {
    const { container } = render(group({ size: 'sm', defaultValue: ['all'] }));
    const root = container.querySelector('.mu-toggle-group') as HTMLElement;
    expect(root.className).toContain('mu-segmented');
    expect(root.querySelector(':scope > .mu-segmented-key')).not.toBeNull();
    expect([...root.querySelectorAll('button')].every((button) => button.className.includes('mu-s-sm'))).toBe(true);
  });

  it('places the key under the pressed toggle and drops it when none is pressed', async () => {
    const { container } = render(group({ defaultValue: ['all'] }));
    const root = container.querySelector('.mu-toggle-group') as HTMLElement;
    expect(root.hasAttribute('data-keyed')).toBe(true);
    expect(root.style.getPropertyValue('--key-width')).toMatch(/px$/);
    const [all, pinned] = container.querySelectorAll('button');
    click(pinned!);
    expect(pinned!.hasAttribute('data-pressed')).toBe(true);
    expect(all!.hasAttribute('data-pressed')).toBe(false);
    click(pinned!);
    // The MutationObserver runs as a microtask.
    await act(async () => {});
    expect(root.hasAttribute('data-keyed')).toBe(false);
  });

  it('follows a controlled value', () => {
    const { container, rerender } = render(group({ value: ['all'] }));
    const [all, pinned] = container.querySelectorAll('button');
    click(pinned!);
    expect(all!.hasAttribute('data-pressed')).toBe(true);
    rerender(group({ value: ['pinned'] }));
    expect(pinned!.hasAttribute('data-pressed')).toBe(true);
  });

  it('has no key with multiple', () => {
    const { container } = render(group({ multiple: true, defaultValue: ['all', 'pinned'] }));
    const root = container.querySelector('.mu-toggle-group')!;
    expect(root.className).not.toContain('mu-segmented');
    expect(root.querySelector('.mu-segmented-key')).toBeNull();
    expect(container.querySelectorAll('[data-pressed]').length).toBe(2);
  });
});

describe('Tabs', () => {
  it('builds the indicator into the list and passes the size', () => {
    const { container } = render(
      <Tabs.Root size="lg" defaultValue="a">
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
    expect(list.className).toContain('mu-s-lg');
    expect(list.querySelector('.mu-tabs-indicator')).not.toBeNull();
    const [a, b] = container.querySelectorAll('[role="tab"]');
    expect(a!.querySelector('svg')).not.toBeNull();
    click(b!);
    expect(b!.getAttribute('aria-selected')).toBe('true');
    // Panel A stays mounted, inert, while it animates out.
    expect(container.querySelector('[role="tabpanel"]:not([inert])')!.textContent).toBe('Panel B');
  });
});
