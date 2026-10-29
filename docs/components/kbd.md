# Kbd

A kbd shows a keyboard key in help text, menus and empty states. It is a tiny raised key, 20px tall, in 11px `ink-muted` text (`label-xs`).

## Example

```tsx
import { Kbd } from "@usememos/ui";

<p>Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search</p>
```

## Props

```ts
interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode; // one key per Kbd: "⌘", "Enter", "/"
  render?: React.ReactElement;
}
```

It renders a `<kbd>`.

## Guidelines

- One key per Kbd. Put a space between the keys of a shortcut.
- Use symbols for modifier keys on macOS (⌘ ⌥ ⇧) and words elsewhere (Ctrl, Alt, Shift).
