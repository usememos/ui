# Building on it

How the package is put together and how products use it.

## Stack

- **React components on [Base UI](https://base-ui.com).** Base UI provides behavior: focus management, keyboard support, ARIA, portals and positioning. Memos UI provides the styling, the tokens and the component API. `@base-ui/react` is a peer dependency at one exact version, so an app's own Base UI components share the package's copy.
- **No shadcn.** Don't depend on shadcn, don't copy its code, and don't use shadcn-compatible names for components or tokens. Following a similar layering (unstyled behavior below, styled components above) is fine.
- **One npm package**, `@usememos/ui`, used by every product. ESM only, React 18 and 19, one JS entry point, two stylesheets and a Tailwind CSS theme file.
- **Plain CSS on tokens.** Components are styled with CSS that reads token variables. Product code uses tokens through their CSS variables (`var(--mu-well)`) and never copies raw values.
- **Lucide icons** from `lucide-react`. See [Icons](icons.md).
- **No fonts.** Text uses the system UI font; nothing is downloaded.

## Loading the CSS

Load the tokens first, then the styles:

```ts
import "@usememos/ui/tokens.css";
import "@usememos/ui/styles.css";
```

An app on Tailwind CSS v4 also loads `@usememos/ui/tailwind.css`, which maps the tokens to `mu-` utilities (`bg-mu-surface`). See [Tailwind CSS](custom-components.md#tailwind-css).

`tokens.css` defines every token on `:root`, on a shadow root's `:host`, and on any element with the `mu-root` class. `styles.css` holds the foundation classes and every component's styles.

Every token is a custom property named `--mu-<token>`, so the `surface` token is `var(--mu-surface)`. The prefix keeps the tokens apart from an app's own variables and from those of a CSS framework.

### Cascade layer

Both stylesheets sit in one [cascade layer](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer) named `mu`. Unlayered CSS always wins over layered CSS, so an app's own rules override a component without a specificity fight: a `className` on a `Button` that sets `width` wins over the button's own rule.

When the app also puts its CSS in layers, declare the order once, before any import, so that `mu` comes after resets and before the app's components and utilities. For an app on Tailwind CSS v4:

```css
@layer theme, base, mu, components, utilities;
@import "tailwindcss";
@import "@usememos/ui/tokens.css";
@import "@usememos/ui/styles.css";
```

Without that line, the layer seen first is the weakest. A reset loaded after `styles.css` would then override the components.

## Scoping inside a host page

Inside another page (the web clipper, an embed), mount the UI under a `.mu-root` element or inside a shadow root, so neither side's styles leak into the other. The package has no global selectors beyond `:root`, `:host` and `.mu-root`.

## Choosing a theme

Set `data-theme="light" | "dark" | "contrast"` on the root element or on any `.mu-root`. Without the attribute the tokens are Light. The app, not the package, reads `prefers-color-scheme` and the user's saved choice. See [Color](color.md#themes). An app can add its own themes on top of these three; see [App themes](color.md#app-themes).

An app changes only the color, shadow and font tokens. Every other token and every `mu-*` class rule is internal. See [What an app can change](color.md#what-an-app-can-change).

## Class names

- Every class the package ships starts with `mu-`.
- The [public classes](custom-components.md#public-classes) are for apps too: size rows (`mu-s-md`), depth roles (`mu-raised`), focus, touch targets, icons and the type scale. Apps apply them to their own parts and never override them.
- `mu-positioner` puts a popup's positioner on `layer-popup`, and `mu-popup-motion` makes a popup fade in and rise `space-1` (no rise under reduced motion).
- The depth classes `mu-recessed`, `mu-key`, `mu-raised` and `mu-popup` apply a whole depth role. Use them for new parts before writing new shadows. See [Depth](depth.md).
- `mu-prose` styles rendered content. See [Prose](components/prose.md).
- `mu-icon` applies icon size and stroke rules outside a component.
- `mu-visually-hidden` hides text visually but keeps it for screen readers.
- A size row class sets the `--mu-row-*` variables (height, padding, text, radius, gap, icon) that every part inside reads. See [Row variables](custom-components.md#row-variables).
- Component part classes (`mu-menu-item`) are internal. An app reaches a component's look through its class function (`menuClasses()`). See [Class functions](custom-components.md#class-functions).

## Writing component CSS

Inside the package, source order decides which rule wins: a rule later in `styles.css` overrides an earlier one on the same element. Selector weight must not get in the way.

- Put every `:has()` inside `:where()`: write `.mu-button:where(:has(> svg:first-child))`, not `.mu-button:has(> svg:first-child)`. A `:has()` takes the specificity of its argument, so the bare form scores (0,2,1) and beats a later `.mu-button.mu-button-icon` (0,2,0), whatever the order.
- A modifier rule (a variant, an `-icon` class, a context like `.mu-segmented > .mu-toggle`) comes after the base rule it changes, and its selector weighs at least as much.

`packages/ui/test/cascade.test.ts` fails when a `:has()` adds specificity, and when an earlier rule outranks a later rule that adds a class to the same element and sets the same property. `e2e/icons.spec.ts` checks the result in the browser: icon-only buttons and toggles are squares with the icon centered, in every size.

## API conventions

Components follow the conventions of established React libraries (Base UI, Radix, React Aria), not the needs of one product. Each [component page](components/README.md) lists its parts and their props.

### Parts

A component made of more than one element is a namespace of styled parts. Part names are Base UI's, so anyone who knows Base UI knows the anatomy:

```tsx
import { Menu, Button } from "@usememos/ui";
import { Ellipsis, Pin, Trash2 } from "lucide-react";

<Menu.Root>
  <Menu.Trigger render={<Button variant="ghost" icon={<Ellipsis />} aria-label="More actions" />} />
  <Menu.Popup align="end">
    <Menu.Item icon={<Pin />}>Pin</Menu.Item>
    <Menu.Separator />
    <Menu.Item icon={<Trash2 />} danger>Delete</Menu.Item>
  </Menu.Popup>
</Menu.Root>
```

- **Base UI's names.** `Root`, `Trigger`, `Popup`, `Item`, `Title`, `Description`, `Close`, `Panel` and so on. No shadcn names (`DropdownMenuContent`, `CardHeader`).
- **One `Popup` per overlay.** Base UI's `Portal`, `Positioner` and `Backdrop` are folded into our `Popup`. It takes `side`, `align`, Base UI's other placement behavior (`anchor`, `sticky`, `collisionAvoidance`, `collisionBoundary`, `positionMethod`, `disableAnchorTracking`) and its portal `container`, and draws the backdrop where the component has one (Dialog). The gap to the trigger and the distance kept from the viewport edge are fixed by the system (4px for menus and lists, 6px for popovers and tooltips; Base UI's default edge distance), so `sideOffset`, `alignOffset` and `collisionPadding` are not props.
- **Indicators are built in.** The check in a menu or select item, the chevron in a select trigger and the knob in a switch render by themselves. See [built-in glyphs](icons.md#built-in-glyphs).
- **One element, one component.** Button, Input, Textarea, Badge, Kbd, Separator, Spinner, Skeleton, Link, Checkbox, Switch and Toggle are single components, not namespaces.
- **No data props.** Collections are built from parts (`Menu.Item`, `Select.Item`, `Tabs.Tab`), not passed as `items` or `options` arrays.

### Props

- **`size`**: `"xs" | "sm" | "md"`, default `"md"`. `xs` only on the components listed in [Control sizes](layout.md#control-sizes); the rest take `"sm" | "md"`. There is no `lg`: a bigger control is not a stronger one, and apps hardly need it. One prop sets height, padding, text, icon size and radius together. On a namespace, set it on `Root`; every part reads it from context.
- **Controlled or uncontrolled**, with Base UI's prop names:
  - `value` + `onValueChange`, or `defaultValue` (Select, Combobox, Tabs, ToggleGroup, RadioGroup)
  - `checked` + `onCheckedChange`, or `defaultChecked` (Checkbox, Switch, Menu.CheckboxItem)
  - `pressed` + `onPressedChange`, or `defaultPressed` (Toggle)
  - `open` + `onOpenChange`, or `defaultOpen` (Menu, Dialog, AlertDialog, Popover, Tooltip, Collapsible, Select, Combobox)
- **`icon`** takes a Lucide element (`icon={<Pin />}`), never a string name.
- **`render`** on every component and part swaps the rendered element, as in Base UI: a router's link in `Link`, a Button as a `Menu.Trigger`. Base UI doesn't render links through Button; a link that looks like a button is an anchor with `buttonClasses()` (see [Button](components/button.md#rules)).
- **`className` and `style`** pass through to the part's element, after our classes.
- **Accessible names.** A control without a visible label takes `aria-label`. Icon-only controls always do.
- **`tone`**: `"neutral" | "success" | "warning" | "danger"` on status components (Badge, toasts).
- **`variant`** is for Button only: `"primary" | "neutral" | "ghost" | "danger"`.
- **Native props pass through** to the element a component or part renders.

### Styling hooks

- Every part has a class `mu-<component>-<part>` (`mu-menu-popup`, `mu-menu-item`), plus `mu-<component>` on single components. Variants are classes too (`mu-button-primary`, `mu-badge-success`), so a class function can style any element.
- **Class functions.** A component whose look apps put on their own elements exports `<component>Classes()`: `buttonClasses`, `inputClasses`, `textareaClasses`, `badgeClasses`, `menuClasses` and `popoverClasses`. It returns a string for a single component and one string per part for a namespace. The component builds its own classes with it, so the two can't drift. See [Class functions](custom-components.md#class-functions).
- State is styled through Base UI's data attributes (`data-highlighted`, `data-checked`, `data-pressed`, `data-disabled`, `data-open`, `data-starting-style`, `data-ending-style`), never through extra classes.

### Toasts

Wrap the app in `Toast.Provider`, render `Toast.Viewport` once, and create toasts with Base UI's manager:

```tsx
const toast = Toast.useToastManager();
toast.add({ title: "Note archived", type: "success" });
```

## Shared styles for content

`Prose` is one stylesheet shared by every place content is rendered or edited, including the editor (`@usememos/editor`). Content never shifts between editing and reading.

## What every new component needs

1. A reason: a screen in a product needs it, and no existing component or pattern covers it.
2. A generic name and API that would make sense in any of our products.
3. Tokens only: no raw colors, sizes or shadows.
4. Both sizes, all [states](states.md), all three themes, and reduced motion.
5. Keyboard and screen reader behavior from Base UI.
6. A page in `docs/components/` and an entry in the [inventory](components/README.md).
