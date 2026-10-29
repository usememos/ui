# RadioGroup

Picks exactly one option from a short list that is always visible.

## Example

```tsx
import { Field, Fieldset, Radio, RadioGroup } from "@usememos/ui";

<Field.Root name="visibility">
  <Fieldset.Root render={<RadioGroup value={visibility} onValueChange={setVisibility} />}>
    <Fieldset.Legend>Visibility</Fieldset.Legend>
    <Field.Item>
      <Field.Label><Radio value="private" /> Private</Field.Label>
    </Field.Item>
    <Field.Item>
      <Field.Label><Radio value="public" /> Public</Field.Label>
    </Field.Item>
  </Fieldset.Root>
</Field.Root>
```

## Parts

| Part | Base UI part | Renders |
| --- | --- | --- |
| `RadioGroup` | `RadioGroup` | A `<div role="radiogroup">`. Takes `size` and `orientation` |
| `Radio` | `Radio.Root` with `Radio.Indicator` | One option, a `<span role="radio">` |

## Props

```ts
interface RadioGroupProps extends BaseRadioGroup.Props {
  size?: Size;
  orientation?: "vertical" | "horizontal"; // default "vertical"
}
interface RadioProps extends BaseRadio.Root.Props {
  size?: Size; // usually set by the group
}
```

Base UI's props pass through: `value`, `defaultValue`, `onValueChange`, `disabled`, `name` on the group; `value`, `disabled` on each radio.

## Rules

- Use the pattern in the example: one field, a fieldset that names it, each radio labeled in a `Field.Item`.
- Use it for two or three options, or options that need a description. Otherwise use [Select](select.md).
- Arrow keys move the selection; only the selected radio is in the tab order.

## Style

- Each radio is a round well; the chosen one is a flat `primary` circle with an `on-primary` dot.
- Vertical: `space-3` apart. Horizontal: `space-4` apart, with the legend on its own line above.
