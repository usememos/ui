# ToggleGroup

A row of related [Toggles](toggle.md) that changes values or tool states. Without `multiple`, it chooses one layout or filter; with `multiple`, it groups independent on/off tools. Use [Tabs](tabs.md) when each choice activates a corresponding content panel.

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
- Without `multiple`: filters and layout preferences for the same content, such as All / Pinned / Archived or List / 2 / 3 / Auto. Saving the preference does not turn it into a tab; the choice still changes a value rather than activating a content panel.
- With `multiple`: independent tools or filters that can be active together, such as Bold and Italic. Tabs always chooses one content panel and does not replace this behavior.
- Single-choice ToggleGroups and Tabs reuse the same segmented treatment. Keep the behavior APIs separate; do not add a `multiple` mode to Tabs or fake panels for settings.
- When long translated options would need several lines in a narrow panel, use a Select. Wrapping keeps a constrained group readable; it is not a reason to force every choice into a segmented group.
- Base UI lets people press the chosen item to clear it. When one item must stay chosen, ignore an empty value, as in the example.
- Arrow keys move focus between items; Space or Enter presses one.
- Set `fullWidth` when the group is the only control on its row and should line up with the edges, such as a view switch across a popover. Don't set `className="w-full"` and `flex-1` on the Toggles yourself.

## Style

- At most as wide as its container. With `fullWidth`, exactly as wide: labeled Toggles start at their natural width and share the extra space equally (`flex: 1 1 auto`), so equal labels give equal Toggles and a long label is never cut while there is room. Inside a popup that sizes to its content, the group is as wide as its labels need. When the container is narrower than the labels, their text wraps and the group and key grow to fit; icon-only items keep their size.
- `multiple`: items 2px apart.
- Inside a segmented key, the label's line box can tighten at xs and sm to leave room for the focus border without changing geometry; its font size stays in the size row. Long labels wrap and increase the group's height.
- Use the existing `md` size for a labeled layout choice at the top of a settings popover: a 32px group, 28px selected face and 16px icons. Keep `sm` (24px) for dense contexts; do not invent a height between the size rows.
- Without `multiple`: a quiet `well` and contrasting `key` fill, with no visible group or selected-key border in normal colors. The selected label and icon use `text`; hover only changes label and icon contrast, without adding a fill or moving the key. Focus reuses `mu-focus`; do not add a component-specific focus treatment. In forced colors the selected key retains its text-colored border. The key slides to the chosen item over `duration-settle` with `ease-settle` and re-measures when an item changes width. Under reduced motion it jumps. On touch screens every item reserves at least 44px in each direction, without overlapping its neighbor.
