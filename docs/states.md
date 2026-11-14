# States

Behavioral states are complete, but they do not each require a different appearance. Reuse the smallest treatment that communicates the action or saved state. See the [Linear reference](design-reference.md) for the basis of this contract.

| State | Looks like |
| --- | --- |
| Hover | Interactive keys go to `key-hover`; actionable rows and ghost buttons use `hover`. Passive content and ordinary table rows do not highlight. Bounded controls keep their quiet `edge`; fields and switches keep their fill. Invalid fields keep `danger`. Muted action labels go to `text`; Field labels keep their contextual color. Primary keys go to `primary-hover`. |
| Pressed (while held) | Actions reuse their hover highlight immediately: neutral uses `key-hover`, ghost and actionable rows use `hover`, primary uses `primary-hover`, danger retains `danger-key`. No extra border, movement, scale or filter. Toggles do not imitate a selected state before activation |
| Pressed toggle (on) | Default: `well` and `text`. Soft: `selected` and `text`, retained on hover; the reserved border stays transparent |
| Selected (one of several) | A flat `key` fill in a quiet well that updates immediately to the chosen item, with `text` for its label and icon; no visible group or selected-key border in normal colors. Hover only changes label and icon contrast; focus reuses `mu-focus` |
| Checked | A flat `primary` fill with an `on-primary` mark |
| Loading | The control becomes inert at once. After 300ms it hides its label and shows a Spinner without changing size; short waits keep the label |
| Disabled | `text-disabled` text, quiet borders and `well` on all Button variants and other filled controls; no whole-control opacity, hover or press response |
| Invalid | A `danger` edge on the field, plus an error line with an icon under it |
| Focus (field) | The caret or text selection identifies typing focus. Border and surface stay the same under mouse and keyboard focus, with no ring or animation. Invalid fields keep their danger edge; forced colors uses a 2px system edge |
| Focus (everything else) | Reuse the shared 1px border on `:focus-visible`; primary/checked fills use `on-primary`, danger buttons use `on-danger`; text links get a double underline. Invalid non-text controls reuse the same focus edge; their error message keeps communicating the error |
| Focus (inside a widget) | Menu items and options take the `hover` fill. No ring |

## Combined states

Apply states by what they communicate, not by whichever selector happens to win. These rules cover shipped components and app-owned parts alike.

| Combination | Result |
| --- | --- |
| Disabled + any pointer/focus state | No hover, press or focus highlight. Label, icon, value, placeholder, description and shortcut inside the unavailable control/row use `text-disabled`, including a danger action. Keep geometry and weight unchanged |
| Disabled + saved selection | Keep the selected fill, mark or knob position recognizable; dim text and marks. Disabled choice controls use their documented disabled surface. Never erase the saved choice |
| Invalid + disabled | Disabled control appearance wins. An existing error message outside the control remains `danger`; disabling does not silently remove its explanation |
| Invalid + keyboard focus | Text entry retains its invalid edge and caret/selection. Other controls use the shared focus edge while the error message continues to identify the error. Forced-colors focus remains visible |
| Selected + hover/focus | Retain the saved selection. Apply only the family's shared transient treatment, without changing columns, weight or boundary strength |
| Loading + disabled | Loading immediately blocks activation and keeps the action's identity and dimensions; its delayed spinner communicates waiting. Ordinary disabled styling must not replace the loading treatment |

Supporting text outside an unavailable control is still information: a Field hint explaining availability keeps `text-secondary`, and its error keeps `danger`. This differs from the description inside a disabled actionable row, which dims with that row. State selectors must cover all owned parts, including nested indicators, and exclude disabled controls from transient treatments.

## Rules

- An event does not need its own visual style. Text entry keeps its border, surface and geometry under hover, focus and press. Validation alone changes the ordinary field edge, immediately and without animation.
- Hover, press and keyboard focus feedback are immediate. Actionable rows and actions reuse a highlight for pointer hover and touch press; do not invent a second held-state frame. Tabs and single-choice groups update their selected key without a slide.
- Keep state styling minimal. Reuse the shared component and foundation treatments; add a separate treatment only when it communicates a distinct action or state. A component does not need a new fill, border, scale or animation for every pointer or focus event.
- Persistent states and hover never strengthen a quiet boundary. Reserve `control-edge` for small checkbox/radio markers; text colors are not border colors. Focus and invalid states keep their explicit boundary treatments.
- Keep selection persistent and independent of transient events. A selected fill is not a focus border. Reuse `mu-focus` for the shared focus behavior instead of defining component-specific focus variants.
- Hover confirms an action, not the presence of content. Do not highlight a non-interactive container or data row merely because the pointer crosses it.
- Press feedback does not move or resize a control, apply a brightness filter, or animate its mark. Checkbox and Radio marks change immediately. A Switch's knob still moves to show its saved state.
- Hover never changes size, weight or layout.
- An input never changes its background on hover or focus, so it never looks disabled.
- Control focus borders show for keyboard focus only (`:focus-visible`), never on mouse click. Text fields use the visible caret or text selection for typing focus and keep their normal boundary.
- Focus changes the existing edge, never adds a ring or visible outline. Filled controls use their contrasting text color at the edge for keyboard focus, not as a new pointer-held border.
- Popups, dialogs and panels never show a focus ring when they open and take focus.
- Opening and closing content retain the minimal shared [Motion](motion.md) transition. This does not animate focus, hover, press or navigation within the content; those respond immediately.
- Focused borders use 2px in the system `Highlight` color in forced-colors mode. No shadow or outline fallback is needed.
- In forced-colors mode, segmented selection keeps a system-colored key border and on toggles get a system-colored boundary, distinct from the shared focus treatment.
- Disabled controls stay in place. Prefer explaining why something is unavailable over hiding it.
- Button waits 300ms before showing its spinner. It ignores presses and sets `aria-busy` immediately, cancels the delay when loading ends, and removes the spinner as soon as work finishes. Other loading indicators follow the same delay policy.

## Applying the shared treatments

| Component family | Default feedback |
| --- | --- |
| Actions: Button and Link | Shared fill, edge or underline feedback, without movement or filters. All Button variants share the disabled well and edge |
| Fields: Input, Textarea and Combobox input | Keep the border, surface and geometry fixed through hover, focus and press. The caret or text selection indicates typing focus; validation alone recolors the ordinary edge |
| Choices: Checkbox, Radio, Switch, Toggle, ToggleGroup and Tabs | Keep the saved state explicit through a mark, knob position or selected fill. Do not resize on press or imitate selection before activation |
| Actionable rows: Menu, Select, Combobox options and List.ItemButton | Use the shared highlighted fill. Keep Base UI's interaction behavior |
| Containers: Dialog, Drawer, Popover and Toast | Feedback belongs to their controls, not an extra container hover effect. Keep visibility, dismissal and Toast expansion behavior |
| Passive content: ordinary Table/List rows, Badge and Separator | No automatic hover or press treatment. Interactive elements inside them use their own shared treatment |
| Loading: Spinner, Skeleton and loading actions | Show progress without changing layout. Keep their existing timing and reduced-motion behavior |

These defaults apply to new components and app-built parts too. Reuse the existing tokens, size rows, classes and state behavior before introducing a new treatment.
