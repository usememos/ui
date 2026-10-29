# RadioGroup

A radio group picks exactly one option from a short list that is always visible. Each radio is a round well; the chosen one becomes a flat `primary` circle with an `on-primary` dot.

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

This is Base UI's pattern: the group is one field, the fieldset names it, and each radio is labeled inside a `Field.Item`.

## Parts

| Part | Base UI part | Renders |
| --- | --- | --- |
| `RadioGroup` | `RadioGroup` | A `<div role="radiogroup">`. Takes `size` and `orientation` |
| `Radio` | `Radio.Root` with `Radio.Indicator` | One round option, a `<span role="radio">` |

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

Base UI's props (`value`, `defaultValue`, `onValueChange`, `disabled`, `name` on the group; `value`, `disabled` on each radio) pass through.

## Guidelines

- Use it when the options need a description, or when there are two or three of them. Otherwise use [Select](select.md).
- Like a checked box, a chosen radio holds a value, so it is flat, not raised.
- Options stack `space-3` apart vertically, or sit `space-4` apart in a row. In a row, the legend takes its own line above the radios.
- Arrow keys move the selection; only the selected radio is in the tab order.
