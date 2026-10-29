# Toast

A toast confirms that something happened, or that it failed, without blocking the page. It is a `surface` panel with a tone icon, a title, an optional description and one action.

## Props

```ts
interface ToastProps {
  title: React.ReactNode; // what happened, past tense: "Note archived"
  description?: React.ReactNode;
  tone?: Tone; // default "neutral"
  action?: React.ReactNode; // one small button, often "Undo"
  onClose?: () => void;
}
```

## Guidelines

- Color only marks the icon; the words carry the meaning. Icons: `Info` (neutral), `CircleCheck` (success), `TriangleAlert` (warning), `CircleAlert` (danger).
- Show toasts bottom-right on desktop and bottom-center on mobile, newest on top.
- A toast stays about 5 seconds. Errors stay until dismissed.
- The description uses `body-sm`.
- In the package, a toast manager (Base UI Toast) handles stacking and timing.
