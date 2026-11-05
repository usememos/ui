# Typography

## Rules

- Use few sizes and few weights. App text uses four sizes (13, 14, 16 and 20px) and two weights (400 and 500); 12px is only for the text of 20px parts (see `label-xs` and `caption-xs`). Hierarchy comes from text color, spacing and grouping first, then from weight, and from size last.
- Weight 400 is for running text, values people typed or chose, and badge text (a badge's tone and fill carry its weight). Weight 500 is for labels, controls, titles and headings. The UI uses no 600 or 700. The one exception is [Prose](components/prose.md): bold text and headings that people wrote are 600, because 500 does not read as bold in system fonts.
- 20px (`heading`) is for the page title only, once per page. 32px (`display`) is for the hero headline on a website only, once per page. Nothing else in the UI is larger than 16px, and 16px is only for `title` and Prose text. Headings that people write inside Prose have their own sizes (see [Prose](#prose)).
- A section title inside a page or panel is `label` (14px, 500), set apart by space above it, not by a larger size. See [Page](patterns.md#page).
- Secondary text (descriptions, helper text, metadata) is `caption` (13px) in `ink-muted`. No text is smaller than 13px, except `label-xs` and `caption-xs` inside 20px parts.
- Control text scales with the control size: 12px at xs, 13px at sm, 14px at md.
- Reading text (`Prose`) is 16px on a 24px line. `sm` prose is 14px on a 22px line, for dense lists.
- Letter spacing is 0, except −0.02em for `display`.
- Use `font-variant-numeric: tabular-nums` wherever numbers change or line up: counts, times, tables.
- Selected and unselected states never change weight, so labels don't shift.
- Adding a size, a weight or a style needs a written reason in this page and the maintainer's sign-off.
- The platform's UI font for everything (San Francisco on Apple, Segoe UI on Windows, Roboto on Android), smoothed with antialiasing. The package ships no font files.
- Titles and headings (`title`, `heading`, `display`, and headings in Prose) use `text-wrap: balance`, so a heading that wraps does not leave one word on its last line. Prose paragraphs and list items use `text-wrap: pretty`. Browsers without these wrap as usual.
- Typed text in fields is 16px on touch screens (`pointer: coarse`), whatever the field's size: below 16px, iOS Safari zooms the page in when a field takes focus. The field keeps its height; its label and placeholder layout do not change.

## Fonts

| Family | Stack |
| --- | --- |
| `--mu-font-sans` | `-apple-system, BlinkMacSystemFont, "Segoe UI (mu)", system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` |
| `--mu-font-display` | `-apple-system, BlinkMacSystemFont, "Segoe UI (mu)", system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` |
| `--mu-font-mono` | `ui-monospace, "SF Mono", Menlo, Consolas, monospace` |

The package ships no font files and loads no remote font: text uses the system UI font, so it looks native on each platform and costs no download. Do not import or define another font family. The one exception is `"Segoe UI (mu)"`, an alias of the installed Windows UI font that the stylesheet defines with `local()` sources only, so it loads no file. Segoe UI has Regular, Semibold and Bold faces but no Medium, so with a plain stack the browser draws weight 500 at 400 and every label on Windows loses its weight. The alias draws 500 and 600 with the installed Semibold face. It comes after `-apple-system` and `BlinkMacSystemFont`, so Apple platforms still get San Francisco, and before `system-ui`, which is plain Segoe UI on Windows. An app that wants another font sets `--mu-font-sans`, `--mu-font-display` or `--mu-font-mono` after loading `tokens.css`, and loads the font itself. These are the only type tokens an app may set: sizes, line heights, weights and letter spacing are fixed (see [What an app can change](color.md#what-an-app-can-change)). Code in [Prose](components/prose.md) uses `font-mono`, the platform's monospace font by default.

## Scale

Nine styles over six sizes. 12, 13 and 14px each have a 400 style for text and a 500 style for labels; the three headings are 500. Body text on a website is `body`, or `Prose` for long-form copy.

### Text (`--mu-font-sans`)

| Style | Size / line | Weight | Usage |
| --- | --- | --- | --- |
| `label-xs` | 12 / 16px | 500 | Labels inside xs controls and kbd: 20px parts you press. Never for running or secondary text. The reason for the size: xs controls must read as tiny, and at 13px they read as sm controls with less padding |
| `caption-xs` | 12 / 16px | 400 | Text inside badges: 20px labels. Never for running or secondary text. The reason for the style: a badge is a label, not a heading, and at 500 every tag and status read heavier than the 13px `caption` metadata around it. Badges get their hierarchy from tone and fill |
| `caption` | 13 / 18px | 400 | Secondary text: field descriptions and errors, metadata, timestamps, toast and popover descriptions, table captions, sm table cells. Usually in `ink-muted` |
| `label-sm` | 13 / 18px | 500 | Labels inside sm controls, tooltips, group labels in menus and lists, table heads |
| `body` | 14 / 20px | 400 | Default running text in app UI; dialog descriptions; the names in rows people scan: Menu and Select items, settings row names, sidebar navigation rows |
| `label` | 14 / 20px | 500 | Labels inside md controls, field labels, buttons, section titles, popover and toast titles. The default control text |

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

Rendered content (notes, comments, changelogs, website pages) uses the `Prose` styles, not the scale above. It uses 16px text (14px at `sm`) and 13px table heads, and has three heading sizes: 24px `h1`, 20px `h2`, and 16px `h3`–`h6`. 24px appears nowhere else. The reason: notes have sections and subsections, and when `h2` and `h3` were both the size of the text they read as one level, and as bold sentences. At `sm`, `h1` is 16px and `h2`–`h6` are 14px. See [Prose](components/prose.md).
