# Combobox

A combobox picks one value from a long list by typing. It is an [Input](input.md) with a search icon and a chevron, and a listbox below it that filters as you type.

## Props

```ts
interface ComboboxProps {
  options: SelectOption[]; // { value, label, icon?, description?, disabled? }
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  prefix?: React.ReactNode | null; // null drops the search icon
  defaultOpen?: boolean;
  size?: Size;
  id?: string;
  "aria-label"?: string;
}
```

Provide `aria-label` or wrap it in a [Field](field.md).

## Guidelines

- Use it for tags, people and anything with more than about 10 options. For fewer, use [Select](select.md).
- Arrow keys move the highlight, Enter picks, Escape closes. The highlighted row uses `hover`; the current value has a check.
- The list is at most 240px tall and scrolls.
- Multi-select (a tag list with several chips) is not built yet. It will be this component with a chip row.
