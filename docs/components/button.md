# Button

A button starts an action. It is a raised key that sinks while pressed, 32px tall at md.

## Example

```tsx
import { Button } from "@usememos/ui";
import { Plus } from "lucide-react";

<Button variant="primary" icon={<Plus />}>New note</Button>
```

## Props

```ts
interface ButtonProps extends BaseButton.Props {
  variant?: "primary" | "neutral" | "ghost" | "danger"; // default "neutral"
  size?: Size;
  icon?: IconElement;
  loading?: boolean;
  loadingLabel?: string;
}

function buttonClasses(options?: { variant?: ButtonVariant; size?: Size; iconOnly?: boolean }): string;
```

`Button` wraps Base UI's [Button](https://base-ui.com/react/components/button), so its props (`disabled`, `focusableWhenDisabled`, `render`, `nativeButton`) and the native button attributes pass through. It renders `<button type="button">`.

Provide `children` (a verb in sentence case: "Save", "Copy link"). With only an `icon`, pass `aria-label`; the button becomes square.

## Variants

| Variant | Looks like | Use for |
| --- | --- | --- |
| `primary` | An ink key with `on-primary` text | The one action a view exists for. At most one per view |
| `neutral` (default) | A `key` with a soft edge | Every other action |
| `ghost` | Flat, `ink-muted`, `hover` on hover | Toolbars, dense rows, the "More actions" trigger |
| `danger` | A `danger-key` with `on-danger` text | Confirming a destructive action inside a dialog. Never as a first click |

## Links that look like buttons

A link navigates, so it stays an `<a>`; Base UI doesn't render links through Button. Put `buttonClasses()` on the anchor (or on a router's link component) instead:

```tsx
<a className={buttonClasses({ variant: "primary" })} href="/start">Get started</a>
```

## Guidelines

- `loading` keeps the button's width, shows a Spinner over the label, and ignores presses while staying focusable (`aria-busy`, `aria-disabled`). Use it for any action that waits on a server. `loadingLabel` replaces the accessible name while loading ("Saving").
- The icon side has 2px less padding, so text and icon look centered.
- Press moves the key down 0.5px and swaps its shadow for `shadow-pressed`. A ghost button sinks into a `well` while held. Under reduced motion the key doesn't move; the shadow still changes.
- Disabled buttons fade to 45% and stay in place. Prefer explaining why an action is unavailable.
- Icon-only buttons always have a Tooltip with the same text as the `aria-label`.
