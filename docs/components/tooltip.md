# Tooltip

A tooltip names an icon-only control and shows its shortcut. It is a small `primary` label with `on-primary` text, shown after 400ms of hover or at once on keyboard focus.

## Props

```ts
interface TooltipProps {
  content: React.ReactNode; // two or three words
  shortcut?: string;
  side?: "top" | "bottom";
  delay?: number; // default 400
  defaultOpen?: boolean;
  children: React.ReactElement; // one focusable child
}
```

## Guidelines

- Every icon-only Button and Toggle gets one, with the same text as its `aria-label`.
- Never put essential information only in a tooltip.
- The shortcut sits after the label at 65% opacity.
