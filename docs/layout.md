# Size, spacing and layout

## Control sizes

Every control takes one `size` prop: `sm` or `md` (the default). There is no `lg`. The size sets every value in its row together. Never mix rows in one component.

| Size | Height | Padding | Icon | Icon gap | Text | Radius | Check box |
| --- | --- | --- | --- | --- | --- | --- | --- |
| sm | `control-sm` 24px | 8px | 14px | 4px | 13 / 18px | `radius-sm` 4px | 16px |
| md (default) | `control-md` 32px | 12px | 16px | 6px | 14 / 20px | `radius-md` 6px | 18px |

- Use `sm` for dense toolbars, table rows and filters inside panels, and `md` everywhere else, including marketing pages, onboarding and sheets. Emphasis comes from the `primary` variant, not from a bigger control. On touch screens the hit area, not the visual size, grows.
- The icon side of a control has 2px less padding, so text and icon look centered.
- On touch screens (`pointer: coarse`), every control gets an invisible hit area of at least `hit-area` (44px) without changing its visual size.

## Spacing

Every spacing value comes from the 4px scale. The only exception is `inset` (2px), the gap between a well and the key inside it.

- 0 inside a well.
- 2px between items inside a cluster (a toolbar).
- 8px between controls.
- 16px between fields.
- 24px between groups.

| Token | Value | Usage |
| --- | --- | --- |
| `space-0_5` | 2px | Only for insets: the gap between a well and the key inside it |
| `space-1` | 4px | Gap between sm controls; icon to text in sm; the label-to-control gap in a field |
| `space-2` | 8px | Gap between md controls; sm horizontal padding |
| `space-3` | 12px | md horizontal padding |
| `space-4` | 16px | Padding inside popovers and toasts; gap between fields; page padding on phones |
| `space-5` | 20px | Padding inside dialogs; space above Prose headings |
| `space-6` | 24px | Gap between sections or entries inside a page; page padding on desktop |
| `space-8` | 32px | Gap between page regions |
| `space-12` | 48px | Section rhythm on a website |
| `space-16` | 64px | Hero and footer padding on a website |

## Radius

Inner radius = outer radius − `inset`, so nested corners stay concentric.

| Token | Value | Usage |
| --- | --- | --- |
| `radius-xs` | 2px | Keys inside sm wells (`radius-sm` minus the 2px inset); inline code |
| `radius-sm` | 4px | sm controls; badges |
| `radius-md` | 6px | md controls, the default |
| `radius-lg` | 8px | Images in Prose |
| `radius-xl` | 12px | Menus, select lists, popovers and toasts |
| `radius-2xl` | 16px | Dialogs and sheets |
| `radius-full` | 9999px | Avatars, radios, switches and their knobs only |

Buttons, inputs and badges are never pills.

## Sizes

| Token | Value | Usage |
| --- | --- | --- |
| `control-sm` | 24px | sm control height |
| `control-md` | 32px | Default control height |
| `inset` | 2px | Well-to-key inset at every size |
| `hit-area` | 44px | Minimum touch target on `pointer: coarse`, added invisibly around a control |
| `focus-width` | 2px | Width and offset of the focus ring |
| `icon-sm` | 14px | Icons in sm controls |
| `icon-md` | 16px | Icons in md controls and nav rows |

## Layout

| Token | Value | Usage |
| --- | --- | --- |
| `content-width` | 720px | Maximum width of a reading column: a timeline, a settings form, an article |
| `sidebar-width` | 240px | Width of a fixed navigation sidebar from `breakpoint-md` up |
| `menu-width` | 200px | Minimum width of a menu or select list |
| `list-height` | 240px | Maximum height of a combobox list before it scrolls |
| `popover-width` | 280px | Default width of a popover |
| `tooltip-width` | 240px | Maximum width of a tooltip |
| `toast-width` | 360px | Width of a toast from `breakpoint-sm` up |
| `dialog-width` | 440px | Default width of a dialog |

## Breakpoints

Two breakpoints. They are values, not tokens: CSS custom properties can't be used in media queries, so there is no `--mu-breakpoint-*` variable and nothing to override. Write the value in the query and name the breakpoint in a comment.

| Breakpoint | Value | Usage |
| --- | --- | --- |
| breakpoint-sm | 640px | Below this: one column, dialogs and menus become sheets, toasts sit bottom-center |
| breakpoint-md | 1024px | From this: the sidebar is fixed and the content column is centered |

```css
/* Below breakpoint-sm */
@media (max-width: 639.98px) { … }
```

## Layers

| Token | Value | Usage |
| --- | --- | --- |
| `layer-popup` | 50 | Menus, select lists, popovers, tooltips. Equal to `layer-overlay` on purpose: the one opened last is on top, so a menu opened inside a dialog shows above it |
| `layer-overlay` | 50 | Dialogs, sheets and their backdrops |
| `layer-toast` | 60 | Toasts, above everything |

Use these tokens for every `z-index`. Don't invent new layers in product code.
