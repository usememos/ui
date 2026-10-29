# Select

A select picks one value from a short list. The trigger is a neutral key with the value and a chevron; the list is a menu with a check on the current value.

## Props

```ts
interface SelectOption {
  value: string;
  label: React.ReactNode;
  icon?: IconElement;
  description?: React.ReactNode;
  disabled?: boolean;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: Size;
  id?: string;
  "aria-label"?: string;
}
```

Provide `aria-label` or wrap it in a [Field](field.md).

## Guidelines

- An option's `description` is one short line under its label, for choices with consequences ("Who can see this").
- Use [RadioGroup](radio-group.md) instead when there are two or three options and room to show them all.
- For more than about 10 options, or when people need to type, use [Combobox](combobox.md).
- The highlighted row uses `hover`.
