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
- Boundary strength follows its job. Resting, hovered and persistently selected surfaces never borrow text or focus colors for their borders. Text entry keeps its quiet 1px `edge` under hover, focus and press. A resting text field does not need the same visual weight as a checkbox or switch's state marker. The quiet field boundary is below 3:1 in the built-in themes; this treatment does not guarantee WCAG 1.4.11 for text entry.
- A checked checkbox or radio uses `primary` with an `on-primary` mark. A switch also moves its knob.
- Neutral buttons, Select triggers and switch tracks keep the quiet `edge` on hover. Button and Select fills provide hover feedback; fields and switches keep their fill. A switch keeps its contrasting `text` knob when off. Checkbox, Radio and Prose task checkboxes alone use `control-edge` around their small unchecked marks. Do not reuse that marker color around a toolbar item or a full control.
- A single choice among peers uses a contrasting `key` fill in a quiet well, with `text` for the selected label and icon. The group and selected key have no visible border in normal colors. Hover only increases label and icon contrast; focus reuses `mu-focus`. Borders reserve space, so geometry stays fixed. In forced colors the selected key gains a text-colored border. An independent on/off toggle uses `well` and `text` when on (`selected` and `text` for `variant="soft"`), with a transparent reserved border. Disabled on toggles keep that fill and use `text-disabled`. In forced colors an on toggle gets a system-colored boundary because its fill may disappear.
- Surface classes describe a surface, not an interaction state. `mu-key` keeps its `key` fill and quiet `edge` even with selected or pressed attributes. Use Toggle for a persistent on/off fill, or a key inside a well for one selected choice. Never turn a text token into a persistent border. Non-text focus and invalid fields are the explicit exceptions to quiet control boundaries.
- Floating surfaces have a border so they remain distinct over the same surface color. Modal backdrops still use `overlay`.
- Content is grouped by spacing, headings and separators. The boxed exceptions are List, bordered Table and bordered Form.
- Borders count toward the documented padding. Reserve their space and compensate inner padding so states never move text or change a control's size.

## Focus

- `mu-focus` recolors the existing 1px border on `:focus-visible`. The fine edge keeps compact controls calm while contrasting with the fill. It provides the internal `--mu-control-border-width` variable. A custom control reads that variable for its border and subtracts it from its padding, so its text and size stay fixed. Text-only links use an underline instead.
- The edge uses `focus` ink. On primary and checked fills it uses `on-primary`; danger buttons use `on-danger`, so the edge contrasts with the fill.
- Input, Textarea and Combobox input boxes keep their border, surface and geometry under hover, focus and press. The visible caret or text selection indicates typing focus; do not recolor the box or animate it. Invalid fields keep `danger`. In forced colors, focused fields use the shared 2px system `focus-edge`. The caret/selection approach follows the text-field examples in [WCAG Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html).
- Invalid non-text controls reuse the shared 1px focus edge. Their error message continues to identify the error; do not add a thicker focus variant for validation.
- Text links use a double underline on keyboard focus, including links already underlined at rest.
- Menu items and options use their highlighted fill. Opening a popup never draws a focus boundary around the popup.
- In forced-colors mode, focused borders use 2px in the system `Highlight` color. Real borders remain visible without a shadow or outline fallback.
