# Spinner

A spinner says that something short is in progress. It is a ring in `currentColor` with one gap, at the icon stroke width of its size, turning once every `duration-spin` (0.8s).

## Example

```tsx
import { Spinner } from "@usememos/ui";

<Spinner label="Loading notes" />
```

## Props

```ts
interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: Size;    // 14, 16, 20px; defaults to the surrounding Root's size, else md
  label?: string; // for screen readers, default "Loading"
  render?: React.ReactElement; // plus Base UI's render prop
}
```

It renders a `<span role="status">` named by `label`.

## Guidelines

- For a wait inside a control, use the control's `loading` prop instead; it places the spinner for you.
- For content that is loading, use [Skeleton](skeleton.md), so the layout doesn't jump.
- Never show a spinner for less than about 300ms. Let short waits pass silently.
