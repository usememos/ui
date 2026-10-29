# Field and Fieldset

A field gives one control its label, its description and its error, and wires them up for screen readers. A fieldset does the same for a group of checkboxes, radios or switches.

## Props

```ts
interface FieldProps {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  children: React.ReactElement; // one control: Input, Textarea, Select or Combobox
}

interface FieldsetProps {
  legend?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  size?: Size;
  children: React.ReactNode; // Checkbox, Switch or RadioGroup controls
}
```

## Guidelines

- The label uses the `label` style (14px, 500), `space-1` above the control. The description and the error are 12px, below it.
- An error replaces the description, turns the control's edge `danger`, and starts with a `CircleAlert` icon. Say how to fix the problem.
- Stack fields `space-4` apart. Group them with a heading or a Fieldset rather than boxes.
- A placeholder is never the only label.
