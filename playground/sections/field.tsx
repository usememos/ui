import { Button, Checkbox, Field, Fieldset, Input, Switch, Textarea } from '@usememos/ui';
import type { SectionProps } from '.';

/** The form pattern: labels above controls, errors under them, actions at the end. */
export function FieldSection({ size }: SectionProps) {
  return (
    <form style={{ display: 'grid', gap: 16, maxWidth: 400 }} onSubmit={(event) => event.preventDefault()}>
      <Field.Root size={size}>
        <Field.Label>Name</Field.Label>
        <Input defaultValue="Memos" />
        <Field.Description>Shown on your public profile.</Field.Description>
      </Field.Root>
      <Field.Root size={size} invalid>
        <Field.Label>Email</Field.Label>
        <Input type="email" defaultValue="memos@" />
        <Field.Description>We only use it to sign you in.</Field.Description>
        <Field.Error match>Enter an email address, like name@example.com.</Field.Error>
      </Field.Root>
      <Field.Root size={size}>
        <Field.Label>About</Field.Label>
        <Textarea placeholder="A line or two about you" />
      </Field.Root>
      <Fieldset.Root size={size}>
        <Fieldset.Legend>Notifications</Fieldset.Legend>
        <Field.Root>
          <Field.Label>
            <Checkbox defaultChecked /> Mentions
          </Field.Label>
        </Field.Root>
        <Field.Root>
          <Field.Label>
            <Checkbox /> Weekly digest
          </Field.Label>
        </Field.Root>
        <Field.Root disabled>
          <Field.Label>
            <Switch /> Product news
          </Field.Label>
        </Field.Root>
      </Fieldset.Root>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <Button variant="ghost" size={size}>
          Cancel
        </Button>
        <Button variant="primary" size={size} type="submit">
          Save
        </Button>
      </div>
    </form>
  );
}
