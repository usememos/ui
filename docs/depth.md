# Surfaces and boundaries

The interface is flat. Fills identify controls and state; borders separate adjacent or overlapping surfaces. No component uses shadows, key sheen, focus rings or visible CSS outlines.

## Roles

| Role | Class | Used for | Treatment |
| --- | --- | --- | --- |
| Well | `mu-well` | Recessed surfaces and parts that hold state | `well` with a quiet 1px `edge`; state markers add their own treatment |
| Key | `mu-key` | Bounded controls, such as neutral buttons | `key` with a quiet 1px `edge` where a boundary is needed |
| Popup | `mu-popup` | Menus, popovers, dialogs and toasts | `surface`, a 1px `edge` and `radius-xl` |
| Content | none | Text fields and content | Fields use `surface` and a quiet `edge`; content has no enclosing box |

Use these classes before writing new surface styles. `mu-key` covers both a control and a selected choice; neither is raised. Dialogs use `radius-2xl`, and Drawers have an edge facing the page.

## Rules

- No `box-shadow`, `text-shadow`, sheen gradients, focus rings or visible `outline`. `outline: none` or `0` only suppresses a browser outline when another visible focus treatment exists.
- Text entry keeps its `surface` fill on hover and focus. Enabled fields never use a gray well; disabled fields use `well` with `text-disabled` text.
- Boundary strength follows its job. Text entry starts with a quiet 1px `edge`, uses `control-edge` on hover, and takes a 1px ink edge on focus. A resting text field does not need the same visual weight as a checkbox or switch's state marker. The quiet field boundary is below 3:1 in the built-in themes; this treatment does not guarantee WCAG 1.4.11 for text entry.
- A checked checkbox or radio uses `primary` with an `on-primary` mark. A switch also moves its knob.
- Neutral buttons, Select triggers and switch tracks use a quiet `edge` at rest, and `control-edge` on hover. A switch keeps its contrasting `text` knob when off, so state remains visible without a heavy track. Focus uses a fine contrasting border. Checkbox and Radio keep `control-edge` around their small unchecked marks; a pressed Toggle keeps its strong state boundary.
- A single choice among peers uses a contrasting selected fill in a well. The group has no visible border at rest; the selected key has a `text-secondary` border so the choice stays distinct in both themes. Borders reserve space, so geometry stays fixed. In forced colors the selected key gains a text-colored border. An independent on/off toggle uses `well` and `control-edge` when on.
- Surface classes start with a quiet resting boundary. `mu-key` uses a contrasting `text-secondary` edge with Base UI's `data-selected` / `data-pressed`, or `aria-selected="true"` / `aria-pressed="true"`; a pressed Toggle has its own strong boundary. Do not darken every resting surface to make one selected item visible.
- Floating surfaces have a border so they remain distinct over the same surface color. Modal backdrops still use `overlay`.
- Content is grouped by spacing, headings and separators. The boxed exceptions are List, bordered Table and bordered Form.
- Borders count toward the documented padding. Reserve their space and compensate inner padding so states never move text or change a control's size.

## Focus

- `mu-focus` recolors the existing 1px border on `:focus-visible`. The fine edge keeps compact controls calm while contrasting with the fill. It provides the internal `--mu-control-border-width` variable. A custom control reads that variable for its border and subtracts it from its padding, so its text and size stay fixed. Text-only links use an underline instead.
- The edge uses `focus` ink. On primary and checked fills it uses `on-primary`; danger buttons use `on-danger`, so the edge contrasts with the fill.
- Fields darken their existing 1px `edge` to ink on any focus. Invalid text fields keep `danger` on hover and focus; their caret also identifies the typing focus.
- Invalid non-text controls use a 2px focus edge: if the border stays danger, color alone would not distinguish focus from the invalid resting state.
- Text links use a double underline on keyboard focus, including links already underlined at rest.
- Menu items and options use their highlighted fill. Opening a popup never draws a focus boundary around the popup.
- In forced-colors mode, focused borders use 2px in the system `Highlight` color. Real borders remain visible without a shadow or outline fallback.
