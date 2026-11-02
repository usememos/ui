# Color

Memos UI is ink on paper: pure-gray neutrals, `primary` ink for emphasis, one quiet blue for links and selection, and status colors only when there is a status.

## Roles

| Role | Tokens | Used for |
| --- | --- | --- |
| Surfaces | `canvas`, `surface`, `overlay` | The page; then inputs, menus, dialogs and toasts one step up. `overlay` dims the page behind dialogs |
| Wells | `well`, `edge` | Switch, tab, checkbox and radio wells, pressed toggles, inline code. `edge` is the 1px border of wells and inputs |
| Hover | `hover` | Rows, ghost buttons, the highlighted menu row. About 4% ink over surface |
| Keys | `key`, `key-hover`, `key-sheen` | Neutral buttons, select triggers, the selected tab, switch knobs, kbd |
| Text | `ink`, `ink-muted` | Primary and secondary text. Both pass 4.5:1 on every surface, well and key in both themes |
| Emphasis | `primary`, `primary-hover`, `on-primary` | Primary button, checked checkbox and radio, switch when on, tooltip |
| Meta | `accent`, `selection`, `focus`, `focus-edge` | Links and text selection (`accent`); the keyboard focus ring and the focused field edge (`focus`, `focus-edge`, both ink). Never a fill |
| Status | `success`, `warning`, `danger` and their `-soft` pairs; `danger-key`, `on-danger` | Toasts, badges, field errors, danger buttons |
| Lines | `line` | Separators, table rules, menu dividers |

## Rules

- Neutrals are pure gray, never tinted.
- `accent` is a quiet blue used only for links and selection. If a screen has blue on it at rest, apart from links, something is wrong.
- Focus is ink, not blue. A focused field darkens its own edge to `focus-edge`; a control reached by keyboard gets a 2px `focus` ring 1px outside its edge. See [States](states.md).
- Status colors appear only when there is a status. Red is for destructive actions and errors, never for emphasis.
- `danger` is tuned for text. `danger-key` is the danger button's fill; it is darker in Dark so the button is not the loudest thing on screen.
- Always pair a status color with a word or an icon.
- Use tokens through their CSS variables. Every token is a custom property with the `--mu-` prefix: the `well` token is `var(--mu-well)`. The prefix keeps the tokens apart from an app's own variables and from Tailwind's. Never copy raw values into component or product code.

## Themes

There are two themes: **Light** (the default) and **Dark**.

- Each theme sets every color token and every shadow token to an explicit value. Nothing is derived at runtime. The package's tests check the values against the tables on this page and in [Depth](depth.md), and check the contrast promised here.
- Dark keeps the same depth model. Wells go darker than `canvas`, keys go lighter, `key-sheen` drops to 8%, and `primary` flips to near-white with a dark `on-primary`.
- Non-text contrast: `edge` is about 1.5:1 in Light and Dark. That is the soft border people expect from a calm interface, and it is below WCAG's 3:1 for control boundaries. An app that needs 3:1 boundaries defines its own [app theme](#app-themes) with a darker `edge` and outlined keys.

### Choosing a theme

Set `data-theme="light" | "dark"` on the root element, or on any `.mu-root` element. Without the attribute the tokens are Light.

The package does not read `prefers-color-scheme` itself. The app does, so that a saved preference wins over the system setting. Dark sets `color-scheme: dark`, so native scrollbars and form controls follow.

### What an app can change

An app sets only these tokens:

- the 26 color tokens in the [table below](#color-tokens),
- the five shadow tokens in [Depth](depth.md#shadow-tokens),
- the three font tokens in [Typography](typography.md#fonts): `font-sans`, `font-display` and `font-mono`.

Every other token (space, radius, sizes, layout widths, layers, motion) and every `mu-*` class rule is internal. Read those tokens in app CSS (`var(--mu-space-4)`), but don't override them, even though the cascade layer lets an app rule win: the products would drift apart, and the package's tests and screenshots cover only its own values. To change one element, pass `className` or `style` to that component (see [API conventions](building.md#api-conventions)).

Internal rules are not private classes. An app applies the [public classes](custom-components.md#public-classes) and the class functions to its own elements; it only never changes what they do.

### App themes

An app can offer more themes than the two the package ships, such as a warm Paper theme in memos. An app theme is a rule that sets the color and shadow tokens under its own `data-theme` value:

```css
[data-theme="paper"] {
  color-scheme: light;
  --mu-canvas: #f5ede4;
  --mu-surface: #fbf6f0;
  /* every other color token, and the five shadow tokens */
}
```

- Set every color token in the table below and the five shadow tokens in [Depth](depth.md). A token the theme leaves out keeps its Light value, so a partial theme mixes two palettes.
- The package exports `themeTokens`, the custom property names of those 31 tokens (`--mu-canvas` to `--mu-shadow-pop`). Check in the app's tests that its theme sets each one:

  ```ts
  import { themeTokens } from "@usememos/ui";
  import paper from "./themes/paper.css?raw";

  it("sets every theme token", () => {
    expect(themeTokens.filter((name) => !paper.includes(`${name}:`))).toEqual([]);
  });
  ```
- Keep the rules on this page: `primary` stays ink, not a brand hue; `accent` is only for links and selection; focus is ink; status colors only for status.
- The app owns the theme's contrast. Check in the app's own tests that every text and background pair named in the Usage column below keeps 4.5:1 or more. The package's tests and screenshots cover only Light and Dark.
- The tokens sit in the `mu` [cascade layer](building.md#cascade-layer), so an unlayered app theme wins over them at any specificity.
- An app theme is a choice the user makes. It is not a way to restyle the package per product: an app's default theme is Light or Dark.

## Color tokens

| Token | Light | Dark | Usage |
| --- | --- | --- | --- |
| `canvas` | `#f9f9f9` | `#0f0f0f` | Page background |
| `surface` | `#ffffff` | `#1a1a1a` | One lightness step above canvas: inputs, menus, popovers, dialogs, toasts, table headers |
| `well` | `#e4e4e4` | `#262626` | Recessed parts that hold a state: switch, tab, checkbox and radio wells, pressed toggles, inline code. Paired with `edge` and `shadow-track`. Not for text entry |
| `hover` | `#ededed` | `#242424` | Hover on rows, ghost buttons and wells; the highlighted row in menus and selects |
| `key` | `#ffffff` | `#343434` | Raised parts you press: neutral buttons, select triggers, the selected tab, switch knobs, kbd. Paired with `shadow-key` or `shadow-raised` |
| `key-hover` | `#fbfbfb` | `#3c3c3c` | Hover on a neutral key |
| `key-sheen` | `rgba(255,255,255,0.18)` | `rgba(255,255,255,0.08)` | Top light on keys: a gradient from `key-sheen` at the top edge to clear at 60% of the height |
| `edge` | `#d0d0d0` | `#353535` | 1px border of inputs and wells. About 1.5:1 on canvas |
| `line` | `#e0e0e0` | `#262626` | Separators, table rules and menu dividers. 1.25:1 in Light, so structural lines also need spacing or a heading |
| `overlay` | `rgba(0,0,0,0.32)` | `rgba(0,0,0,0.6)` | Backdrop behind dialogs and sheets |
| `ink` | `#1a1a1a` | `#ededed` | Primary text and icons on canvas, surface, well and key (13:1 or more in both themes) |
| `ink-muted` | `#5e5e5e` | `#adadad` | Secondary text: descriptions, placeholders, unselected tabs and toggles, shortcuts, timestamps (4.9:1 or more on every surface) |
| `primary` | `#1f1f1f` | `#e6e6e6` | The one emphasized action and every on state: primary buttons, checked boxes and radios, switches when on, tooltips. Ink, not a hue |
| `primary-hover` | `#333333` | `#f5f5f5` | Hover on a primary key |
| `on-primary` | `#ffffff` | `#111111` | Text, icons and the switch knob on `primary` (16:1 Light, 15:1 Dark) |
| `accent` | `oklch(0.5 0.13 255)` | `oklch(0.78 0.11 255)` | The only hue at rest: links, the text cursor and selection. 5.8:1 on canvas in Light. Never a fill |
| `selection` | `rgba(40,99,171,0.18)` | `rgba(135,186,253,0.28)` | Text selection and the selected range in an editor |
| `focus` | `var(--mu-primary)` | `var(--mu-primary)` | Keyboard focus ring: 2px outline, 1px offset, on `:focus-visible` only |
| `focus-edge` | `var(--mu-ink)` | `var(--mu-ink)` | Edge of a focused field (Input, Textarea, Combobox): 1.5px on any focus, in place of the 1px `edge` |
| `success` | `oklch(0.52 0.13 150)` | `oklch(0.78 0.14 150)` | Success text and icons on `surface` or `success-soft` (4.6:1 or more). Always with a word or icon |
| `success-soft` | `#e9f4ec` | `#14261a` | Background of success badges and toasts |
| `warning` | `oklch(0.5 0.11 70)` | `oklch(0.8 0.13 75)` | Warning text and icons on `surface` or `warning-soft` (5.5:1 or more) |
| `warning-soft` | `#fbf1df` | `#2a2112` | Background of warning badges and toasts |
| `danger` | `oklch(0.53 0.19 27)` | `oklch(0.72 0.16 25)` | Danger text and icons: field errors, delete menu items, danger badges (5.0:1 or more on `surface` and `danger-soft`) |
| `danger-key` | `oklch(0.53 0.19 27)` | `oklch(0.55 0.17 25)` | Fill of a danger button. 5.3:1 or more with `on-danger` |
| `danger-soft` | `#fbeaea` | `#2c1616` | Background of danger badges and error toasts |
| `on-danger` | `#ffffff` | `#ffffff` | Text on a danger key |

Every text and background pair in this table keeps at least 4.5:1 in both themes. Depth (see [Depth](depth.md)) is added on top and never lowers contrast.
