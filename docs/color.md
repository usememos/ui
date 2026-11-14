# Color

Memos UI is ink on paper: a light warm-gray canvas, bright surfaces, `primary` ink for emphasis, one quiet blue for links and selection, and status colors only when there is a status.

## Roles

| Role | Tokens | Used for |
| --- | --- | --- |
| Surfaces | `canvas`, `surface`, `overlay` | The page; then inputs, menus, dialogs and toasts one step up. `overlay` dims the page behind dialogs |
| Wells | `well` | Switch tracks, segmented groups, unchecked boxes and radios, pressed toggles, inline code |
| Hover | `hover` | Rows, ghost buttons, the highlighted menu row |
| Saved choices | `selected` | Persistent fill on soft toggles, distinct from hover |
| Keys | `key`, `key-hover` | Neutral buttons, select triggers, the selected tab |
| Text | `text`, `text-secondary`, `text-disabled` | Primary, secondary and disabled text. Each keeps 4.5:1 on the backgrounds named in the token table below |
| Emphasis | `primary`, `primary-hover`, `on-primary` | Primary button, checked checkbox and radio, switch when on, tooltip |
| Meta | `accent`, `selection`, `focus`, `focus-edge` | Links and text selection (`accent`); the control keyboard focus edge and the forced-colors field focus edge (`focus`, `focus-edge`). Never a fill |
| Status | `success`, `warning`, `danger` and their `-soft` pairs; `danger-key`, `on-danger` | Toasts, badges, field errors, danger buttons |
| Lines | `edge`, `control-edge`, `line` | Quiet resting borders on fields, neutral buttons, switch tracks and surfaces; small checkbox/radio markers; separators and table rules |

## Text hierarchy

Weight identifies a name or content; color determines how much attention it gets. Keep the [text-role weights](typography.md#text-roles) when changing context.

- Forms, settings pages and Dialogs: Field labels and setting names use `text`; descriptions, helper text and metadata use `text-secondary`.
- Compact controls in a Popover: horizontal Field labels use `text-secondary`, while entered text and selected values use `text`. Vertical Field labels keep `text`. The package supplies this treatment; apps do not recolor each label.
- Menu, Select and Combobox items use `text`, with secondary descriptions and shortcuts. Selection does not lower the text's contrast or change its weight; the component's fill or check identifies the choice.
- Disabled labels and values use `text-disabled` at their ordinary weight. Invalid fields keep their label's contextual color; the error text and existing control edge use `danger`.
- A label's contextual color stays fixed under hover, focus and checked states. Interactive Button, Toggle and Tabs labels keep their component's state colors. Never use opacity to make ordinary labels or values quieter.

## Rules

- Light uses near-neutral warm grays for its canvas, wells, hover fills and quiet boundaries: one OKLCH hue (95), with chroma at most 0.008. Surfaces and keys stay white. Text, ink emphasis and stronger control boundaries stay pure gray; Dark keeps its pure-gray neutrals.
- `accent` is a quiet blue used only for links and selection. If a screen has blue on it at rest, apart from links, something is wrong.
- Text entry uses its visible caret or text selection to indicate focus. Hover, focus and press keep the same field edge and surface in normal colors. Other controls reuse the existing 1px ink `focus` border. On primary and checked fills, the border uses `on-primary`; danger buttons use `on-danger`. Only forced-colors mode uses a 2px system focus edge. See [States](states.md).
- Status colors appear only when there is a status. Red is for destructive actions and errors, never for emphasis.
- `danger` is tuned for text. `danger-key` is the danger button's fill; it is darker in Dark so the button is not the loudest thing on screen.
- Always pair a status color with a word or an icon.
- A color the user chooses, such as a tag's, is their content, not a role. It appears only as a tint behind the `text` color (Badge's `color`), never as text or as a fill under light text, because the package can't know its contrast.
- Use tokens through their CSS variables. Every token is a custom property with the `--mu-` prefix: the `well` token is `var(--mu-well)`. The prefix keeps the tokens apart from an app's own variables and from Tailwind's. Never copy raw values into component or product code.

## Themes

There are two themes: **Light** (the default) and **Dark**.

- `text`, `text-secondary` and `text-disabled` name content roles for text and icons, not fixed colors. App themes can set each one; they are not derived from `primary`.
- Each theme sets every color token explicitly. The package's tests check the values against the table on this page and check the contrast promised here.
- Light starts with a pale warm-gray paper canvas. White surfaces and keys remain brighter; wells and hover fills are darker steps in the same warm-gray family. This is a flat color treatment, with no texture.
- Dark keeps the same flat surface roles. Wells and keys are distinct gray fills, and `primary` flips to near-white with a dark `on-primary`.
- `edge` separates bounded surfaces and stays quiet at rest, on hover and under selected/pressed attributes. Text fields keep it during typing focus too; neutral buttons, Selects and off switch tracks do not strengthen it on hover. `control-edge` is reserved for small unchecked Checkbox and Radio marks, at least 3:1 against `canvas` and `surface` in both themes. On default toggles use a `well` fill with `text`, without a visible border; soft toggles use `hover` when off and `selected` with `text` when on; segmented choices use a contrasting `key` fill in a quiet well. Text tokens never become persistent borders. Non-text controls retain their focus treatment; invalid fields retain their error edge. Forced colors adds system-colored selection boundaries when fills disappear; `line` separates content. The quiet resting field boundary remains below 3:1; see [boundary contrast](depth.md#rules).

### Choosing a theme

Set `data-theme="light" | "dark"` on the root element, or on any `.mu-root` element. Without the attribute the tokens are Light.

The package does not read `prefers-color-scheme` itself. The app does, so that a saved preference wins over the system setting. Dark sets `color-scheme: dark`, so native scrollbars and form controls follow.

### What an app can change

An app sets only these tokens:

- the 29 color tokens in the [table below](#color-tokens),
- the three font tokens in [Typography](typography.md#fonts): `font-sans`, `font-display` and `font-mono`.

Every other token (space, radius, sizes, layout widths, layers, motion) and every `mu-*` class rule is internal. Read those tokens in app CSS (`var(--mu-space-4)`), but don't override them, even though the cascade layer lets an app rule win. `className` and `style` support app-owned layout, not changes to a component's internal appearance. See [Styling ownership](consistency.md#styling-ownership) for the boundary.

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
- The package exports `themeTokens`, the custom property names of those 29 tokens (`--mu-canvas` to `--mu-on-danger`). Check in the app's tests that its theme sets each one (Vitest reads a stylesheet with `?raw` only when `test.css` is `true` in its config; without it the file comes back empty):

  ```ts
  import { themeTokens } from "@usememos/ui";
  import paper from "./themes/paper.css?raw";

  it("sets every theme token", () => {
    expect(themeTokens.filter((name) => !paper.includes(`${name}:`))).toEqual([]);
  });
  ```
- Keep the rules on this page: `primary` stays ink, not a brand hue; `accent` is only for links and selection; control focus stays ink; text-entry focus does not change its normal border; status colors only for status.
- The app owns the theme's contrast. Check in the app's own tests that every text and background pair named in the Usage column below keeps 4.5:1 or more. The package's tests and screenshots cover only Light and Dark.
- The tokens sit in the `mu` [cascade layer](building.md#cascade-layer), so an unlayered app theme wins over them at any specificity.
- An app theme is a choice the user makes. It is not a way to restyle the package per product: an app's default theme is Light or Dark.

## Color tokens

| Token | Light | Dark | Usage |
| --- | --- | --- | --- |
| `canvas` | `oklch(0.982 0.004 95)` | `#0f0f0f` | Page background |
| `surface` | `#ffffff` | `#1a1a1a` | One lightness step above canvas: inputs, menus, popovers, dialogs, toasts, table headers |
| `well` | `oklch(0.934 0.008 95)` | `#252525` | Flat parts that hold a state: switch, tab, checkbox and radio wells, pressed toggles, inline code. A boundary is added only where the component needs one. Not for enabled text entry |
| `hover` | `oklch(0.95 0.006 95)` | `#252525` | Hover on rows, ghost buttons and wells; the highlighted row in menus and selects |
| `selected` | `oklch(0.919 0.004 95)` | `#343434` | Persistent soft-toggle fill, including while hovered; with `text` or `text-disabled`, never a selected border |
| `key` | `#ffffff` | `#343434` | Controls and selected parts: neutral buttons, select triggers, the selected tab. Flat: neutral buttons and selects use `edge`; selected segments use fill without a visible border in normal colors |
| `key-hover` | `oklch(0.982 0.004 95)` | `#3c3c3c` | Hover on a neutral key |
| `edge` | `oklch(0.858 0.006 95)` | `#343434` | Quiet resting borders of fields, neutral buttons, switch tracks, well/key surfaces, popups, badges, selects and disabled controls |
| `control-edge` | `#909090` | `#777777` | Small unchecked Checkbox and Radio markers only; never a full-control hover or selected boundary; at least 3:1 on `canvas` and `surface` |
| `line` | `oklch(0.919 0.004 95)` | `#252525` | Separators, table rules and menu dividers. About 1.2:1 against canvas in Light, so structural lines also need spacing or a heading |
| `overlay` | `rgba(0,0,0,0.32)` | `rgba(0,0,0,0.6)` | Backdrop behind dialogs and sheets |
| `text` | `#1a1a1a` | `#ededed` | Primary text and icons on canvas, surface, well, key and selected (10:1 or more in both themes) |
| `text-secondary` | `#5e5e5e` | `#adadad` | Secondary text: descriptions, placeholders, horizontal Field labels in Popovers, unselected tabs and toggles, shortcuts, timestamps (4.9:1 or more on every surface) |
| `text-disabled` | `#666666` | `#9e9e9e` | Disabled text and icons, at least 4.5:1 on `canvas`, `surface`, `well`, `key` and `selected`; never fade the whole control |
| `primary` | `#1a1a1a` | `#e6e6e6` | The one emphasized action and every on state: primary buttons, checked boxes and radios, switches when on, tooltips. Ink, not a hue |
| `primary-hover` | `#333333` | `#ffffff` | Hover on a primary key |
| `on-primary` | `#ffffff` | `#0f0f0f` | Text, icons and the switch knob on `primary` (16:1 Light, 15:1 Dark) |
| `accent` | `oklch(0.5 0.13 255)` | `oklch(0.78 0.11 255)` | The only hue at rest: links, the text cursor and selection. 5.7:1 on canvas in Light. Never a fill |
| `selection` | `rgba(40,99,171,0.18)` | `rgba(135,186,253,0.28)` | Text selection and the selected range in an editor |
| `focus` | `var(--mu-primary)` | `var(--mu-primary)` | 1px keyboard focus border, on `:focus-visible` only; contrasting text color on filled controls |
| `focus-edge` | `var(--mu-edge)` | `var(--mu-edge)` | Field focus edge in forced colors, where it becomes system `Highlight`. Normal Input, Textarea and Combobox keep `edge` and show typing focus with the caret or selection |
| `success` | `oklch(0.52 0.13 150)` | `oklch(0.78 0.14 150)` | Success text and icons on `surface` or `success-soft` (4.6:1 or more). Always with a word or icon |
| `success-soft` | `#e9f4ec` | `#14261a` | Background of success badges and toasts |
| `warning` | `oklch(0.5 0.11 70)` | `oklch(0.8 0.13 75)` | Warning text and icons on `surface` or `warning-soft` (5.5:1 or more) |
| `warning-soft` | `#fbf1df` | `#2a2112` | Background of warning badges and toasts |
| `danger` | `oklch(0.53 0.19 27)` | `oklch(0.72 0.16 25)` | Danger text and icons: field errors, delete menu items, danger badges (5.0:1 or more on `surface` and `danger-soft`) |
| `danger-key` | `oklch(0.53 0.19 27)` | `oklch(0.55 0.17 25)` | Fill of a danger button. 5.3:1 or more with `on-danger` |
| `danger-soft` | `#fbeaea` | `#2c1616` | Background of danger badges and error toasts |
| `on-danger` | `#ffffff` | `#ffffff` | Text on a danger key |

Every text and background pair in this table keeps at least 4.5:1 in both themes. [Surface borders](depth.md) never lower text contrast.
