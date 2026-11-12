# States

Every interactive component handles these states the same way.

| State | Looks like |
| --- | --- |
| Hover | Interactive keys go to `key-hover`; actionable rows and ghost buttons use `hover`. Passive content and ordinary table rows do not highlight. A text field's edge goes from quiet `edge` to `control-edge`; invalid fields keep `danger`. Muted labels go to `text`. Primary keys go to `primary-hover`. Neutral button and Select borders strengthen to `control-edge`, as do enabled off switch tracks |
| Pressed (while held) | Buttons keep their geometry: neutral and ghost use `well`, primary uses `primary-hover`, danger retains `danger-key`. Filled primary and danger actions use their contrasting text color on the existing edge. Toggles do not imitate a selected state before activation |
| Pressed toggle (on) | Uses `well` with `control-edge` and the `text` color |
| Selected (one of several) | A flat `key` fill in a quiet well that slides to the chosen item, with `text` for its label and icon; no visible group or selected-key border in normal colors. Hover only changes label and icon contrast; focus reuses `mu-focus` |
| Checked | A flat `primary` fill with an `on-primary` mark |
| Loading | The control becomes inert at once. After 300ms it hides its label and shows a Spinner without changing size; short waits keep the label |
| Disabled | `text-disabled` text, quiet borders and `well` on all Button variants and other filled controls; no whole-control opacity, hover or press response |
| Invalid | A `danger` edge on the field, plus an error line with an icon under it |
| Focus (field) | The 1px edge darkens from `edge` to `focus-edge` (ink), on click and keyboard alike. No ring around it. Invalid text fields keep danger; the caret identifies typing focus |
| Focus (everything else) | Reuse the shared 1px border on `:focus-visible`; primary/checked fills use `on-primary`, danger buttons use `on-danger`; text links get a double underline. Invalid non-text controls reuse the same focus edge; their error message keeps communicating the error |
| Focus (inside a widget) | Menu items and options take the `hover` fill. No ring |

## Rules

- Keep state styling minimal. Reuse the shared component and foundation treatments; add a separate treatment only when it communicates a distinct action or state. A component does not need a new fill, border, scale or animation for every pointer or focus event.
- Keep selection persistent and independent of transient events. A selected fill is not a focus border. Reuse `mu-focus` for the shared focus behavior instead of defining component-specific focus variants.
- Hover confirms an action, not the presence of content. Do not highlight a non-interactive container or data row merely because the pointer crosses it.
- Press feedback does not move or resize a control, apply a brightness filter, or animate its mark. Checkbox and Radio marks change immediately. A Switch's knob still moves to show its saved state.
- Hover never changes size, weight or layout.
- An input never changes its background on hover or focus, so it never looks disabled.
- Control focus borders show for keyboard focus only (`:focus-visible`), never on mouse click. Fields are the exception: a clicked field is focused for typing, so its edge darkens, but it still gets no ring.
- Focus changes the existing edge, never adds a ring or visible outline. Filled controls use their contrasting text color at the edge.
- Popups, dialogs and panels never show a focus ring when they open and take focus.
- Focused borders use 2px in the system `Highlight` color in forced-colors mode. No shadow or outline fallback is needed.
- Segmented selection keeps a text-colored key border in forced-colors mode, distinct from the shared focus treatment.
- Disabled controls stay in place. Prefer explaining why something is unavailable over hiding it.
- Button waits 300ms before showing its spinner. It ignores presses and sets `aria-busy` immediately, cancels the delay when loading ends, and removes the spinner as soon as work finishes. Other loading indicators follow the same delay policy.

## Applying the shared treatments

| Component family | Default feedback |
| --- | --- |
| Actions: Button and Link | Shared fill, edge or underline feedback, without movement or filters. All Button variants share the disabled well and edge |
| Fields: Input, Textarea and Combobox input | Recolor the existing edge. Keep the surface and geometry fixed |
| Choices: Checkbox, Radio, Switch, Toggle, ToggleGroup and Tabs | Keep the saved state explicit through a mark, knob position or selected fill. Do not resize on press or imitate selection before activation |
| Actionable rows: Menu, Select, Combobox options and List.ItemButton | Use the shared highlighted fill. Keep Base UI's interaction behavior |
| Containers: Dialog, Drawer, Popover and Toast | Feedback belongs to their controls, not an extra container hover effect. Keep visibility, dismissal and Toast expansion behavior |
| Passive content: ordinary Table/List rows, Badge, Avatar, Kbd, Separator and Prose | No automatic hover or press treatment. Interactive elements inside them use their own shared treatment |
| Loading: Spinner, Skeleton and loading actions | Show progress without changing layout. Keep their existing timing and reduced-motion behavior |

These defaults apply to new components and app-built parts too. Reuse the existing tokens, size rows, classes and state behavior before introducing a new treatment.
