# Motion

Motion explains state and position: knobs and selections settle, and popups appear or disappear. Controls stay still under the pointer. Motion is quick and never added just to decorate an event.

## Rules

- **Press.** Buttons use shared fill and border color changes over `duration-press` (80ms). No press translation, scaling or brightness filters. Switch knobs, checkboxes and radios do not resize while held.
- **Selection.** Knobs and the segment key slide over `duration-settle` (150ms) with `ease-settle`. Checkbox and Radio marks appear immediately with their state, without a delayed fade or scale animation.
- **Popups.** Menus, popovers and collapsible content fade in and rise 4px over `duration-fade` (100ms). Dialogs do the same over `duration-settle`. Sheets slide up 24px.
- **Tooltips** wait 400ms on hover before they open, and open at once on keyboard focus.
- **Collapsible content** fades and rises in. There is no height animation, so long content never stutters.
- **Spinners** turn once every 0.8s. **Skeletons** shimmer once every 1.4s.
- **Reduced motion.** Under `prefers-reduced-motion`, keep color and opacity changes, and drop slides, scaling and shimmer.

## Tokens

| Token | Value | Usage |
| --- | --- | --- |
| `duration-press` | 80ms | Short control fill and border changes |
| `duration-settle` | 150ms | Knobs and keys slide on release; dialogs open |
| `duration-fade` | 100ms | Popups open; content inside a control fades in after the key stops |
| `duration-spin` | 800ms | One turn of a Spinner |
| `duration-shimmer` | 1400ms | One pass of a Skeleton's shimmer |
| `ease-settle` | `cubic-bezier(0.2, 0.9, 0.3, 1)` | Slides: hard deceleration at the end, like a light spring |
| `ease-out` | `cubic-bezier(0.2, 0, 0, 1)` | Press and fades |
