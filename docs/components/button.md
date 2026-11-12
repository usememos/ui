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
  icon?: IconElement;    // before the label
  iconEnd?: IconElement; // after the label: "Show more" with a chevron, "Next" with an arrow
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
- `iconEnd` says where the action leads or that it opens something (a chevron, an arrow). Don't put an icon in `children`: the label is one text span, so it would wrap. Use `icon` for what the action is.
- A link that should look like a button stays an `<a>` with `buttonClasses()`; Base UI doesn't render links through Button:

  ```tsx
  <a className={buttonClasses({ variant: "primary" })} href="/start">Get started</a>
  ```

- Prefer saying why an action is unavailable over disabling it.
- Over a photo or video (an image viewer's close and arrows, a cover's edit button), use `neutral` Buttons inside an element with `data-theme="dark"`, so they are dark keys whatever the app's theme. There is no media variant. See [the recipe](../usage.md#buttons-over-a-photo).

## Style

- A flat control: 20, 24 or 32px tall. `primary` is an ink key with `on-primary` text; `neutral` a `key` with a quiet `edge` boundary; `ghost` flat `text-secondary` with `hover` on hover; `danger` a `danger-key` with `on-danger` text.
- A neutral button keeps its quiet `edge` on hover; its `key-hover` fill provides feedback. Keyboard focus changes the 1px edge to ink; filled actions retain their contrasting focus edge.
- Only an icon: square. The side with an icon (`icon` at the start, `iconEnd` at the end) has 2px less padding.
- Hover and press reuse one immediate highlight: `key-hover` for neutral, `hover` for ghost, `primary-hover` for primary; danger retains `danger-key`. Holding the pointer adds no new boundary. Keyboard focus owns the contrasting edge. No color fade, translation, scale or brightness filter.
- `loading` immediately sets `aria-busy` and `aria-disabled`, ignores presses and stays focusable. The label stays visible for 300ms; if still loading, a Spinner replaces it without changing width. Finishing cancels the delay and restores the label immediately.
- Disabled: every variant uses `text-disabled` text, a `well` fill and a quiet `edge`, including ghost buttons. This keeps disabled toolbar actions distinct from enabled ghost actions without dimming the text. Opacity stays 1.
