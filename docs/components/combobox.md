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
| `Combobox.Row` | `Combobox.Row` | One row of a grid, with `grid` on the root: square cells for icons or emoji |
| `Combobox.Collection` | `Combobox.Collection` | Base UI's part, unstyled: renders one group's items from grouped `items` |
| `Combobox.useFilter` | `Combobox.useFilter` | Base UI's hook: locale-aware `contains`, `startsWith`, `endsWith` for `filter` |

## Props

```ts
type Combobox.RootProps<Value, Multiple, Item> = BaseCombobox.Root.Props<Value, Multiple, Item> & {
  size?: "sm" | "md";
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
- With `inline` on the root, the list sits in the page instead of a popup: put `Input`, `Empty` and `List` directly inside the root, with no `Popup`. The root is then open unless you pass `open`, and the Input drops its chevron. Use it for a picker inside a Popover or a Dialog.
- With `grid` on the root, split the filtered items into rows of a fixed count and wrap each in `Combobox.Row`. Arrow keys then move across rows and columns, and Enter picks. Give each cell an `aria-label`. This is the icon and emoji picker:

  ```tsx
  <Combobox.Root items={icons} inline grid value={icon} onValueChange={pick} inputValue={query} onInputValueChange={setQuery} itemToStringLabel={(item) => item.label}>
    <Combobox.Input placeholder="Find an icon" aria-label="Find an icon" />
    <Combobox.Empty>No icons found</Combobox.Empty>
    <Combobox.List aria-label="Icons">
      {rows(icons.filter((item) => contains(item.label, query)), 8).map((row, index) => (
        <Combobox.Row key={index}>
          {row.map((item) => (
            <Combobox.Item key={item.value} value={item} aria-label={item.label}>{item.icon}</Combobox.Item>
          ))}
        </Combobox.Row>
      ))}
    </Combobox.List>
  </Combobox.Root>
  ```

  The rows are rendered by the app, so filter them with the same query: keep it in `inputValue` and `onInputValueChange`, and match with `useFilter().contains`.

## Style

- The box is an [Input](input.md): flat `surface`, `edge`, and the focused edge on the box. The search icon and chevron are `ink-muted`; the chevron turns `ink` on hover.
- List: `mu-popup`, `space-1` padding, as wide as the input and at least `menu-width`, at most `list-height` (240px) tall, then it scrolls.
- Rows are a control height, text weight 400; the highlighted row uses `hover`; the chosen row has a check at the end.
- Empty text: `body` in `ink-muted`, `space-3` by `space-4` padding.
- Grid cells: square, a control height, `inset` apart, `row-radius`; the highlighted cell uses `hover`, the chosen cell sits in a `well` like a pressed Toggle. No check.
- Fades in and rises `space-1` over `duration-fade`; no rise under reduced motion.
