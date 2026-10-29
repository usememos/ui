# Typography

## Rules

- The platform's UI font for everything (San Francisco on Apple, Segoe UI on Windows, Roboto on Android), smoothed with antialiasing. The package ships no font files.
- Controls and labels are weight 500. Running text is 400. Headings are 600.
- Control text scales with the control size: 12px at sm, 14px at md, 16px at lg.
- `body-sm` (13px) is for dense secondary text. `label-xs` (11px) is for kbd and counts inside badges only.
- Reading text (`Prose`) is 15px on a 24px line. `sm` prose is 14px on a 22px line, for dense lists.
- Letter spacing is 0 up to 20px, −0.01em for `heading-2` and `heading-1`, and −0.02em for `display`.
- Use `font-variant-numeric: tabular-nums` wherever numbers change or line up: counts, times, tables.
- Hierarchy comes from text color (`ink`, `ink-muted`) before size or weight. Selected and unselected states never change weight, so labels don't shift.

## Fonts

| Family | Stack |
| --- | --- |
| `--font-sans` | `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` |
| `--font-display` | `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` |
| `--font-mono` | `ui-monospace, "SF Mono", Menlo, Consolas, monospace` |

The package ships no font files and loads no remote font: text uses the system UI font, so it looks native on each platform and costs no download. An app that wants another font sets `--font-sans` and `--font-display` after loading `tokens.css`, and loads the font itself. Code in [Prose](components/prose.md) uses the platform's monospace font.

## Scale

### Text (`--font-sans`)

| Style | Size / line | Weight | Usage |
| --- | --- | --- | --- |
| `label-xs` | 11 / 16px | 500 | Kbd and counts inside badges only. Never running text |
| `caption` | 12 / 16px | 400 | Metadata, timestamps, helper text. In `ink-muted` |
| `label-sm` | 12 / 16px | 500 | Labels inside sm controls |
| `body-sm` | 13 / 18px | 400 | Dense secondary text: toast descriptions, sm menu rows, dense table cells |
| `body` | 14 / 20px | 400 | Default running text in app UI |
| `label` | 14 / 20px | 500 | Labels inside md controls, nav rows, buttons. The default control text |
| `body-lg` | 16 / 24px | 400 | Reading text on marketing pages and other long-form copy |
| `label-lg` | 16 / 24px | 500 | Labels inside lg controls |

### Headings (`--font-display`)

| Style | Size / line | Weight | Letter spacing | Usage |
| --- | --- | --- | --- | --- |
| `title` | 18 / 28px | 600 | 0 | Section titles inside panels; dialog titles; empty-state titles |
| `heading-3` | 20 / 28px | 600 | 0 | Page sub-heads |
| `heading-2` | 24 / 32px | 600 | −0.01em | Page titles in an app |
| `heading-1` | 32 / 40px | 600 | −0.01em | Marketing and onboarding headings |
| `display` | 40 / 48px | 600 | −0.02em | Hero headline on a website only |

Each style is also a class with the `mu-` prefix (`.mu-caption`, `.mu-heading-2`) in `@usememos/ui/styles.css`, which sets the family, size, line height, weight and, where listed, letter spacing.

## Prose

Rendered content (notes, comments, changelogs, website pages) uses the `Prose` styles, not the scale above. See [Prose](components/prose.md).
