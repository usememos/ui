# Field and Fieldset

Field gives one control its label, description and error, wired for screen readers. Fieldset groups checkboxes, radios or switches under one legend.

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
| `Field.Label` | `Field.Label` | A `<label>`: above a text control, or around a Checkbox, Switch or Radio |
| `Field.Item` | `Field.Item` | A `<div>` around one option of a radio or checkbox group in one field |
| `Field.Description` | `Field.Description` | A `<p>` of help under the control |
| `Field.Error` | `Field.Error` | A `<div>` with a `CircleAlert` icon and the message, while the field is invalid |
| `Fieldset.Root` | `Fieldset.Root` | A `<fieldset>`. Takes `size` |
| `Fieldset.Legend` | `Fieldset.Legend` | The group's name |

## Props

```ts
interface Field.RootProps extends BaseField.Root.Props {
  size?: Size; // passed to the control inside
}
interface Fieldset.RootProps extends BaseFieldset.Root.Props {
  size?: Size; // passed to every control inside
}
```

Base UI's props pass through: `name`, `invalid`, `disabled`, `validate`, `validationMode` on `Field.Root`; `match` on `Field.Error` (`true` shows it whenever the field is invalid, or a `ValidityState` key such as `"valueMissing"`).

## Rules

- Set `invalid` from the app when the server rejects a value; use `validate` for client checks.
- Write the error as how to fix the problem.
- Put a Checkbox, Switch or Radio inside its `Field.Label`, so clicking the text toggles it.
- A radio group is one field: `Field.Root` holds `Fieldset.Root render={<RadioGroup />}`, and each radio sits in a `Field.Item`. See [RadioGroup](radio-group.md).
- Stack fields `space-4` apart. Group them with a heading or a Fieldset, not boxes.
- Never use a placeholder as the only label.

## Style

- Label: `label` style (14px, 500), `space-1` above the control; weight 400 when it wraps a Checkbox, Switch or Radio.
- Description and error: 12px, below the control. The error hides the description and turns the control's edge `danger`.
