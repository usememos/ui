# Button

A button starts an action. It is a raised key that sinks while pressed, 32px tall at md.

## Props

```ts
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "neutral" | "ghost" | "danger"; // default "neutral"
  size?: Size;
  icon?: IconElement;
  loading?: boolean;
  loadingLabel?: string;
  href?: string;
}
```

Provide `children` (a verb in sentence case: "Save", "Copy link"). With only an `icon`, pass `aria-label`; the button becomes square.

## Variants

| Variant | Looks like | Use for |
| --- | --- | --- |
| `primary` | An ink key with `on-primary` text | The one action a view exists for. At most one per view |
| `neutral` (default) | A `key` with a soft edge | Every other action |
| `ghost` | Flat, `ink-muted`, `hover` on hover | Toolbars, dense rows, the "More actions" trigger |
| `danger` | A `danger-key` with `on-danger` text | Confirming a destructive action inside a dialog. Never as a first click |

## Guidelines

- `loading` keeps the button's width, hides its label, shows a Spinner and makes the button inert. Use it for any action that waits on a server. `loadingLabel` is the accessible name while loading.
- `href` renders an anchor with the same look, for navigation that looks like an action ("Get started", "Open docs"). In the package this uses Base UI's `render` prop.
- The icon side has 2px less padding, so text and icon look centered.
- Press moves the key down 0.5px and swaps its shadow for `shadow-pressed`. A ghost button sinks into a `well` while held.
- Icon-only buttons always have a Tooltip with the same text as the `aria-label`.
