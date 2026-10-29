# Toggle

A toggle turns one option on or off and shows its state by staying pressed. Off, it is flat `ink-muted`. On, it sits in a `well` with `ink` text.

## Props

```ts
interface ToggleProps {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  icon?: IconElement;
  size?: Size;
  disabled?: boolean;
  "aria-label"?: string;
  children?: React.ReactNode;
}
```

Provide `children`, or an `icon` with `aria-label`.

## Guidelines

- Use it for formatting in a toolbar and for filters that stack ("Pinned", "Has tasks"). A clickable tag filter is a Toggle, not a Badge.
- For a setting that saves at once, use [Switch](switch.md). For one choice among several, use [ToggleGroup](toggle-group.md) with `type="single"`.
- Icon-only toggles have a Tooltip with the same text as the `aria-label`.
