# Checkbox

A checkbox includes or excludes one item, saved with a form. Unchecked, it is an empty well with an edge. Checked, it is a flat `primary` square with a check.

## Props

```ts
interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  "aria-label"?: string;
  size?: Size; // box: 16, 18, 20px
  disabled?: boolean;
}
```

Provide `label` or `aria-label`.

## Guidelines

- A checked box holds a value, so it is flat, not raised. Only buttons and keys are raised.
- The check is a Lucide `Check` at a 2px stroke. It fades and scales in after the fill.
- The box shrinks 6% while pressed.
- For a setting that applies at once, use [Switch](switch.md). For a group with a label, wrap the boxes in a [Fieldset](field.md).
- Task lists in [Prose](prose.md) use the same component at 16px.
