# Spinner

A spinner says that something short is in progress. It is a 1.5px ring in `currentColor` with one gap, turning once every 0.8s.

## Props

```ts
interface SpinnerProps {
  size?: Size;    // 14, 16, 20px
  label?: string; // for screen readers, default "Loading"
}
```

## Guidelines

- For a wait inside a control, use the control's `loading` prop instead; it places the spinner for you.
- For content that is loading, use [Skeleton](skeleton.md), so the layout doesn't jump.
- Never show a spinner for less than about 300ms. Let short waits pass silently.
