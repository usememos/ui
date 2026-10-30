# Kbd

Shows one keyboard key in help text, menus and empty states.

## Example

```tsx
import { Kbd } from "@usememos/ui";

<p>Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search</p>
```

## Props

```ts
interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode; // one key: "⌘", "Enter", "/"
  render?: React.ReactElement;
}
```

Renders a `<kbd>`.

## Rules

- One key per Kbd. Put a space between the keys of a shortcut.
- Use symbols for modifiers on macOS (⌘ ⌥ ⇧) and words elsewhere (Ctrl, Alt, Shift).

## Style

- A tiny raised key, `control-xs` (20px) tall, `label-xs` text (12px) in `ink-muted`.
