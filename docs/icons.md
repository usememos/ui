# Icons

Memos UI uses [Lucide](https://lucide.dev) (ISC license) for every icon. Apps import icons from `lucide-react` and pass them to components as elements. The design system does not wrap or re-export the set.

```tsx
import { Pin, Trash2 } from "lucide-react";

<Button icon={<Pin />}>Pin</Button>
<Menu items={[{ value: "delete", label: "Delete", icon: <Trash2 />, danger: true }]} />
```

## Rules

- **Icons are elements, not names.** Components take `icon={<Pin />}`, never `icon="pin"`.
- **Size comes from the control.** An icon inside a component is 14px at sm, 16px at md and 20px at lg (`icon-sm`, `icon-md`, `icon-lg`). Don't pass `size`.
- **Stroke is fixed in screen pixels.** 1.25px at sm and in badges, 1.5px at md and lg, and 2px for the check in a checkbox. At 1.5px an icon matches the stem weight of the label text beside it. CSS applies `vector-effect: non-scaling-stroke`, which matches Lucide's `absoluteStrokeWidth`, so no props are needed. Don't pass `strokeWidth`.
- **Color is `currentColor`.** Icons follow the text color: `ink` in controls, `ink-muted` in menu rows, the tone color in toasts.
- **Icons sit in a fixed square.** In a menu row or a control, the icon square keeps labels aligned whether or not a row has an icon.
- **Accessibility.** Icons are `aria-hidden`. Every icon-only Button or Toggle has an `aria-label`, and a Tooltip with the same text.
- **Standalone icons.** Outside a component, add `className="mu-icon"` to get the same size and stroke rules.

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
| Link | `ArrowUpRight` (external links) |

## Missing icons

When Lucide doesn't have an icon, draw it on Lucide's 24px grid with 2px round strokes and round joins, then export it from the package under a Lucide-style name (`PascalCase`, describing the shape, not the feature).
