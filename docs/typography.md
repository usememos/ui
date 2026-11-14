# Typography

## Rules

- Font decisions follow Apple's [typography guidelines](https://developer.apple.com/design/human-interface-guidelines/typography): the system font, no weight lighter than Regular, hierarchy from color, weight and size, no text under its 11pt minimum for iPhone, and no added letter spacing. The package follows these rules; it does not copy Apple's size tables, which differ per platform (13pt text on Mac, 17pt on iPhone). One set of sizes serves every device, including typed text in fields.
- Use few sizes and few weights. App text uses four sizes (13, 14, 16 and 20px) and two weights (400 and 500); 11px is reserved for compact control labels, keyboard shortcuts and initials (see `label-xs` and `caption-xs`); user tags and status labels use 13px `caption` even inside a 20px Badge. Hierarchy comes from text color, spacing and grouping first, then from weight, and from size last.
- Weight 500 names a control, setting or section: Field labels, including horizontal settings rows and labels around Checkbox, Switch or Radio, button and layout-toggle labels, titles and headings. Weight 400 is for entered or selected values, Menu/Select/Combobox items, running text, descriptions, metadata and badge text. A row's layout or control type never lowers its label's weight. The UI uses no 450, 600 or 700. The one exception is [Prose](components/prose.md): bold text and headings that people wrote are 600, because 500 does not read as bold in system fonts.
- 20px (`heading`) is for the page title only, once per page. 32px (`display`) is for the hero headline on a website only, once per page. Nothing else in the UI is larger than 16px, and 16px is only for `title` and Prose text. Headings that people write inside Prose have their own sizes (see [Prose](#prose)).
- A section title inside a page or panel is `label` (14px, 500), set apart by space above it, not by a larger size. See [Page](patterns.md#page).
- Secondary text (descriptions, helper text, metadata) is `caption` (13px) in `text-secondary`. No text is smaller than 13px, except `label-xs` and `caption-xs` inside 20px parts.
- Control text scales with the control size: 11px at xs, 13px at sm, 14px at md.
- Reading text (`Prose`) is 16px on a 24px line. `sm` prose is 14px on a 22px line, for dense lists.
- Letter spacing is 0 for every style, `display` included. The system fonts set their own letter spacing at each size, so adding more makes text tighter or looser than the platform intends.
- Use `font-variant-numeric: tabular-nums` wherever numbers change or line up: counts, times, tables.
- Selected and unselected states never change weight, so labels don't shift.
- Adding a size, a weight or a style needs a written reason in this page and the maintainer's sign-off.
- The platform's UI font for everything (San Francisco on Apple, Segoe UI on Windows, Roboto on Android), smoothed with antialiasing. The package ships no font files.
- Titles and headings (`title`, `heading`, `display`, and headings in Prose) use `text-wrap: balance`, so a heading that wraps does not leave one word on its last line. Prose paragraphs and list items use `text-wrap: pretty`. Browsers without these wrap as usual.
- Typed text follows the field's size row on every device: 13px at sm and 14px at md, with no touch-only font or line-height override.

## Text roles

Choose weight by what the text does, then color by its context. A less prominent color never calls for a lighter weight. See [Text hierarchy](color.md#text-hierarchy) for the color contract and [Settings](patterns.md#settings) for composition.

| Role | Weight | Color |
| --- | --- | --- |
| Field labels in forms, settings pages and Dialogs, including labels around Checkbox, Switch or Radio | 500 | `text` |
| Horizontal Field labels inside a Popover | 500 | `text-secondary` |
| Entered text and selected values | 400 | `text`; placeholders use `text-secondary` |
| Menu, Select and Combobox item text, selected or not | 400 | `text`; destructive Menu items keep `danger` |
| Button, Toggle and Tabs labels; section titles | 500 | The component's documented color or state |
| Descriptions, helper text and metadata | 400 | `text-secondary`; errors keep `danger` |

Disabled text uses `text-disabled` without changing its weight. Selected and unselected items keep the same weight; fill, color or a check communicates selection. Do not apply the settings-name rule to Menu items or sidebar navigation rows: those remain scanned content at 400.

## Fonts

| Family | Stack |
| --- | --- |
| `--mu-font-sans` | `-apple-system, BlinkMacSystemFont, "Segoe UI (mu)", system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` |
| `--mu-font-display` | `-apple-system, BlinkMacSystemFont, "Segoe UI (mu)", system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` |
| `--mu-font-mono` | `ui-monospace, "SF Mono", Menlo, Consolas, monospace` |

The package ships no font files and loads no remote font: text uses the system UI font, so it looks native on each platform and costs no download. Do not import or define another font family. The one exception is `"Segoe UI (mu)"`, an alias of the installed Windows UI font that the stylesheet defines with `local()` sources only, so it loads no file. Segoe UI has Regular, Semibold and Bold faces but no Medium, so with a plain stack the browser draws weight 500 at 400 and every label on Windows loses its weight. The alias draws 500 and 600 with the installed Semibold face. It comes after `-apple-system` and `BlinkMacSystemFont`, so Apple platforms still get San Francisco, and before `system-ui`, which is plain Segoe UI on Windows. An app that wants another font sets `--mu-font-sans`, `--mu-font-display` or `--mu-font-mono` after loading `tokens.css`, and loads the font itself. These are the only type tokens an app may set: sizes, line heights, weights and letter spacing are fixed (see [What an app can change](color.md#what-an-app-can-change)). Code in [Prose](components/prose.md) uses `font-mono`, the platform's monospace font by default.

## Scale

Nine styles over six sizes. 11, 13 and 14px each have a 400 style for text and a 500 style for labels; the three headings are 500. Body text on a website is `body`, or `Prose` for long-form copy.

### Text (`--mu-font-sans`)

| Style | Size / line | Weight | Usage |
| --- | --- | --- | --- |
| `label-xs` | 11 / 16px | 500 | Labels inside xs controls and kbd: 20px parts you press. Never for running or secondary text. Use only for brief, familiar control labels and keyboard shortcuts. Do not shrink user content or status names to distinguish a size category. Platform minimum sizes are a lower bound, not a default for reading |
| `caption-xs` | 11 / 16px | 400 | Initials and brief counts inside 20px parts. Never for user tags, status names, running or secondary text. Badges use `caption`: their words need to be as readable as the metadata beside them |
| `caption` | 13 / 18px | 400 | Badge text; secondary text: field descriptions and errors, metadata, timestamps, toast and popover descriptions, table captions, sm table cells. Usually in `text-secondary` |
| `label-sm` | 13 / 18px | 500 | Labels inside sm controls, tooltips, group labels in menus and lists, table heads |
| `body` | 14 / 20px | 400 | Default running text in app UI; entered and selected values; dialog descriptions; Menu and Select items and sidebar navigation rows. Field and settings labels use `label` |
| `label` | 14 / 20px | 500 | Labels inside md controls, field labels, buttons, section titles, popover and toast titles. The default control text |

### Headings (`--mu-font-display`)

| Style | Size / line | Weight | Usage |
| --- | --- | --- | --- |
| `title` | 16 / 24px | 500 | Dialog and Drawer titles; empty-state titles |
| `heading` | 20 / 28px | 500 | The page title in an app or on a website. One per page |
| `display` | 32 / 40px | 500 | The hero headline on a website. Never in an app |

Each style is also a class with the `mu-` prefix (`.mu-caption`, `.mu-heading`) in `@usememos/ui/styles.css`, which sets the family, size, line height and weight.

### Removed styles

The scale used to have 12 sizes and 3 weights. These styles were removed; use the replacement. (`label-xs` and `caption-xs` were 12px until November 2026; 12px is no longer in the scale.)

| Removed | Was | Use |
| --- | --- | --- |
| `body-sm` | 13 / 18px, 400 | `caption` |
| `heading-3` | 20 / 28px, 600 | `heading`, or `label` for a section title |
| `heading-2` | 24 / 32px, 600 | `heading` |
| `heading-1` | 32 / 40px, 600 | `display` on a website; `heading` in an app |
| `body-lg` | 16 / 24px, 400 | `body`, or `Prose` for long-form copy |
| `label-lg` | 16 / 24px, 500 | `label` (there is no `lg` control size) |

## Content fitting

Choose fitting by content role, not by language or a one-off width override. Never reduce the type size or weight to make a string fit.

| Content | Fitting rule |
| --- | --- |
| Single-line action keys and list option names/selected values | Preserve the full accessible text; allow the label box to shrink and ellipsize within its width constraint. Icons and state slots stay visible |
| Descriptions, hints, errors and prose | Wrap and grow the block; break an unbroken string when necessary rather than overflow the surface |
| Setting names and multi-line choice labels | Wrap at word boundaries and grow the row. Keep the associated control usable and aligned |
| Numeric data in aligned columns | Use tabular numbers and preserve the value; allow the data region to scroll when columns cannot fit |

When truncation hides information needed to distinguish choices, the product provides a wrapping presentation, a keyboard/touch-accessible detail view, or a full-text Tooltip as appropriate. A hover-only native `title` is not the sole recovery path. The DOM's accessible name alone is not a visual recovery path. Layout groups wrap or use their documented scroll behavior before clipping controls. Verify with a long localized label and an unbroken value at a 320px viewport; the page must not gain horizontal overflow from controls or hints.

Derive an action's accessible name from its visible label, including a displayed shortcut when it is part of that label. Supplementary descriptions are separate accessible descriptions, not replacements for the label or duplicate announcements. Keep those roles intact when a row wraps or truncates.

## Prose

Rendered content (notes, comments, changelogs, website pages) uses the `Prose` styles, not the scale above. It uses 16px text (14px at `sm`) and 13px table heads, and has three heading sizes: 24px `h1`, 20px `h2`, and 16px `h3`–`h6`. 24px appears nowhere else. The reason: notes have sections and subsections, and when `h2` and `h3` were both the size of the text they read as one level, and as bold sentences. At `sm`, `h1` is 16px and `h2`–`h6` are 14px. See [Prose](components/prose.md).
