# ToggleGroup

A toggle group is a row of related toggles. With `type="multiple"` it is a toolbar of independent on/off toggles. With `type="single"` it is a segmented well with one sliding key: the same control as [Tabs](tabs.md), without a panel.

## Props

```ts
interface ToggleGroupItem { value: string; label: string; icon?: IconElement; }

interface ToggleGroupProps {
  type?: "single" | "multiple";
  items: (ToggleGroupItem | { separator: true; key?: string })[];
  value?: string | string[] | null;
  defaultValue?: string | string[] | null;
  onValueChange?: (value: any) => void;
  size?: Size;
  iconOnly?: boolean; // labels become tooltips and accessible names
  "aria-label"?: string;
}
```

## Guidelines

- One rule for "selected": a single choice among peers is always a raised key in a well. An on/off state is a pressed toggle. Never mix the two in one row.
- **Multiple:** items sit 2px apart. A hairline separator (`{ separator: true }`) splits clusters.
- **Single:** use it for filters and view switches that don't change the whole page. For sections of a page, use Tabs.
- The key slides to the chosen item over `duration-settle` with `ease-settle`.
