# Collapsible

A collapsible hides content behind one row until people ask for it. It is a ghost trigger with a chevron that turns, and the content opens under it.

## Props

```ts
interface CollapsibleProps {
  label: React.ReactNode;
  openLabel?: React.ReactNode; // the label while open, such as "Show less"
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  size?: Size;
}
```

## Guidelines

- Use it for "Show more" on long content, advanced settings and secondary details.
- For several sections that open one at a time, stack collapsibles. There is no Accordion.
- The content fades and rises in. There is no height animation, so long content never stutters.
