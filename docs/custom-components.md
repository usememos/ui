# Building your own component

How an app builds a component the package doesn't ship, so that it looks and behaves like the package's own: Base UI for behavior, the package's class functions and public classes for looks, and tokens for everything else.

An app always has parts the package doesn't ship and shouldn't: product parts (an entry card, a tag pill, an editor's suggestion list) and wrappers around third-party widgets (a date picker, a code editor, a chart). Build them with the steps on this page. Never copy a value out of the package's CSS: copied values don't follow the themes.

## Steps

1. **Use a component if one fits.** Check the [inventory](components/README.md). Compose components, swap a part's element with `render`, or adjust one instance with `className` before building anything.
2. **Behavior from Base UI.** Build anything with focus, keyboard, an open state or a popup on [`@base-ui/react`](https://base-ui.com), as the package does. It is a peer dependency of the package at one exact version, so the app's components and the package's share one copy. Upgrade it only with the package.
3. **Looks from a class function** when the part should look like a component: an anchor that looks like a Button, an editor that looks like a Textarea, a suggestion list that looks like a Menu. See [Class functions](#class-functions).
4. **Otherwise, from the public classes and tokens.** Size the part with a size row class and read the [row variables](#row-variables); give it depth with a [depth class](depth.md); set text with a [type class](typography.md); color it with `var(--mu-<token>)` or the [Tailwind utilities](#tailwind-css).
5. **Check it like a component.** It works in Light, Dark and High contrast and under reduced motion; text keeps 4.5:1 contrast; focus shows on `:focus-visible` (`mu-focus`); touch targets reach 44px (`mu-hit`); icon-only controls have an `aria-label` and a [Tooltip](components/tooltip.md).

## Class functions

A class function returns the classes that make any element look like a component, the same classes the component uses, so the two can't drift apart. Functions for single components return a string; functions for components made of parts return one string per part. Add the app's own classes after them.

| Function | Returns | For an app's own |
| --- | --- | --- |
| `buttonClasses({ variant, size, iconOnly })` | A string | Anchor that looks like an action |
| `inputClasses({ size })` | A string | One-line field, such as a tag input around a native `<input>` |
| `textareaClasses({ size })` | A string | Multi-line field, such as a content-editable editor |
| `badgeClasses({ tone })` | A string | Label, such as a tag that is also a link |
| `menuClasses({ size })` | `popup`, `item`, `dangerItem`, `label`, `shortcut`, `separator`, `groupLabel` | Floating list, such as an editor's suggestion list |
| `popoverClasses()` | `popup`, `title`, `description` | Floating panel, such as an emoji picker |

State is set with attributes, never with extra classes:

- A field shows the focus ring when it or anything inside it has focus. `aria-invalid="true"` shows the error edge, and `aria-disabled="true"` dims it.
- A menu row is highlighted while it has `data-highlighted`, and dimmed with `data-disabled`. Base UI sets both; a list the app drives itself sets them on the active row.
- A popup fades in with `data-starting-style` and out with `data-ending-style`, which Base UI's popups set.

```tsx
import { badgeClasses, menuClasses, textareaClasses } from "@usememos/ui";

<a className={badgeClasses()} href="/tags/work">work</a>

<div className={textareaClasses()} contentEditable role="textbox" aria-multiline="true" aria-label="Note" />

const menu = menuClasses({ size: "sm" });

<div className={menu.popup} role="listbox">
  {matches.map((tag, index) => (
    <div key={tag} className={menu.item} role="option" aria-selected={index === active} data-highlighted={index === active ? "" : undefined}>
      <span className={menu.label}>{tag}</span>
    </div>
  ))}
</div>
```

A popup built this way still needs its behavior from Base UI or the editor it belongs to: positioning, dismissal and focus. Put the positioner on the popup layer with `mu-positioner`. Inside a host page or a shadow root, render it inside the `.mu-root` element or the shadow root, or it loses the tokens (see [Scoping inside a host page](building.md#scoping-inside-a-host-page)).

## Public classes

Apply these classes to an app's own elements. Don't override their rules: the products would drift apart, and the package's tests cover only its own values. Every other `mu-*` class, such as a component part's `mu-menu-item`, is internal; reach it through a class function.

| Class | What it applies | Use it for |
| --- | --- | --- |
| `mu-s-xs` | The xs size row: 20px | Secondary actions beside 13px text |
| `mu-s-sm` | The sm size row: 24px | Dense toolbars, table rows, filters |
| `mu-s-md` | The md size row: 32px | Everything else |
| `mu-base` | The system font, the row's text size and weight 500, `ink` text, and icon sizing for Lucide icons inside | The root of a control |
| `mu-recessed` | `well`, a 1px `edge` and `shadow-track` | A part that holds a value |
| `mu-key` | A `key` with the sheen and `shadow-key` | A key inside a well |
| `mu-raised` | A `key` with the sheen and `shadow-raised` | A part you press |
| `mu-popup` | `surface`, `shadow-pop` and `radius-xl` | A part that floats |
| `mu-popup-motion` | The popup fade and rise, none under reduced motion | A popup Base UI opens |
| `mu-positioner` | The popup layer | A popup's positioner |
| `mu-focus` | The focus ring on `:focus-visible` | Anything focusable |
| `mu-hit` | An invisible 44px touch target on `pointer: coarse` | Anything pressable smaller than 44px |
| `mu-icon` | Icon size and stroke | A Lucide icon outside a control |
| `mu-visually-hidden` | Hidden on screen, read by screen readers | Text for screen readers only |
| `mu-label-xs` | 12 / 16px, 500 | Labels of 20px parts |
| `mu-caption` | 13 / 18px, 400 | Secondary text |
| `mu-label-sm` | 13 / 18px, 500 | Small labels |
| `mu-body` | 14 / 20px, 400 | Body text |
| `mu-label` | 14 / 20px, 500 | Labels and buttons |
| `mu-title` | 16 / 24px, 500 | Section titles |
| `mu-heading` | 20 / 28px, 500 | The page title |
| `mu-display` | 32 / 40px, 500 | A website hero only |

## Row variables

A size row class sets these variables on its element, and children inherit them. Read them in the app's CSS to match the package's rows; never set them. The values are those in [Control sizes](layout.md#control-sizes).

| Variable | xs | sm | md |
| --- | --- | --- | --- |
| `--mu-row-height` | 20px | 24px | 32px |
| `--mu-row-padding` | 6px | 8px | 12px |
| `--mu-row-padding-icon` | 4px | 6px | 10px |
| `--mu-row-font-size` | 12px | 13px | 14px |
| `--mu-row-line-height` | 16px | 18px | 20px |
| `--mu-row-radius` | 4px | 4px | 6px |
| `--mu-row-gap` | 4px | 4px | 6px |
| `--mu-row-icon` | 12px | 14px | 16px |
| `--mu-row-icon-stroke` | 1.25px | 1.25px | 1.5px |
| `--mu-row-check-box` | 14px | 16px | 18px |

`--mu-row-padding-icon` is the padding on the side of a control that starts or ends with an icon.

```css
.app-tag-input-chip {
  height: calc(var(--mu-row-height) - 2 * var(--mu-inset));
  padding: 0 var(--mu-row-padding-icon);
  border-radius: var(--mu-row-radius);
}
```

## Tailwind CSS

An app on Tailwind CSS v4 loads `tailwind.css` after the package's other stylesheets:

```css
@layer theme, base, mu, components, utilities;
@import "tailwindcss";
@import "@usememos/ui/tokens.css";
@import "@usememos/ui/styles.css";
@import "@usememos/ui/tailwind.css";
```

It maps the 26 color tokens, five shadow tokens, seven radius tokens and three font tokens to utilities with an `mu-` prefix, so they never clash with an app's own colors:

| Token | Utility |
| --- | --- |
| A color, such as `surface` | `bg-mu-surface`, `text-mu-ink-muted`, `border-mu-edge`, and every other color utility |
| A shadow, such as `shadow-raised` | `shadow-mu-raised` |
| A radius, such as `radius-md` | `rounded-mu-md` |
| A font, such as `font-mono` | `font-mu-mono` |

- Each utility reads the token where it is used, so a `.mu-root` with its own `data-theme` recolors the utilities inside it.
- Spacing needs no mapping: Tailwind's step is 0.25rem, which is the 4px grid, so `p-3` is `space-3`. Don't use half steps such as `p-0.5`; the only 2px value is `inset`.
- Text uses the type classes (`mu-body`), not Tailwind's text sizes.
- `tailwind-merge` doesn't know `mu-` classes and keeps them next to a utility. The utility still wins, because the package's styles sit in the `mu` [cascade layer](building.md#cascade-layer).
