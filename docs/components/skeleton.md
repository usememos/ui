# Skeleton

A skeleton holds the place of content that is still loading. It is a `well` block that shimmers once every `duration-shimmer` (1.4s).

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
  width?: number | string;  // default: full width (a round one: its height)
  height?: number | string; // default: one line of text at `size` (a round one: the control height)
  round?: boolean;          // for avatars
  size?: Size;
  render?: React.ReactElement;
}
```

## Guidelines

- Match the shape of what is coming: one bar per line of text, a circle for an avatar, a block for an image. The layout must not jump when content arrives.
- Use skeletons for lists and pages, and [Spinner](spinner.md) for a control that is waiting.
- Skeletons are hidden from screen readers. Announce loading on the region instead (`aria-busy`).
- Under `prefers-reduced-motion`, the shimmer stops.
