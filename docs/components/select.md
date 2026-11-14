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
| `Select.Trigger` | `Select.Trigger` with `Select.Icon` | A neutral key with a chevron at the end, a `<button role="combobox">`. Takes `variant` |
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
interface Select.TriggerProps extends BaseSelect.Trigger.Props {
  variant?: "neutral" | "ghost"; // default "neutral"; ghost: a flat row, for a switcher in a sidebar or toolbar
}
interface Select.PopupProps extends BaseSelect.Popup.Props {
  alignItemWithTrigger?: boolean; // default false: open below the trigger
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
- `variant="ghost"` draws the trigger as a row instead of a key, for a value people switch in place, such as the current space in a sidebar. In a sidebar with `mu-compact` it is 28px tall, like the rows around it. Put an icon or Avatar before `Select.Value`. In a form, keep `neutral`.

## Style

- Trigger: a neutral key ([Button](button.md) `neutral`), a quiet `edge` at rest and on hover, value left-aligned at weight 400, a single `ChevronDown` in `text-secondary`. `ghost`: a ghost Button with the `text` color, `hover` on hover and while open. Placeholder in `text-secondary`, also weight 400. Invalid: a `danger` edge at rest and on hover; focus reuses the shared 1px edge while the error message stays visible.
- List: `mu-popup`, 6px padding, at least `menu-width` and the trigger's width, at most `menu-max-width` or the trigger's width when that is wider. Rows like [Menu](menu.md) items: 28px at sm, 32px at md, highlight in the row's radius; the highlighted row uses `hover`. Items and group labels use 8px inline padding at both sizes, including when an item has a leading icon; the icon-to-label gap is 8px. See [Floating-list items](../layout.md#floating-list-items).
- Opens below the trigger, aligned to its start edge; collision handling can flip it when space is limited. `alignItemWithTrigger={true}` opts into value-aligned positioning. Opening and closing use the shared [Motion](../motion.md) treatment: a 100ms fade and `space-1` offset, with no scale or chevron rotation. Under reduced motion both are immediate. The chosen value uses one check; row highlighting identifies the current pointer or keyboard target and updates without animation.
