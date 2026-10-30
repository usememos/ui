# Spinner

Shows that something short is in progress.

## Example

```tsx
import { Spinner } from "@usememos/ui";

<Spinner label="Loading notes" />
```

## Props

```ts
interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: Size;    // 12, 14, 16px; default: the surrounding Root's size, else md
  label?: string; // for screen readers, default "Loading"
  render?: React.ReactElement;
}
```

Renders a `<span role="status">` named by `label`.

## Rules

- For a wait inside a control, use the control's `loading` prop.
- For content that is loading, use [Skeleton](skeleton.md), so the layout doesn't jump.
- Don't show a spinner for waits under about 300ms.

## Style

- A ring in `currentColor` with one gap, at the icon stroke width of its size, turning once every `duration-spin`.
