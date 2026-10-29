# Switch

Turns a setting on or off at once.

## Example

```tsx
import { Field, Switch } from "@usememos/ui";

<Field.Root>
  <Field.Label>
    <Switch checked={publicByDefault} onCheckedChange={save} /> Make new notes public
  </Field.Label>
</Field.Root>
```

## Props

```ts
interface SwitchProps extends BaseSwitch.Root.Props {
  size?: Size; // 18, 20, 22px tall
}
```

Wraps Base UI's [Switch](https://base-ui.com/react/components/switch) root with its thumb built in: `checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `name` pass through.

## Rules

- Name it with a `Field.Label` around it, or `aria-label`.
- Use it where each change saves at once (settings pages). In a form with a Save button, use [Checkbox](checkbox.md).

## Style

- A pill well with a round knob; the well fills with `primary` when on.
- Height = checkbox box + 2px; width = height × 1.7.
- The knob is a `key` with `shadow-key`, inset 2px; `on-primary` when on. It grows 10% on press and slides with `ease-settle`. Under reduced motion it doesn't slide or grow.
