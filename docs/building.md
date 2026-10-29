# Building on it

How the package is put together and how products use it.

## Stack

- **React components on [Base UI](https://base-ui.com).** Base UI provides behavior: focus management, keyboard support, ARIA, portals and positioning. Memos UI provides the styling, the tokens and the component API.
- **No shadcn.** Don't depend on shadcn, don't copy its code, and don't use shadcn-compatible names for components or tokens. Following a similar layering (unstyled behavior below, styled components above) is fine.
- **One npm package**, `@usememos/ui`, used by every product. ESM only, React 18 and 19, one JS entry point and two stylesheets.
- **Plain CSS on tokens.** Components are styled with CSS that reads token variables. Product code uses tokens through their CSS variables (`var(--well)`) and never copies raw values.
- **Lucide icons** from `lucide-react`. See [Icons](icons.md).
- **Inter variable** shipped as a local `woff2`. No remote fonts.

## Loading the CSS

Load the tokens first, then the styles:

```ts
import "@usememos/ui/tokens.css";
import "@usememos/ui/styles.css";
```

`tokens.css` defines every token on `:root`, on a shadow root's `:host`, and on any element with the `mu-root` class. `styles.css` holds the foundation classes and every component's styles.

## Scoping inside a host page

Inside another page (the web clipper, an embed), mount the UI under a `.mu-root` element or inside a shadow root, so neither side's styles leak into the other. The package has no global selectors beyond `:root`, `:host` and `.mu-root`.

## Choosing a theme

Set `data-theme="light" | "dark" | "contrast"` on the root element or on any `.mu-root`. Without the attribute the tokens are Light. The app, not the package, reads `prefers-color-scheme` and the user's saved choice. See [Color](color.md#themes).

## Class names

- Every class the package ships starts with `mu-`.
- The depth classes `mu-recessed`, `mu-key`, `mu-raised` and `mu-popup` apply a whole depth role. Use them for new parts before writing new shadows. See [Depth](depth.md).
- `mu-prose` styles rendered content. See [Prose](components/prose.md).
- `mu-icon` applies icon size and stroke rules outside a component.

## API conventions

These hold across every component. Each [component page](components/README.md) lists its props.

- **`size`**: `"sm" | "md" | "lg"`, default `"md"`. One prop sets height, padding, text, icon size and radius together.
- **Controlled or uncontrolled.** Stateful components take a value and its change handler, or a default:
  - `value` + `onValueChange`, or `defaultValue` (Select, Combobox, Tabs, ToggleGroup, RadioGroup)
  - `checked` + `onCheckedChange`, or `defaultChecked` (Checkbox, Switch)
  - `pressed` + `onPressedChange`, or `defaultPressed` (Toggle)
  - `open` + `onOpenChange`, or `defaultOpen` (Menu, Dialog, Popover, Collapsible, Select)
- **`icon`** takes a Lucide element (`icon={<Pin />}`), never a string name.
- **Accessible names.** A control without a visible label takes `aria-label`. Icon-only controls always do.
- **`tone`**: `"neutral" | "success" | "warning" | "danger"` on status components (Toast, Badge).
- **`variant`** is for Button only: `"primary" | "neutral" | "ghost" | "danger"`.
- **Native props pass through** on components that render one native element (Button, Input, Textarea, Link).
- **`render` for links.** A component that can render as a link (Button's `href`) uses Base UI's `render` prop underneath.

## Shared styles for content

`Prose` is one stylesheet shared by every place content is rendered or edited, including the editor (`@usememos/editor`). Content never shifts between editing and reading.

## What every new component needs

1. A reason: a screen in a product needs it, and no existing component or pattern covers it.
2. A generic name and API that would make sense in any of our products.
3. Tokens only: no raw colors, sizes or shadows.
4. All three sizes, all [states](states.md), all three themes, and reduced motion.
5. Keyboard and screen reader behavior from Base UI.
6. A page in `docs/components/` and an entry in the [inventory](components/README.md).
