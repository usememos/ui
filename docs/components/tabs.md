# Tabs

Tabs switch between sections of the same page. The tab list is a recessed well, and the selected tab is a raised key that slides to the one you pick.

## Props

```ts
interface TabsProps {
  items: { value: string; label: React.ReactNode; icon?: IconElement; content?: React.ReactNode }[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  size?: Size;
  "aria-label"?: string;
}
```

## Guidelines

- Tabs and a single-choice [ToggleGroup](toggle-group.md) share one segmented well, so "one of these" always looks the same.
- Tabs are sized to their labels, not split equally. The key re-measures when a label changes width.
- Selected and hovered labels are `ink`; others are `ink-muted`. The weight never changes, so labels don't shift.
- Left and Right arrow keys move between tabs.
- Use tabs for sections of a page, not for site navigation.
