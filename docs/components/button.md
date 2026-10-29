# Button

Starts an action.

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
  loadingLabel?: string; // accessible name while loading, such as "Saving"
}

function buttonClasses(options?: { variant?: ButtonVariant; size?: Size; iconOnly?: boolean }): string;
```

Wraps Base UI's [Button](https://base-ui.com/react/components/button): `disabled`, `focusableWhenDisabled`, `render`, `nativeButton` and native button attributes pass through. Renders `<button type="button">`.

## Rules

- Label with a verb in sentence case ("Save", "Copy link"). With only an `icon`, pass `aria-label` and add a [Tooltip](tooltip.md) with the same text.
- `primary`: the one action a view exists for, at most one per view. `neutral`: every other action. `ghost`: toolbars, dense rows, the "More actions" trigger. `danger`: confirming a destructive action inside a dialog, never as a first click.
- Use `loading` for any action that waits on a server.
- A link that should look like a button stays an `<a>` with `buttonClasses()`; Base UI doesn't render links through Button:

  ```tsx
  <a className={buttonClasses({ variant: "primary" })} href="/start">Get started</a>
  ```

- Prefer saying why an action is unavailable over disabling it.

## Style

- A raised key: 24, 32, 40px tall. `primary` is an ink key with `on-primary` text; `neutral` a `key` with a soft edge; `ghost` flat `ink-muted` with `hover` on hover; `danger` a `danger-key` with `on-danger` text.
- Only an icon: square. The icon side has 2px less padding.
- Press moves the key down 0.5px and swaps its shadow for `shadow-pressed`; a ghost button sinks into a `well`. Under reduced motion the key doesn't move; the shadow still changes.
- `loading` keeps the width, shows a Spinner over the label, sets `aria-busy` and `aria-disabled`, ignores presses and stays focusable.
- Disabled: 45% opacity.
