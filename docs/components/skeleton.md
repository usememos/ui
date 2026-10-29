# Skeleton

A skeleton holds the place of content that is still loading. It is a `well` block that shimmers once every 1.4s.

## Props

```ts
interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  round?: boolean; // for avatars
  size?: Size;
  style?: React.CSSProperties;
}
```

## Guidelines

- Match the shape of what is coming: one bar per line of text, a circle for an avatar, a block for an image. The layout must not jump when content arrives.
- Use skeletons for lists and pages, and [Spinner](spinner.md) for a control that is waiting.
- Skeletons are hidden from screen readers. Announce loading on the region instead (`aria-busy`).
- Under `prefers-reduced-motion`, the shimmer stops.
