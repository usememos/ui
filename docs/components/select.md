# Select

Picks one value from a short list.

## Example

```tsx
import { Field, Select } from "@usememos/ui";

const visibility = { private: "Private", workspace: "Workspace", public: "Public" };

<Field.Root>
  <Field.Label>Visibility</Field.Label>
  <Select.Root items={visibility} value={value} onValueChange={setValue}>
    <Select.Trigger>
      <Select.Value placeholder="Choose who can see it" />
    </Select.Trigger>
    <Select.Popup>
      <Select.Item value="private">Private</Select.Item>
      <Select.Item value="workspace">Workspace</Select.Item>
      <Select.Item value="public">Public</Select.Item>
    </Select.Popup>
  </Select.Root>
</Field.Root>
```

## Parts

| Part | Base UI part | Renders |
| --- | --- | --- |
| `Select.Root` | `Select.Root` | Nothing. Holds the value and a hidden input for forms. Takes `size` |
| `Select.Trigger` | `Select.Trigger` with `Select.Icon` | A neutral key with a chevron at the end, a `<button role="combobox">` |
| `Select.Value` | `Select.Value` | The chosen item's label, or the placeholder |
| `Select.Popup` | `Select.Portal`, `Positioner`, `Popup`, `List`, scroll arrows | The list, portaled to the body |
| `Select.Item` | `Select.Item` with `ItemText` and `ItemIndicator` | One option, with a check at the end when chosen. Takes `icon` |
| `Select.Group` | `Select.Group` | A labeled set of items |
| `Select.GroupLabel` | `Select.GroupLabel` | The name of a Group |
| `Select.Separator` | `Select.Separator` | A line between groups |

## Props

```ts
type Select.RootProps<Value, Multiple> = BaseSelect.Root.Props<Value, Multiple> & {
  size?: "sm" | "md";
};
interface Select.PopupProps extends BaseSelect.Popup.Props {
  alignItemWithTrigger?: boolean; // default true: the list opens over the trigger with the chosen item on the value
  side?: Side; align?: Align; // used when alignItemWithTrigger is false
  container?: HTMLElement | ShadowRoot | React.RefObject<HTMLElement | ShadowRoot | null> | null; // portal target
}
interface Select.ItemProps extends BaseSelect.Item.Props {
  icon?: IconElement;
}
```

Base UI's props pass through: `items`, `value`, `defaultValue`, `onValueChange`, `name`, `disabled`, `required`, `multiple` on the root; `placeholder` on Value; `value`, `disabled`, `label` on Item.

## Rules

- Pass `items` (value to label) to the root, so `Select.Value` shows the label, not the raw value.
- Label it with a [Field](field.md), or `aria-label` on the trigger.
- Use [RadioGroup](radio-group.md) for two or three options with room to show them, and [Combobox](combobox.md) for more than about 10 or when people type to find.
- For actions, use [Menu](menu.md).

## Style

- Trigger: a neutral key ([Button](button.md) `neutral`), value left-aligned, `ChevronsUpDown` in `ink-muted`. Placeholder in `ink-muted`, weight 400. Invalid: a `danger` edge.
- List: `mu-popup`, `space-1` padding, at least `menu-width` and the trigger's width. Rows like [Menu](menu.md) items; the highlighted row uses `hover`.
- Fades in and rises `space-1` over `duration-fade`; no rise under reduced motion.
