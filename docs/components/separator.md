# Separator

A separator is a 1px `line` between groups of content, horizontal or vertical.

## Props

```ts
interface SeparatorProps {
  orientation?: "horizontal" | "vertical"; // default "horizontal"
}
```

## Guidelines

- Prefer space over lines. Use a separator only where `space-6` alone doesn't make the groups clear.
- Menus and toolbars use their own separators (`{ separator: true }` items).
