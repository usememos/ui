# States

Every interactive component handles these states the same way.

| State | Looks like |
| --- | --- |
| Hover | Keys go to `key-hover`. Rows, ghost buttons and wells go to `hover`. A text field's edge goes from quiet `edge` to `control-edge`; invalid fields keep `danger`. Muted labels go to `text`. Primary keys go to `primary-hover`. Neutral button and Select borders strengthen to `control-edge`, as do enabled off switch tracks |
| Pressed (while held) | Buttons move down 0.5px and change fill; neutral and ghost buttons use `well`, primary uses `primary-hover`, danger darkens its fill |
| Pressed toggle (on) | Uses `well` with `control-edge` and the `text` color |
| Selected (one of several) | A flat `key` fill in a well that slides to the chosen item; no visible group border, and a `text-secondary` border around the selected key |
| Checked | A flat `primary` fill with an `on-primary` mark |
| Loading | The control becomes inert at once. After 300ms it hides its label and shows a Spinner without changing size; short waits keep the label |
| Disabled | `text-disabled` text, quiet borders and `well` on filled controls; no whole-control opacity, hover or press response |
| Invalid | A `danger` edge on the field, plus an error line with an icon under it |
| Focus (field) | The 1px edge darkens from `edge` to `focus-edge` (ink), on click and keyboard alike. No ring around it. Invalid text fields keep danger; the caret identifies typing focus |
| Focus (everything else) | The existing 1px border changes to `focus` on `:focus-visible`; primary/checked fills use `on-primary`, danger buttons use `on-danger`; text links get a double underline. Invalid non-text controls use 2px, so their unchanged error color still has a focus cue |
| Focus (inside a widget) | Menu items and options take the `hover` fill. No ring |

## Rules

- Hover never changes size, weight or layout.
- An input never changes its background on hover or focus, so it never looks disabled.
- Control focus borders show for keyboard focus only (`:focus-visible`), never on mouse click. Fields are the exception: a clicked field is focused for typing, so its edge darkens, but it still gets no ring.
- Focus changes the existing edge, never adds a ring or visible outline. Filled controls use their contrasting text color at the edge.
- Popups, dialogs and panels never show a focus ring when they open and take focus.
- Focused borders use 2px in the system `Highlight` color in forced-colors mode. No shadow or outline fallback is needed.
- Disabled controls stay in place. Prefer explaining why something is unavailable over hiding it.
- Button waits 300ms before showing its spinner. It ignores presses and sets `aria-busy` immediately, cancels the delay when loading ends, and removes the spinner as soon as work finishes. Other loading indicators follow the same delay policy.
