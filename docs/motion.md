# Motion

Motion makes depth feel physical: keys sink when pressed, knobs and keys settle with a light spring, and popups fade in. It is quick and never decorative.

## Rules

- **Press.** Keys move down 0.5px and switch to `shadow-pressed` over `duration-press` (80ms). Switch knobs grow about 10%. Checkboxes and radios shrink 6%.
- **Release and selection.** Knobs and the segment key slide over `duration-settle` (150ms) with `ease-settle`, which stops hard like a light spring. Content inside a control (a check mark, a value) fades in after the key stops.
- **Popups.** Menus, popovers and collapsible content fade in and rise 4px over `duration-fade` (100ms). Dialogs do the same over `duration-settle`. Sheets slide up 24px.
- **Tooltips** wait 400ms on hover before they open, and open at once on keyboard focus.
- **Collapsible content** fades and rises in. There is no height animation, so long content never stutters.
- **Spinners** turn once every 0.8s. **Skeletons** shimmer once every 1.4s.
- **Reduced motion.** Under `prefers-reduced-motion`, keep color, opacity and shadow changes, and drop slides, scaling and shimmer.

## Tokens

| Token | Value | Usage |
| --- | --- | --- |
| `duration-press` | 80ms | Pointer down: keys sink, knobs grow |
| `duration-settle` | 150ms | Knobs and keys slide on release; dialogs open |
| `duration-fade` | 100ms | Popups open; content inside a control fades in after the key stops |
| `ease-settle` | `cubic-bezier(0.2, 0.9, 0.3, 1)` | Slides: hard deceleration at the end, like a light spring |
| `ease-out` | `cubic-bezier(0.2, 0, 0, 1)` | Press and fades |
