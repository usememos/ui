# ToggleGroup

A row of related [Toggles](toggle.md). With `multiple`: a toolbar of independent on/off toggles. Without: one choice among peers, the same control as [Tabs](tabs.md) without a panel.

## Example

```tsx
import { Separator, Toggle, ToggleGroup } from "@usememos/ui";
import { Bold, Code, Italic } from "lucide-react";

<ToggleGroup value={[filter]} onValueChange={([next]) => next && setFilter(next)} aria-label="Show">
  <Toggle value="all">All</Toggle>
  <Toggle value="pinned">Pinned</Toggle>
  <Toggle value="archived">Archived</Toggle>
</ToggleGroup>

<ToggleGroup multiple value={marks} onValueChange={setMarks} aria-label="Formatting">
  <Toggle value="bold" icon={<Bold />} aria-label="Bold" />
  <Toggle value="italic" icon={<Italic />} aria-label="Italic" />
  <Separator orientation="vertical" />
  <Toggle value="code" icon={<Code />} aria-label="Code" />
</ToggleGroup>
```

## Parts

| Part | Base UI part | Renders |
| --- | --- | --- |
| `ToggleGroup` | `ToggleGroup` | A `<div role="group">`. Takes `size`. Without `multiple`, adds the sliding key |
| `Toggle` | `Toggle` | One item, a `<button aria-pressed>` |
| `Separator` | `Separator` | A line between clusters, `multiple` groups only |

## Props

```ts
interface ToggleGroupProps extends BaseToggleGroup.Props {
  size?: Size;         // passed to every Toggle inside
  fullWidth?: boolean; // fills the container; labeled Toggles grow from their natural width
}
```

Base UI's props pass through: `value`, `defaultValue`, `onValueChange`, `multiple`, `disabled`, `orientation`, `loopFocus`. The value is always an array of pressed `value`s, even without `multiple`.

## Rules

- Give the group an `aria-label`.
- A single choice among peers is a flat selected fill in a well; an on/off state is a pressed toggle. Never mix the two in one row.
- Without `multiple`: filters and view switches that don't change the whole page. For sections of a page, use Tabs.
- Base UI lets people press the chosen item to clear it. When one item must stay chosen, ignore an empty value, as in the example.
- Arrow keys move focus between items; Space or Enter presses one.
- Set `fullWidth` when the group is the only control on its row and should line up with the edges, such as a view switch across a popover. Don't set `className="w-full"` and `flex-1` on the Toggles yourself.

## Style

- At most as wide as its container. With `fullWidth`, exactly as wide: labeled Toggles start at their natural width and share the extra space equally (`flex: 1 1 auto`), so equal labels give equal Toggles and a long label is never cut while there is room. Inside a popup that sizes to its content, the group is as wide as its labels need. When the container is narrower than the labels, they shrink with an ellipsis; icon-only items keep their size.
- `multiple`: items 2px apart.
- Without `multiple`: a segmented well; the key slides to the chosen item over `duration-settle` with `ease-settle` and re-measures when an item changes width. Under reduced motion it jumps.
