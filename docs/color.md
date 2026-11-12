# Color

Memos UI is ink on paper: pure-gray neutrals, `primary` ink for emphasis, one quiet blue for links and selection, and status colors only when there is a status.

## Roles

| Role | Tokens | Used for |
| --- | --- | --- |
| Surfaces | `canvas`, `surface`, `overlay` | The page; then inputs, menus, dialogs and toasts one step up. `overlay` dims the page behind dialogs |
| Wells | `well` | Switch tracks, segmented groups, unchecked boxes and radios, pressed toggles, inline code |
| Hover | `hover` | Rows, ghost buttons, the highlighted menu row. About 4% ink over surface |
| Keys | `key`, `key-hover` | Neutral buttons, select triggers, the selected tab, kbd |
| Text | `text`, `text-secondary`, `text-disabled` | Primary, secondary and disabled text. Each keeps 4.5:1 on the backgrounds named in the token table below |
| Emphasis | `primary`, `primary-hover`, `on-primary` | Primary button, checked checkbox and radio, switch when on, tooltip |
| Meta | `accent`, `selection`, `focus`, `focus-edge` | Links and text selection (`accent`); the keyboard focus edge and the focused field edge (`focus`, `focus-edge`, both ink). Never a fill |
| Status | `success`, `warning`, `danger` and their `-soft` pairs; `danger-key`, `on-danger` | Toasts, badges, field errors, danger buttons |
| Lines | `edge`, `control-edge`, `line` | Quiet resting borders on fields, neutral buttons, switch tracks and surfaces; stronger hover boundaries and small checkbox/radio markers; separators and table rules |

## Rules

- Neutrals are pure gray, never tinted.
- `accent` is a quiet blue used only for links and selection. If a screen has blue on it at rest, apart from links, something is wrong.
- Focus is ink, not blue. A focused field darkens its own edge to `focus-edge`; a control reached by keyboard recolors its existing 1px border to `focus`. On primary and checked fills, the border uses `on-primary`; danger buttons use `on-danger`. Invalid non-text controls and forced-colors mode use 2px. See [States](states.md).
- Status colors appear only when there is a status. Red is for destructive actions and errors, never for emphasis.
- `danger` is tuned for text. `danger-key` is the danger button's fill; it is darker in Dark so the button is not the loudest thing on screen.
- Always pair a status color with a word or an icon.
- A color the user chooses, such as a tag's, is their content, not a role. It appears only as a tint behind the `text` color (Badge's `color`), never as text or as a fill under light text, because the package can't know its contrast.
- Use tokens through their CSS variables. Every token is a custom property with the `--mu-` prefix: the `well` token is `var(--mu-well)`. The prefix keeps the tokens apart from an app's own variables and from Tailwind's. Never copy raw values into component or product code.

## Themes

There are two themes: **Light** (the default) and **Dark**.

- `text`, `text-secondary` and `text-disabled` name content roles for text and icons, not fixed colors. App themes can set each one; they are not derived from `primary`.
- Each theme sets every color token explicitly. The package's tests check the values against the table on this page and check the contrast promised here.
- Dark keeps the same flat surface roles. Wells and keys are distinct gray fills, and `primary` flips to near-white with a dark `on-primary`.
- Text fields use the quiet `edge` at rest, `control-edge` on hover and 1px ink on focus. Their resting boundary is below 3:1 in both built-in themes; see [boundary contrast](depth.md#rules). Neutral buttons, Select triggers, switch tracks and the public well/key surfaces also use quiet `edge` at rest. Neutral buttons, Selects and off switch tracks strengthen to `control-edge` on hover. Unchecked checkbox/radio markers and pressed toggles retain `control-edge`, at least 3:1 against `canvas` and `surface` in both themes. An off switch has a `text` knob. Segmented groups use a well without a visible border; the selected key has a `text-secondary` border. Focus remains a strong edge; `line` separates content.

### Choosing a theme

Set `data-theme="light" | "dark"` on the root element, or on any `.mu-root` element. Without the attribute the tokens are Light.

The package does not read `prefers-color-scheme` itself. The app does, so that a saved preference wins over the system setting. Dark sets `color-scheme: dark`, so native scrollbars and form controls follow.

### What an app can change

An app sets only these tokens:

- the 28 color tokens in the [table below](#color-tokens),
- the three font tokens in [Typography](typography.md#fonts): `font-sans`, `font-display` and `font-mono`.

Every other token (space, radius, sizes, layout widths, layers, motion) and every `mu-*` class rule is internal. Read those tokens in app CSS (`var(--mu-space-4)`), but don't override them, even though the cascade layer lets an app rule win: the products would drift apart, and the package's tests and screenshots cover only its own values. To change one element, pass `className` or `style` to that component (see [API conventions](building.md#api-conventions)).

Internal rules are not private classes. An app applies the [public classes](custom-components.md#public-classes) and the class functions to its own elements; it only never changes what they do.

### App themes

An app can offer more themes than the two the package ships, such as a warm Paper theme in memos. An app theme is a rule that sets the color tokens under its own `data-theme` value:

```css
[data-theme="paper"] {
  color-scheme: light;
  --mu-canvas: #f5ede4;
  --mu-surface: #fbf6f0;
  /* every other color token */
}
```

- Set every color token in the table below. A token the theme leaves out keeps its Light value, so a partial theme mixes two palettes.
- The package exports `themeTokens`, the custom property names of those 28 tokens (`--mu-canvas` to `--mu-on-danger`). Check in the app's tests that its theme sets each one (Vitest reads a stylesheet with `?raw` only when `test.css` is `true` in its config; without it the file comes back empty):

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
| `canvas` | `#fafafa` | `#0f0f0f` | Page background |
| `surface` | `#ffffff` | `#1a1a1a` | One lightness step above canvas: inputs, menus, popovers, dialogs, toasts, table headers |
| `well` | `#e4e4e4` | `#252525` | Flat parts that hold a state: switch, tab, checkbox and radio wells, pressed toggles, inline code. A boundary is added only where the component needs one. Not for enabled text entry |
| `hover` | `#ececec` | `#252525` | Hover on rows, ghost buttons and wells; the highlighted row in menus and selects |
| `key` | `#ffffff` | `#343434` | Controls and selected parts: neutral buttons, select triggers, the selected tab, kbd. Flat: neutral buttons and selects use `edge`, selected segments use a `text-secondary` border |
| `key-hover` | `#fafafa` | `#3c3c3c` | Hover on a neutral key |
| `edge` | `#d0d0d0` | `#343434` | Quiet resting borders of fields, neutral buttons, switch tracks, well/key surfaces, popups, badges, selects and disabled controls |
| `control-edge` | `#909090` | `#777777` | Hover boundaries on fields, neutral buttons, selects and off switch tracks; unchecked checkbox/radio markers and pressed toggles; at least 3:1 on `canvas` and `surface` |
| `line` | `#dedede` | `#252525` | Separators, table rules and menu dividers. 1.25:1 in Light, so structural lines also need spacing or a heading |
| `overlay` | `rgba(0,0,0,0.32)` | `rgba(0,0,0,0.6)` | Backdrop behind dialogs and sheets |
| `text` | `#1a1a1a` | `#ededed` | Primary text and icons on canvas, surface, well and key (13:1 or more in both themes) |
| `text-secondary` | `#5e5e5e` | `#adadad` | Secondary text: descriptions, placeholders, unselected tabs and toggles, shortcuts, timestamps (4.9:1 or more on every surface) |
| `text-disabled` | `#666666` | `#9e9e9e` | Disabled text and icons, at least 4.5:1 on `canvas`, `surface`, `well` and `key`; never fade the whole control |
| `primary` | `#1a1a1a` | `#e6e6e6` | The one emphasized action and every on state: primary buttons, checked boxes and radios, switches when on, tooltips. Ink, not a hue |
| `primary-hover` | `#333333` | `#ffffff` | Hover on a primary key |
| `on-primary` | `#ffffff` | `#0f0f0f` | Text, icons and the switch knob on `primary` (16:1 Light, 15:1 Dark) |
| `accent` | `oklch(0.5 0.13 255)` | `oklch(0.78 0.11 255)` | The only hue at rest: links, the text cursor and selection. 5.8:1 on canvas in Light. Never a fill |
| `selection` | `rgba(40,99,171,0.18)` | `rgba(135,186,253,0.28)` | Text selection and the selected range in an editor |
| `focus` | `var(--mu-primary)` | `var(--mu-primary)` | 1px keyboard focus border, on `:focus-visible` only; contrasting text color on filled controls |
| `focus-edge` | `var(--mu-text)` | `var(--mu-text)` | Edge of a focused field (Input, Textarea, Combobox): 1px on any focus, recoloring the quiet `edge` |
| `success` | `oklch(0.52 0.13 150)` | `oklch(0.78 0.14 150)` | Success text and icons on `surface` or `success-soft` (4.6:1 or more). Always with a word or icon |
| `success-soft` | `#e9f4ec` | `#14261a` | Background of success badges and toasts |
| `warning` | `oklch(0.5 0.11 70)` | `oklch(0.8 0.13 75)` | Warning text and icons on `surface` or `warning-soft` (5.5:1 or more) |
| `warning-soft` | `#fbf1df` | `#2a2112` | Background of warning badges and toasts |
| `danger` | `oklch(0.53 0.19 27)` | `oklch(0.72 0.16 25)` | Danger text and icons: field errors, delete menu items, danger badges (5.0:1 or more on `surface` and `danger-soft`) |
| `danger-key` | `oklch(0.53 0.19 27)` | `oklch(0.55 0.17 25)` | Fill of a danger button. 5.3:1 or more with `on-danger` |
| `danger-soft` | `#fbeaea` | `#2c1616` | Background of danger badges and error toasts |
| `on-danger` | `#ffffff` | `#ffffff` | Text on a danger key |

Every text and background pair in this table keeps at least 4.5:1 in both themes. [Surface borders](depth.md) never lower text contrast.
