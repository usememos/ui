# Toggle

A toggle turns one option on or off and shows its state by staying pressed. Off, it is flat `ink-muted`. On, it sits in a `well` with `ink` text.

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

`Toggle` wraps Base UI's [Toggle](https://base-ui.com/react/components/toggle), so its props (`pressed`, `defaultPressed`, `onPressedChange`, `disabled`, `value`) pass through. It renders a `<button aria-pressed>`.

Provide `children`, or an `icon` with `aria-label`.

## Guidelines

- Use it for formatting in a toolbar and for filters that stack ("Pinned", "Has tasks"). A clickable tag filter is a Toggle, not a Badge.
- Inside a [ToggleGroup](toggle-group.md), a Toggle is one item; its `value` names it in the group's value.
- For a setting that saves at once, use [Switch](switch.md). For one choice among several, use a ToggleGroup without `multiple`.
- Icon-only toggles have a Tooltip with the same text as the `aria-label`.
