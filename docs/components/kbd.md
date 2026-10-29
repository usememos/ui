# Kbd

A kbd shows a keyboard key in help text, menus and empty states. It is a tiny raised key, 20px tall, in 11px `ink-muted` text (`label-xs`).

## Props

```ts
interface KbdProps {
  children: React.ReactNode; // one key per Kbd: "⌘", "Enter", "/"
}
```

## Guidelines

- Use symbols for modifier keys on macOS (⌘ ⌥ ⇧) and words elsewhere (Ctrl, Alt, Shift).
