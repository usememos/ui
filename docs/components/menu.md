# Menu

A menu lists actions for one thing, opened from a trigger. It is also the pattern for slash and block menus in an editor.

## Props

```ts
interface MenuItem {
  value: string;
  label: React.ReactNode;
  icon?: IconElement;
  shortcut?: string;
  description?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  checked?: boolean;  // makes it a checkbox item
  radio?: boolean;    // with checked: one-of-many
  keepOpen?: boolean; // stay open while people toggle
}

interface MenuProps {
  items: (MenuItem | { separator: true } | { heading: string })[];
  trigger?: React.ReactElement; // default: a ghost "More" button with an Ellipsis icon
  onAction?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  align?: "start" | "end";
  size?: Size;
  "aria-label"?: string;
}
```

## Guidelines

- Every item needs a `value`, and `onAction` receives it. Labels can repeat; values can't.
- Rows are 32px at md: a 16px `ink-muted` icon, the label, and the shortcut right-aligned in `ink-muted`.
- The menu is a `mu-popup` with `radius-xl`, at least 200px wide, with `space-1` padding.
- The highlighted row uses `hover`. Arrow keys move the highlight; Escape and outside clicks close.
- Put destructive items last, after a separator, in `danger`. Confirm them with a [Dialog](dialog.md).
- Under `breakpoint-sm`, menus open as sheets.
