# Toggle

Turns one option on or off and stays pressed while on.

## Example

```tsx
import { Toggle } from "@usememos/ui";
import { Pin } from "lucide-react";

<Toggle icon={<Pin />} pressed={pinnedOnly} onPressedChange={setPinnedOnly}>Pinned</Toggle>
```

## Props

```ts
interface ToggleProps extends BaseToggle.Props {
  size?: Size;
  icon?: IconElement; // before the label; alone, the toggle is square
}
```

Wraps Base UI's [Toggle](https://base-ui.com/react/components/toggle): `pressed`, `defaultPressed`, `onPressedChange`, `disabled`, `value` pass through. Renders a `<button aria-pressed>`.

## Rules

- Provide `children`, or an `icon` with `aria-label` and a [Tooltip](tooltip.md) with the same text.
- Use it for toolbar formatting and stacking filters ("Pinned", "Has tasks"). A clickable tag filter is a Toggle, not a Badge.
- Inside a [ToggleGroup](toggle-group.md), `value` names the item in the group's value.
- For a setting that saves at once, use [Switch](switch.md). For one choice among several, use a ToggleGroup without `multiple`.

## Style

- Off: flat `text-secondary`. On: sits in a `well` with the `text` color.
- A label shrinks with an ellipsis when its row runs out of room, as Select's value does; an icon-only toggle never shrinks. A ToggleGroup is at most as wide as its container, so long translated labels truncate instead of overflowing.
