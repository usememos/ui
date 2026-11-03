import { Button, Field, Form, Input, Switch } from '@usememos/ui';
import type { RowSize, SectionProps } from '.';

/** A bordered small form, and the same form unboxed. The section's size doesn't reach inside: a Form is always md. */
export function FormSection(_: SectionProps<RowSize>) {
  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 480 }}>
      {[true, false].map((bordered) => (
        <Form.Root key={String(bordered)} bordered={bordered} onSubmit={(event) => event.preventDefault()} data-bordered={bordered || undefined}>
          <Form.Title>{bordered ? 'Add a tag rule' : 'Profile'}</Form.Title>
          <Form.Description>{bordered ? 'Tag new notes that match a word.' : 'Shown on your public notes.'}</Form.Description>
          <Field.Root name={bordered ? 'tag' : 'name'}>
            <Field.Label>{bordered ? 'Tag' : 'Display name'}</Field.Label>
            <Input defaultValue={bordered ? 'work' : 'Steven'} />
          </Field.Root>
          <Field.Root orientation="horizontal">
            <Field.Label>{bordered ? 'Apply to existing notes' : 'Show my email'}</Field.Label>
            <Switch defaultChecked={bordered} />
          </Field.Root>
          <Form.Footer>
            <Button variant="ghost">Cancel</Button>
            <Button variant="primary" type="submit">
              {bordered ? 'Add rule' : 'Save'}
            </Button>
          </Form.Footer>
        </Form.Root>
      ))}
    </div>
  );
}
