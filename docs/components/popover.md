# Popover

A popover shows a small panel of controls next to its trigger, such as a share panel or an editor's link editor. It is a `surface` panel with `shadow-pop`, `radius-xl` and `space-4` padding.

## Props

```ts
interface PopoverProps {
  trigger: React.ReactElement;
  children: React.ReactNode;
  width?: number; // default 280
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  "aria-label"?: string;
}
```

## Guidelines

- Use it for a few controls that belong to one thing. For a list of actions, use [Menu](menu.md). For a decision that blocks the page, use [Dialog](dialog.md).
- Controls inside stack `space-3` apart.
- It closes on Escape and on a click outside.
