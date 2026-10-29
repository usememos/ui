# Separator

A separator is a 1px `line` between groups of content, horizontal or vertical.

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

It wraps Base UI's [Separator](https://base-ui.com/react/components/separator): a `<div role="separator">` with `aria-orientation`. A vertical separator stretches to the height of its row.

## Guidelines

- Prefer space over lines. Use a separator only where `space-6` alone doesn't make the groups clear.
- Menus and toolbars have their own separator parts (`Menu.Separator`).
