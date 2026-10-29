# Checkbox

A checkbox includes or excludes one item, saved with a form. Unchecked, it is an empty well with an edge. Checked, it is a flat `primary` square with a check.

## Example

```tsx
import { Checkbox, Field } from "@usememos/ui";

<Field.Root>
  <Field.Label>
    <Checkbox checked={digest} onCheckedChange={setDigest} /> Weekly digest
  </Field.Label>
</Field.Root>
```

## Props

```ts
interface CheckboxProps extends BaseCheckbox.Root.Props {
  size?: Size; // box: 16, 18, 20px
}
```

`Checkbox` wraps Base UI's [Checkbox](https://base-ui.com/react/components/checkbox) root with its indicator built in, so its props (`checked`, `defaultChecked`, `onCheckedChange`, `indeterminate`, `disabled`, `name`, `value`) pass through. It renders a `<span role="checkbox">` and a hidden `<input>` for forms.

Name it with a `Field.Label` around it, or `aria-label`.

## Guidelines

- A checked box holds a value, so it is flat, not raised. Only buttons and keys are raised.
- The check is a Lucide `Check` at a 2px stroke; `indeterminate` shows a `Minus`. It fades and scales in after the fill.
- The box shrinks 6% while pressed.
- For a setting that applies at once, use [Switch](switch.md). For a group with a label, wrap the boxes in a [Fieldset](field.md).
- Task lists in [Prose](prose.md) use the same component at 16px.
