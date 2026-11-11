# Surfaces and boundaries

The interface is flat. Fills identify controls and state; borders separate adjacent or overlapping surfaces. No component uses shadows, key sheen, focus rings or visible CSS outlines.

## Roles

| Role | Class | Used for | Treatment |
| --- | --- | --- | --- |
| Well | `mu-well` | Unchecked boxes and radios, pressed toggles | `well` with a 1px `control-edge` |
| Key | `mu-key` | Bounded controls, such as neutral buttons | `key` with a 1px `control-edge` where a boundary is needed |
| Popup | `mu-popup` | Menus, popovers, dialogs and toasts | `surface`, a 1px `edge` and `radius-xl` |
| Content | none | Text fields and content | Fields use `surface` and `control-edge`; content has no enclosing box |

Use these classes before writing new surface styles. `mu-key` covers both a control and a selected choice; neither is raised. Dialogs use `radius-2xl`, and Drawers have an edge facing the page.

## Rules

- No `box-shadow`, `text-shadow`, sheen gradients, focus rings or visible `outline`. `outline: none` or `0` only suppresses a browser outline when another visible focus treatment exists.
- Text entry keeps its `surface` fill on hover and focus. Enabled fields never use a gray well; disabled fields use `well` with `text-disabled` text.
- A checked checkbox or radio uses `primary` with an `on-primary` mark. A switch also moves its knob.
- Select triggers and switch tracks use a quiet `edge` at rest; focus still thickens to a strong contrasting border.
- A single choice among peers uses a contrasting selected fill in a well. Neither the group nor its selected key has a visible border at rest; transparent borders reserve space, so geometry stays fixed. In forced colors the selected key gains a text-colored border. An independent on/off toggle uses `well` and an `edge` when on.
- Floating surfaces have a border so they remain distinct over the same surface color. Modal backdrops still use `overlay`.
- Content is grouped by spacing, headings and separators. The boxed exceptions are List, bordered Table and bordered Form.
- Borders count toward the documented padding. Reserve their space and compensate inner padding so states never move text or change a control's size.

## Focus

- `mu-focus` thickens the existing border from 1px to `focus-edge-width` on `:focus-visible`. It provides the internal `--mu-control-border-width` variable. A custom control reads that variable for its border and subtracts it from its padding, so its text and size stay fixed. Text-only links use an underline instead.
- The edge uses `focus` ink. On primary and checked fills it uses `on-primary`; danger buttons use `on-danger`, so the edge contrasts with the fill.
- Fields darken and thicken their own border from 1px to `focus-edge-width` on any focus. Invalid fields keep `danger` and thicken the same way.
- Text links use a double underline on keyboard focus, including links already underlined at rest.
- Menu items and options use their highlighted fill. Opening a popup never draws a focus boundary around the popup.
- In forced-colors mode, focused borders use the system `Highlight` color. Real borders remain visible without a shadow or outline fallback.
