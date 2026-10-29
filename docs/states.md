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
| Focus | A 2px `focus` outline with a 2px offset, on `:focus-visible` only |

## Rules

- Hover never changes size, weight or layout.
- An input never changes its background on hover or focus, so it never looks disabled.
- Focus rings show for keyboard focus only (`:focus-visible`), never on mouse click.
- Disabled controls stay in place. Prefer explaining why something is unavailable over hiding it.
- Loading never shows a spinner for less than about 300ms; short waits pass silently.
