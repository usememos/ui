# Skeleton

Holds the place of content that is still loading.

## Example

```tsx
import { Skeleton } from "@usememos/ui";

<Skeleton round />
<Skeleton width="40%" />
<Skeleton />
```

## Props

```ts
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number | string;  // default: full width (round: its height)
  height?: number | string; // default: one line of text at `size` (round: the control height)
  round?: boolean;          // for avatars
  size?: Size;
  render?: React.ReactElement;
}
```

## Rules

- Match the shape of what is coming: one bar per line of text, a circle for an avatar, a block for an image. The layout must not jump when content arrives.
- Use skeletons for lists and pages, and [Spinner](spinner.md) for a control that is waiting.
- Skeletons are hidden from screen readers. Set `aria-busy` on the loading region.

## Style

- A `well` block that shimmers once every `duration-shimmer`. The shimmer stops under reduced motion.
