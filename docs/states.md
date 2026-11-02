# States

Every interactive component handles these states the same way.

| State | Looks like |
| --- | --- |
| Hover | Keys go to `key-hover`. Rows, ghost buttons and wells go to `hover`. An input's edge goes to `ink-muted`. Muted labels go to `ink`. Primary keys go to `primary-hover` |
| Pressed (while held) | Keys move down 0.5px and use `shadow-pressed`. A ghost button sinks into a `well` with `shadow-track` |
| Pressed toggle (on) | Sinks into a `well` with an `edge` and `ink` text |
| Selected (one of several) | A raised key in a well that slides to the chosen item |
| Checked | A flat `primary` fill with an `on-primary` mark |
| Loading | The control keeps its size, hides its label and shows a Spinner. It is inert while loading |
| Disabled | 45% opacity, `cursor: not-allowed`, and no hover or press response |
| Invalid | A `danger` edge on the field, plus an error line with an icon under it |
| Focus (field) | The edge darkens from 1px `edge` to 1.5px `focus-edge` (ink), on click and keyboard alike. No ring around it. An invalid field's `danger` edge thickens the same way |
| Focus (everything else) | A 2px ink `focus` ring 1px outside the edge, on `:focus-visible` (keyboard) only |
| Focus (inside a widget) | Menu items and options take the `hover` fill. No ring |

## Rules

- Hover never changes size, weight or layout.
- An input never changes its background on hover or focus, so it never looks disabled.
- Focus rings show for keyboard focus only (`:focus-visible`), never on mouse click. Fields are the exception: a clicked field is focused for typing, so its edge darkens, but it still gets no ring.
- Focus is ink, never blue, and never a ring floating away from the control.
- Popups, dialogs and panels never show a focus ring when they open and take focus.
- Every focus style survives forced-colors mode: rings are outlines, and fields add a transparent outline that the system paints.
- Disabled controls stay in place. Prefer explaining why something is unavailable over hiding it.
- Loading never shows a spinner for less than about 300ms; short waits pass silently.
