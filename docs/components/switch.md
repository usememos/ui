# Switch

A switch turns a setting on or off immediately. It is a pill-shaped well with a round knob, and the well fills with `primary` when on.

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

`Switch` wraps Base UI's [Switch](https://base-ui.com/react/components/switch) root with its thumb built in, so its props (`checked`, `defaultChecked`, `onCheckedChange`, `disabled`, `name`) pass through.

Name it with a `Field.Label` around it, or `aria-label`.

## Guidelines

- Sizes derive from the checkbox size: height = box + 2px (18, 20 and 22px), width = height × 1.7.
- The knob is a `key` with `shadow-key`, inset 2px. When on, the knob uses `on-primary`.
- Use it on settings pages, where each change saves at once. In a form with a Save button, use [Checkbox](checkbox.md).
- The switch is one of three round shapes in the system, with radios and avatars, because that's what people expect from it.
- The knob grows 10% on press and slides with `ease-settle`.
