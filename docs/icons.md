# Icons

Memos UI uses [Lucide](https://lucide.dev) (ISC license) for every icon. Apps import icons from `lucide-react` and pass them to components as elements. The design system does not wrap or re-export the set.

```tsx
import { Pin, Trash2 } from "lucide-react";

<Button icon={<Pin />}>Pin</Button>
<Menu.Item icon={<Trash2 />} danger>Delete</Menu.Item>
```

## Rules

- **Icons are elements, not names.** Components take `icon={<Pin />}`, never `icon="pin"`.
- **Size comes from the control.** An icon inside a component is 12px at xs, 14px at sm and 16px at md (`icon-xs`, `icon-sm`, `icon-md`). Don't pass `size`.
- **One stroke, fixed in screen pixels.** Every icon, at every size and in badges, draws the `icon-stroke` token: 1.25px. The check in a checkbox is the one exception, at 2px. Apps don't change the token. At 1.25px a 16px outline glyph (calendar, paperclip, search) reads no heavier than the 14px weight-400 text beside it: an icon puts more ink in its box than a letter does, so matching the letters' stem width would read heavier. CSS applies `vector-effect: non-scaling-stroke`, which matches Lucide's `absoluteStrokeWidth`, so no props are needed. Don't pass `strokeWidth`.
- **Color is `currentColor`.** Icons follow the text color: `ink` in controls, `ink-muted` in menu rows, the tone color in toasts.
- **Icons sit in a fixed square.** In a menu row or a control, the icon square keeps labels aligned whether or not a row has an icon.
- **Accessibility.** Icons are `aria-hidden`. Every icon-only Button or Toggle has an `aria-label`, and a Tooltip with the same text.
- **Standalone icons.** Outside a component, give the icon a size class: `mu-icon-xs` (12px), `mu-icon-sm` (14px) or `mu-icon-md` (16px), all with the 1.25px stroke. Each sets the box and the stroke together, so a heading's icon or an empty state's icon matches the icons in controls. `mu-icon` alone takes the size of the nearest size row (`mu-s-*`), or 16px outside one. Don't size an icon with a utility such as `size-4`: it changes the box but not the stroke.

  ```tsx
  <h2 className="mu-title"><Inbox className="mu-icon-sm" aria-hidden /> Inbox</h2>
  ```

## Built-in glyphs

These components bring their own Lucide icons, so the app doesn't pass them:

| Component | Icons |
| --- | --- |
| Checkbox | `Check` |
| Select | `ChevronDown`, `Check` |
| Combobox | `Search`, `ChevronDown`, `Check` |
| Menu | `Ellipsis` (default trigger), `Check` |
| Collapsible | `ChevronRight` (turns 90° when open) |
| Toast | `Info`, `CircleCheck`, `TriangleAlert`, `CircleAlert`, `X` |
| Field | `CircleAlert` (errors) |
| Dialog, Drawer | `X` |
| Link | `ArrowUpRight` (external links) |

## Missing icons

When Lucide doesn't have an icon, draw it on Lucide's 24px grid with 2px round strokes and round joins, then export it from the package under a Lucide-style name (`PascalCase`, describing the shape, not the feature).
