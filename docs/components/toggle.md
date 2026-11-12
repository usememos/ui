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
  variant?: "ghost" | "soft"; // default "ghost", preserving the flat off state
  shape?: "default" | "pill"; // default "default"; icon-only pills are circular
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

- Default (`variant="ghost"`): off: flat `text-secondary`, with `hover` on hover. On: a `well` fill and the `text` color, with a transparent reserved border; hover keeps that selected fill. Fill and text changes are immediate. Hover never adds a boundary; keyboard focus reuses `mu-focus`.
- `variant="soft"`: off uses `hover` and `text-secondary`; hover uses `well` and `text`; on uses the distinct `selected` fill and `text`, retained on hover. The reserved border stays transparent; focus still uses `mu-focus`. No application `data-pressed` color rules are needed.
- `shape="pill"` uses `radius-full` and equal size-row horizontal padding. An icon-only pill is circular. Heights, icon sizes and 44px touch targets stay unchanged.
- Disabled soft toggles use `text-disabled` and `well` when off; an on toggle keeps `selected`. Neither responds to hover.
- Disabled default toggles: `text-disabled`; an on Toggle keeps its well and transparent border. In forced colors an on Toggle uses a system-colored boundary so selection survives when fills disappear.
- For emoji, keep the Lucide-only `icon` slot empty. Compose a span in `children`, hide the emoji from assistive technology when the control has an `aria-label`, and use the documented [compact reaction picker](popover.md#compact-reaction-picker) layout for a square emoji cell. This does not rely on the internal icon-only class.
- A label wraps when its row runs out of room; an icon-only toggle never shrinks. A ToggleGroup is at most as wide as its container and grows in height to keep long translated labels readable. On touch screens each Toggle reserves at least 44px in each direction.
