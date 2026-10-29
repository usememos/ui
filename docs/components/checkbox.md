# Checkbox

Includes or excludes one item, saved with a form.

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

Wraps Base UI's [Checkbox](https://base-ui.com/react/components/checkbox) root with its indicator built in: `checked`, `defaultChecked`, `onCheckedChange`, `indeterminate`, `disabled`, `name`, `value` pass through. Renders a `<span role="checkbox">` and a hidden `<input>` for forms.

## Rules

- Name it with a `Field.Label` around it, or `aria-label`.
- For a setting that applies at once, use [Switch](switch.md). For a labeled group, wrap the boxes in a [Fieldset](field.md).
- Task lists in [Prose](prose.md) use this component at 16px.

## Style

- Unchecked: an empty well with an edge. Checked: a flat `primary` square (holds a value, so not raised).
- Lucide `Check` at a 2px stroke; `Minus` when indeterminate. It fades and scales in after the fill.
- Shrinks 6% while pressed.
