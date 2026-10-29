# Switch

A switch turns a setting on or off immediately. It is a pill-shaped well with a round knob, and the well fills with `primary` when on.

## Props

```ts
interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  "aria-label"?: string;
  size?: Size;
  disabled?: boolean;
}
```

Provide `label` or `aria-label`.

## Guidelines

- Sizes derive from the checkbox size: height = box + 2px (18, 20 and 22px), width = height × 1.7.
- The knob is a `key` with `shadow-key`, inset 2px. When on, the knob uses `on-primary`.
- Use it on settings pages, where each change saves at once. In a form with a Save button, use [Checkbox](checkbox.md).
- The switch is one of three round shapes in the system, with radios and avatars, because that's what people expect from it.
- The knob grows 10% on press and slides with `ease-settle`.
