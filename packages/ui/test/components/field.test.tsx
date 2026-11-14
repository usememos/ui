// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { Checkbox, Field, Input, Switch } from '../../src';
import { render } from '../render';
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

it('Item keeps repeated controls connected to their individual labels', () => {
  const { container } = render(<Field.Root><Field.Label>Options</Field.Label><Field.Item><Field.Label><Checkbox />First</Field.Label></Field.Item><Field.Item><Field.Label><Checkbox />Second</Field.Label></Field.Item></Field.Root>);
  const items = container.querySelectorAll('.mu-field-item');
  expect(items).toHaveLength(2);
  for (const item of items) {
    const label = item.querySelector('label')!;
    const input = item.querySelector('input')!;
    expect(label.htmlFor).toBe(input.id);
  }
});
