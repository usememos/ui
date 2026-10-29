# ToggleGroup

A toggle group is a row of related [Toggles](toggle.md). With `multiple` it is a toolbar of independent on/off toggles. Without it, it is a segmented well with one sliding key: the same control as [Tabs](tabs.md), without a panel.

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
| `ToggleGroup` | `ToggleGroup` | A `<div role="group">`. Takes `size`. Without `multiple` it adds the sliding key |
| `Toggle` | `Toggle` | One item, a `<button aria-pressed>` |
| `Separator` | `Separator` | A hairline between clusters, `multiple` groups only |

## Props

```ts
interface ToggleGroupProps extends BaseToggleGroup.Props {
  size?: Size; // passed to every Toggle inside
}
```

Base UI's props (`value`, `defaultValue`, `onValueChange`, `multiple`, `disabled`, `orientation`, `loopFocus`) pass through. The value is always an array of the pressed toggles' `value`s, even without `multiple`.

## Guidelines

- One rule for "selected": a single choice among peers is always a raised key in a well. An on/off state is a pressed toggle. Never mix the two in one row.
- **Multiple:** items sit 2px apart. A vertical Separator splits clusters.
- **Single:** use it for filters and view switches that don't change the whole page. For sections of a page, use Tabs. Base UI lets people press the chosen item to clear it; ignore an empty value, as in the example, when one item must stay chosen.
- The key slides to the chosen item over `duration-settle` with `ease-settle`, and re-measures when an item changes width.
- Arrow keys move focus between items; Space or Enter presses one.
