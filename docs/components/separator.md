# Separator

A line between groups of content, horizontal or vertical.

## Example

```tsx
import { Separator } from "@usememos/ui";

<Separator />
<Separator orientation="vertical" />
```

## Props

```ts
interface SeparatorProps extends BaseSeparator.Props {
  orientation?: "horizontal" | "vertical"; // default "horizontal"
}
```

Wraps Base UI's [Separator](https://base-ui.com/react/components/separator): a `<div role="separator">` with `aria-orientation`.

## Rules

- Prefer space over lines. Use a separator only where `space-6` alone doesn't make the groups clear.
- In a [ToggleGroup](toggle-group.md), a vertical Separator splits clusters. Menus use `Menu.Separator`.

## Style

- 1px `line`. A vertical separator stretches to the height of its row.
