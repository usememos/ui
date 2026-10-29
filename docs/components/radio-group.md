# RadioGroup

A radio group picks exactly one option from a short list that is always visible. Each radio is a round well; the chosen one becomes a flat `primary` circle with an `on-primary` dot.

## Props

```ts
interface RadioGroupProps {
  options: { value: string; label: React.ReactNode; description?: React.ReactNode }[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: "vertical" | "horizontal"; // default "vertical"
  size?: Size;
  "aria-label"?: string;
}
```

## Guidelines

- Use it when the options need a description, or when there are two or three of them. Otherwise use [Select](select.md).
- Like a checked box, a chosen radio holds a value, so it is flat, not raised.
- Options stack `space-3` apart vertically, or sit `space-4` apart in a row.
- Arrow keys move the selection; only the selected radio is in the tab order.
