// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { Checkbox, Field, Fieldset, Switch } from '../../src';
import { render } from '../render';
describe('Fieldset', () => {
  it('passes a Fieldset size to every control', () => {
    const { container } = render(
      <Fieldset.Root size="sm">
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
    expect(container.querySelector('.mu-checkbox')!.className).toContain('mu-s-sm');
    expect(container.querySelector('.mu-switch')!.className).toContain('mu-s-sm');
  });
});
