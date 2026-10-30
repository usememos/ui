# Combobox

Picks one value from a long list by typing to filter it.

## Example

```tsx
import { Combobox, Field } from "@usememos/ui";

const tags = ["book", "design", "travel"];

<Field.Root>
  <Field.Label>Tag</Field.Label>
  <Combobox.Root items={tags} value={tag} onValueChange={setTag}>
    <Combobox.Input placeholder="Find a tag" />
    <Combobox.Popup>
      <Combobox.Empty>No tags found</Combobox.Empty>
      <Combobox.List>
        {(tag: string) => (
          <Combobox.Item key={tag} value={tag}>{tag}</Combobox.Item>
        )}
      </Combobox.List>
    </Combobox.Popup>
  </Combobox.Root>
</Field.Root>
```

## Parts

| Part | Base UI part | Renders |
| --- | --- | --- |
| `Combobox.Root` | `Combobox.Root` | Nothing. Holds the value, the input text and a hidden input for forms. Takes `size` |
| `Combobox.Input` | `Combobox.InputGroup`, `Input`, `Trigger` | An [Input](input.md) box: a search icon, the `<input role="combobox">` and a chevron button that opens the list. Takes `icon` |
| `Combobox.Popup` | `Combobox.Portal`, `Positioner`, `Popup` | The panel under the input, as wide as the input, portaled to the body |
| `Combobox.List` | `Combobox.List` | The items, a `<div role="listbox">`. A function child renders each filtered item |
| `Combobox.Item` | `Combobox.Item` with `ItemIndicator` | One option, with a check at the end when chosen. Takes `icon` |
| `Combobox.Empty` | `Combobox.Empty` | The text shown when nothing matches. Stays mounted, so screen readers announce it |
| `Combobox.Group` | `Combobox.Group` | A labeled set of items |
| `Combobox.GroupLabel` | `Combobox.GroupLabel` | The name of a Group |
| `Combobox.Separator` | `Combobox.Separator` | A line between groups |
| `Combobox.Collection` | `Combobox.Collection` | Base UI's part, unstyled: renders one group's items from grouped `items` |
| `Combobox.useFilter` | `Combobox.useFilter` | Base UI's hook: locale-aware `contains`, `startsWith`, `endsWith` for `filter` |

## Props

```ts
type Combobox.RootProps<Value, Multiple, Item> = BaseCombobox.Root.Props<Value, Multiple, Item> & {
  size?: Size;
};
interface Combobox.InputProps extends BaseCombobox.Input.Props {
  icon?: IconElement | null; // default <Search />; null drops it
  triggerLabel?: string;     // the chevron's name outside a Field; default "Show options"
  className?: string;        // on the box, not the <input>
  style?: React.CSSProperties; // on the box
}
interface Combobox.PopupProps extends BaseCombobox.Popup.Props {
  side?: Side; align?: Align; // Positioner props; default side "bottom", align "start"
  container?: HTMLElement | ShadowRoot | React.RefObject<HTMLElement | ShadowRoot | null> | null; // portal target
}
interface Combobox.ItemProps extends BaseCombobox.Item.Props {
  icon?: IconElement;
}
```

Base UI's props pass through: `items`, `value`, `defaultValue`, `onValueChange`, `inputValue`, `onInputValueChange`, `filter`, `itemToStringLabel`, `isItemEqualToValue`, `open`, `onOpenChange`, `name`, `disabled`, `required` on the root; `placeholder`, `disabled` on Input; `value`, `disabled` on Item.

## Rules

- Pass `items` to the root and render them with a function child of `List`. The root filters them as people type; `Empty` needs `items` to know when nothing matches.
- For object items, pass `itemToStringLabel` so the input shows the label, and give each Item the object as `value`.
- Label it with a [Field](field.md); the label names the input and the chevron. Outside a Field, give Input an `aria-label`.
- Use it for more than about 10 options, or when people type to find one. For fewer, use [Select](select.md).
- Typing opens the list. Up and Down move the highlight, Enter picks, Escape closes; focus stays in the input.
- Multi-select (chips) is not built.

## Style

- The box is an [Input](input.md): flat `surface`, `edge`, focus ring on the box. The search icon and chevron are `ink-muted`; the chevron turns `ink` on hover.
- List: `mu-popup`, `space-1` padding, as wide as the input and at least `menu-width`, at most `list-height` (240px) tall, then it scrolls.
- Rows are a control height, text weight 400; the highlighted row uses `hover`; the chosen row has a check at the end.
- Empty text: `body` in `ink-muted`, `space-3` by `space-4` padding.
- Fades in and rises `space-1` over `duration-fade`; no rise under reduced motion.
