# Motion

Keep opening and closing animations. They explain when content appears, where it belongs and when it leaves. Hover, press, focus and frequent selection feedback remain immediate. Controls stay still under the pointer.

Our [Linear reference](design-reference.md) informs this restraint. The timings below are Memos UI decisions, not Linear's published animation specification.

## Rules

- **Text entry.** Input, Textarea and Combobox input boxes have no hover, focus or press animation. Typing focus uses the caret or selection without a border change. Validation recolors the existing edge immediately; the surface and geometry stay fixed. Do not add a treatment just because an event occurs.

- **Frequent feedback.** Hover, press, keyboard focus and label changes have no color or border animation. Actions reuse one highlight rather than adding a held-state edge. `duration-press` is 0ms for these shared treatments. No press translation, scaling or brightness filters.
- **Selection.** Tabs and single-choice ToggleGroups update their selected key immediately, including its position and size. Checkbox and Radio marks also update immediately. Only the Switch knob uses a short positional slide over `duration-settle` (150ms); track, border and knob colors change immediately.
- **One popup treatment.** Select, Menu, Combobox, Popover and Tooltip share a short fade and `space-1` (4px) vertical offset over `duration-fade` (100ms), using `ease-out`. Opening settles to full opacity and no offset; closing returns to the same hidden frame. No scale, bounce, blur, stagger or animated trigger chevron. Select opens below the trigger by default; it has no separate motion variant.
- **Dialogs and drawers.** Dialogs use the same fade and `space-1` offset over `duration-settle` (150ms). A Dialog sheet uses `space-6` (24px) from the bottom. Drawers slide from their attached edge over `duration-settle`, using `ease-settle`, and follow the finger during a swipe. Their backdrops fade with the same duration; no delayed or staged entrance.
- **Tooltips** wait 400ms on hover before opening; keyboard focus has no opening delay. This delay is separate from the short opening transition. Moving between tooltips in a group skips the delay and replayed entrance.
- **Collapsible content** uses the shared 100ms fade and 4px offset for opening and closing. Its height never animates. A chevron may change orientation immediately to identify the open state; it does not rotate through a transition.
- **Toasts** retain their short entrance, exit and stack behavior over `duration-settle`. Do not add bounce, stagger or an extra entrance for their content. See [Toast](components/toast.md) for stack and dismissal behavior.
- **Keep behavior immediate.** Focus management, keyboard navigation, selection and dismissal do not wait for an animation. Opening by keyboard uses the same short content transition; moving focus or the highlighted row inside the open widget never animates. Rapid open/close changes retarget from the current frame instead of queuing or replaying an entrance. Opening and closing share the same short timing; never add a longer exit.
- **Implementation.** Use the existing CSS transitions and Base UI lifecycle attributes. Animate only opacity and translation for opening and closing; keep size, padding, borders and colors fixed. Do not add an animation library or animate content that is already present on initial render.
- **Spinners** turn once every 0.8s. **Skeletons** shimmer once every 1.4s.
- **Reduced motion.** Under `prefers-reduced-motion: reduce`, opening, closing and Switch position changes are immediate: no translation or opacity transition, including backdrops. Remove shimmer and continuous decorative motion. Keep the visible loading state and all interaction behavior.

## Tokens

| Token | Value | Usage |
| --- | --- | --- |
| `duration-press` | 0ms | Immediate shared hover, press and focus feedback |
| `duration-settle` | 150ms | Switch knob position; Dialog and Drawer opening and closing |
| `duration-fade` | 100ms | Shared popup and Collapsible opening and closing |
| `duration-spin` | 800ms | One turn of a Spinner |
| `duration-shimmer` | 1400ms | One pass of a Skeleton's shimmer |
| `ease-settle` | `cubic-bezier(0.2, 0.9, 0.3, 1)` | Switch and Drawer position changes; no bounce |
| `ease-out` | `cubic-bezier(0.2, 0, 0, 1)` | Popup and Dialog opening and closing; backdrop fades |
