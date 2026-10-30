# Typography

## Rules

- Use few sizes and few weights. App text uses four sizes (13, 14, 16 and 20px) and two weights (400 and 500); 12px is only for the labels of 20px parts (see `label-xs`). Hierarchy comes from text color, spacing and grouping first, then from weight, and from size last.
- Weight 400 is for running text and values people typed or chose. Weight 500 is for labels, controls, titles and headings. The UI uses no 600 or 700. The one exception is [Prose](components/prose.md): bold text and headings that people wrote are 600, because 500 does not read as bold in system fonts.
- 20px (`heading`) is for the page title only, once per page. 32px (`display`) is for the hero headline on a website only, once per page. Nothing else is larger than 16px, and 16px is only for `title` and Prose text.
- A section title inside a page or panel is `label` (14px, 500), set apart by space above it, not by a larger size. See [Page](patterns.md#page).
- Secondary text (descriptions, helper text, metadata) is `caption` (13px) in `ink-muted`. No text is smaller than 13px, except `label-xs` inside 20px parts.
- Control text scales with the control size: 12px at xs, 13px at sm, 14px at md.
- Reading text (`Prose`) is 16px on a 24px line. `sm` prose is 14px on a 22px line, for dense lists.
- Letter spacing is 0, except −0.02em for `display`.
- Use `font-variant-numeric: tabular-nums` wherever numbers change or line up: counts, times, tables.
- Selected and unselected states never change weight, so labels don't shift.
- Adding a size, a weight or a style needs a written reason in this page and the maintainer's sign-off.
- The platform's UI font for everything (San Francisco on Apple, Segoe UI on Windows, Roboto on Android), smoothed with antialiasing. The package ships no font files.

## Fonts

| Family | Stack |
| --- | --- |
| `--mu-font-sans` | `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` |
| `--mu-font-display` | `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` |
| `--mu-font-mono` | `ui-monospace, "SF Mono", Menlo, Consolas, monospace` |

The package ships no font files and loads no remote font: text uses the system UI font, so it looks native on each platform and costs no download. An app that wants another font sets `--mu-font-sans`, `--mu-font-display` or `--mu-font-mono` after loading `tokens.css`, and loads the font itself. These are the only type tokens an app may set: sizes, line heights, weights and letter spacing are fixed (see [What an app can change](color.md#what-an-app-can-change)). Code in [Prose](components/prose.md) uses `font-mono`, the platform's monospace font by default.

## Scale

Eight styles over six sizes. 13 and 14px each have a 400 style for text and a 500 style for labels; 12px has only a label style; the three headings are 500. Body text on a website is `body`, or `Prose` for long-form copy.

### Text (`--mu-font-sans`)

| Style | Size / line | Weight | Usage |
| --- | --- | --- | --- |
| `label-xs` | 12 / 16px | 500 | Labels inside xs controls, badges and kbd: the parts that are 20px tall. Never for running or secondary text. The reason for the size: xs controls must read as tiny, and at 13px they read as sm controls with less padding |
| `caption` | 13 / 18px | 400 | Secondary text: field descriptions and errors, metadata, timestamps, toast and popover descriptions, table captions, sm table cells. Usually in `ink-muted` |
| `label-sm` | 13 / 18px | 500 | Labels inside sm controls, tooltips, group labels in menus and lists, table heads |
| `body` | 14 / 20px | 400 | Default running text in app UI; dialog descriptions |
| `label` | 14 / 20px | 500 | Labels inside md controls, field labels, nav rows, buttons, section titles, popover and toast titles. The default control text |

### Headings (`--mu-font-display`)

| Style | Size / line | Weight | Letter spacing | Usage |
| --- | --- | --- | --- | --- |
| `title` | 16 / 24px | 500 | 0 | Dialog titles; empty-state titles |
| `heading` | 20 / 28px | 500 | 0 | The page title in an app or on a website. One per page |
| `display` | 32 / 40px | 500 | −0.02em | The hero headline on a website. Never in an app |

Each style is also a class with the `mu-` prefix (`.mu-caption`, `.mu-heading`) in `@usememos/ui/styles.css`, which sets the family, size, line height, weight and, where listed, letter spacing.

### Removed styles

The scale used to have 12 sizes and 3 weights. These styles were removed; use the replacement. (`label-xs` was 11px before it came back at 12px for the xs row.)

| Removed | Was | Use |
| --- | --- | --- |
| `body-sm` | 13 / 18px, 400 | `caption` |
| `heading-3` | 20 / 28px, 600 | `heading`, or `label` for a section title |
| `heading-2` | 24 / 32px, 600 | `heading` |
| `heading-1` | 32 / 40px, 600 | `display` on a website; `heading` in an app |
| `body-lg` | 16 / 24px, 400 | `body`, or `Prose` for long-form copy |
| `label-lg` | 16 / 24px, 500 | `label` (there is no `lg` control size) |

## Prose

Rendered content (notes, comments, changelogs, website pages) uses the `Prose` styles, not the scale above. It uses the same sizes: 16px text (14px at `sm`), 20px `h1`, 16px `h2`–`h6`, and 13px table heads. See [Prose](components/prose.md).
