# Field and Fieldset

A field gives one control its label, its description and its error, and wires them up for screen readers. A fieldset does the same for a group of checkboxes, radios or switches.

## Example

```tsx
import { Checkbox, Field, Fieldset, Input } from "@usememos/ui";

<Field.Root invalid={!!error}>
  <Field.Label>Email</Field.Label>
  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
  <Field.Description>We only use it to sign you in.</Field.Description>
  <Field.Error match>{error}</Field.Error>
</Field.Root>

<Fieldset.Root>
  <Fieldset.Legend>Notifications</Fieldset.Legend>
  <Field.Root>
    <Field.Label><Checkbox defaultChecked /> Mentions</Field.Label>
  </Field.Root>
  <Field.Root>
    <Field.Label><Checkbox /> Weekly digest</Field.Label>
  </Field.Root>
</Fieldset.Root>
```

## Parts

| Part | Base UI part | Renders |
| --- | --- | --- |
| `Field.Root` | `Field.Root` | A `<div>` around one control. Takes `size` and passes it to the control |
| `Field.Label` | `Field.Label` | A `<label>`. Above a text control, or around a Checkbox, Switch or Radio so it sits beside the text |
| `Field.Item` | `Field.Item` | A `<div>` around one option of a radio or checkbox group inside one field |
| `Field.Description` | `Field.Description` | A `<p>` of help under the control |
| `Field.Error` | `Field.Error` | A `<div>` with a `CircleAlert` icon and the message, shown while the field is invalid |
| `Fieldset.Root` | `Fieldset.Root` | A `<fieldset>` around a group of fields. Takes `size` |
| `Fieldset.Legend` | `Fieldset.Legend` | The group's name |

## Props

```ts
interface Field.RootProps extends BaseField.Root.Props {
  size?: Size; // passed to the control inside
}
interface Fieldset.RootProps extends BaseFieldset.Root.Props {
  size?: Size; // passed to every control inside
}
// The other parts take Base UI's props. Field.Error's `match` decides when it shows:
// `true` always while invalid, or a ValidityState key such as "valueMissing".
```

Base UI's `Field.Root` props (`name`, `invalid`, `disabled`, `validate`, `validationMode`) pass through. `invalid` comes from the app when the server rejects a value; `validate` runs on the client.

## Guidelines

- The label uses the `label` style (14px, 500), `space-1` above the control. The description and the error are 12px, below it.
- An error replaces the description, turns the control's edge `danger`, and starts with a `CircleAlert` icon. Say how to fix the problem.
- A Checkbox, Switch or Radio goes inside its `Field.Label`, so clicking the text toggles it. The label text is weight 400 there.
- A radio group is one field: `Field.Root` holds `Fieldset.Root render={<RadioGroup />}`, and each radio sits in a `Field.Item`. See [RadioGroup](radio-group.md).
- Stack fields `space-4` apart. Group them with a heading or a Fieldset rather than boxes.
- A placeholder is never the only label.
