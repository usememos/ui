# Size, spacing and layout

## Control sizes

Every control takes one `size` prop: `xs`, `sm` or `md` (the default). There is no `lg`. The size sets every value in its row together. Never mix rows in one component.

| Size | Height | Padding | Icon | Icon gap | Text | Radius | Check box |
| --- | --- | --- | --- | --- | --- | --- | --- |
| xs | `control-xs` 20px | 6px | 12px | 4px | 11 / 16px | `radius-sm` 4px | 14px |
| sm | `control-sm` 24px | 8px | 14px | 4px | 13 / 18px | `radius-sm` 4px | 16px |
| md (default) | `control-md` 32px | 12px | 16px | 6px | 14 / 20px | `radius-md` 6px | 18px |

- Use `sm` for dense toolbars, table rows and filters inside panels, and `md` everywhere else, including marketing pages, onboarding and sheets. A sidebar with 28px rows puts the `mu-compact` class on itself: md controls and rows inside are `control-compact` (28px) tall, with md text, icons, padding and radius (see [A sidebar navigation row](usage.md#a-sidebar-navigation-row)). It is the only height between sizes, and it is not a `size` value. Floating lists (Menu, Select and Combobox lists) use it for their sm rows too: an sm list has 28px rows with sm text and icons, because a 24px row is cramped inside a 12px-radius popup. Emphasis comes from the `primary` variant, not from a bigger control. On touch screens the hit area, not the visual size, grows.
- Use `xs` for secondary actions beside 13px text: actions on a row or an entry, inline formatting, filters in a tight header, checkboxes in a dense list. It is the height of a Badge or a Kbd, so they line up. Don't use `xs` for forms, for navigation, or for the main action of a screen.
- Only Button, Toggle, ToggleGroup, Checkbox, RadioGroup and Radio, Switch, Avatar, Spinner and Skeleton take `xs`. Text entry, menus, tabs and tables are too cramped at 20px, so their `size` is `sm | md`, and an `xs` inherited from a parent renders them at `sm`.
- The icon side of a control has 2px less padding, so text and icon look centered.
- On touch screens (`pointer: coarse`), every control gets an invisible hit area of at least `hit-area` (44px) without changing its visual size.

## Spacing

Layout spacing comes from one ladder of nine steps, and each step has a job. Two rules decide every gap:

- Closer means more related. A title is nearer to its own text than to the block before it.
- A container's padding is never smaller than the gap between its blocks.

| Token | Value | Job | Where |
| --- | --- | --- | --- |
| `space-1` | 4px | Parts of one thing | Label to control, title to description, control to hint; the gap between sm controls |
| `space-2` | 8px | Controls side by side; a title to its list | Buttons in a row, tags, a section title to its List, a Fieldset legend to its options, the lines of an entry |
| `space-3` | 12px | Rows in a set; blocks on a small surface | Options in a Fieldset or RadioGroup, blocks in a Popover or Toast |
| `space-4` | 16px | Blocks in a container | Fields in a form, two blocks of one section; padding of popovers and boxed forms; page padding on phones |
| `space-5` | 20px | Padding of big surfaces; above a Prose heading | Padding of dialogs and drawers; the space above a heading and around a rule in Prose. Nowhere else: between other things use 16 or 24 |
| `space-6` | 24px | Groups | Sections and entries on a page, content to its footer; page padding on desktop |
| `space-8` | 32px | Regions of a page | A page header band to the content, one column to the next; above and below an empty state |
| `space-12` | 48px | Website sections | The rhythm between sections of a marketing page |
| `space-16` | 64px | Website hero and footer | The padding of a hero or a footer |

- `inset` (2px) is not a layout step. It is the gap between a well and the key inside it, and between items inside one cluster (a toolbar). Inside a well the gap is 0.
- Inside a control the size row sets the spacing (see [Control sizes](#control-sizes)): 6px between an md icon and its text, 6px of padding at xs and in a menu, 2px less padding on a control's icon side. These are optical values of the control, not layout steps. Don't use 6px or 10px between things.
- `space-8`, `space-12` and `space-16` are for an app's page layout. No component uses them.

Every surface follows the same two tiers. Big surfaces pad `space-5` and stack `space-4`; small ones pad `space-4` and stack `space-3`.

| Surface | Padding | Between blocks | Title to description | Content to footer |
| --- | --- | --- | --- | --- |
| Dialog, Drawer | 20px | 16px | 4px | 24px |
| Form, `bordered` | 16px | 16px | 4px | 16px, then a footer bar |
| Popover | 16px | 12px | 4px | |
| Toast | 12px, 16px at the start | 12px | 0: one block of text | |
| Fieldset | | 12px | 8px from the legend to its options | |
| Field | | 4px between label, control and hint | | |

The playground has three reference screens built only from these steps: a settings page, a timeline and an empty page (`#screen-settings`, `#screen-timeline` and `#screen-empty`, in `playground/screens.tsx`). The screenshot tests cover them, so a spacing change is judged on a whole screen, not only on one component. An app's pages copy their spacing.

### Spacing in an app

An app's own layout uses the same steps for the same jobs.

- In CSS, read the token: `gap: var(--mu-space-4)`.
- In Tailwind CSS, the class number is the token number, so `gap-4` is `space-4` (16px). The ladder is `1`, `2`, `3`, `4`, `5`, `6`, `8`, `12` and `16`. `0` and `px` are fine, and `gap-0.5` (2px) is `inset`, for the items of one cluster only.
- `p-1.5`, `p-2.5`, `p-7`, `p-10` and lengths such as `gap-[6px]` are not steps.
- Pick a step by its job, not by the nearest number. 6px between two buttons becomes `gap-2`, because they are controls side by side. 6px between a label and its field becomes `gap-1`, because they are parts of one thing.

The package exports the ladder, and a check for an app's tests:

- `spacingSteps` is the ladder in px: `[4, 8, 12, 16, 20, 24, 32, 48, 64]`.
- `offLadderSpacing(source)` returns the Tailwind CSS padding, margin and gap classes in a text whose value is not a step, as written: `["gap-1.5", "px-[10px]"]`. It reads the `p`, `m`, `gap` and `space` classes that have a number or a px or rem length, with or without a variant or a minus sign. It does not check widths, heights or positions, and it skips a value it cannot measure (`auto`, a variable, a `calc()`).

Run it over the app's source files:

```ts
import { offLadderSpacing } from "@usememos/ui";

const sources = import.meta.glob<string>("/src/**/*.{ts,tsx,css}", { query: "?raw", import: "default", eager: true });

it("uses only ladder steps for padding, margin and gap", () => {
  const off = Object.entries(sources).flatMap(([file, text]) => offLadderSpacing(text).map((name) => `${file}: ${name}`));
  expect(off).toEqual([]);
});
```

- Vitest reads a stylesheet with `?raw` only when `test.css` is `true` in its config. Without it every `.css` file comes back empty, so its `@apply` classes are skipped without an error.
- An app that is still moving to the ladder compares the count with a number, and lowers the number as it goes: `expect(off.length).toBeLessThanOrEqual(40)`.
- A real exception, such as padding that makes room for a side panel of a fixed width, is filtered out by name in the app's test, with a comment that says why.

## Radius

Inner radius = outer radius − `inset`, so nested corners stay concentric. Floating lists follow the same rule with their padding: 6px (`radius-xl` − `radius-md`), so an md row's highlight is concentric with the popup's corner, and an sm row's 4px corner sits inside it.

| Token | Value | Usage |
| --- | --- | --- |
| `radius-xs` | 2px | Keys inside sm wells (`radius-sm` minus the 2px inset); inline code |
| `radius-sm` | 4px | sm controls |
| `radius-md` | 6px | md controls, the default |
| `radius-lg` | 8px | Images in Prose |
| `radius-xl` | 12px | Menus, select lists, popovers and toasts |
| `radius-2xl` | 16px | Dialogs and sheets |
| `radius-full` | 9999px | Avatars, radios, switches and their knobs, and badges only |

Buttons and inputs are never pills; badges always are, so a label is never mistaken for a control.

## Sizes

| Token | Value | Usage |
| --- | --- | --- |
| `control-xs` | 20px | xs control height; Badge and Kbd |
| `control-sm` | 24px | sm control height |
| `control-md` | 32px | Default control height |
| `control-compact` | 28px | md height inside `mu-compact`, for an app's sidebar; sm row height in menus, select lists and combobox lists |
| `inset` | 2px | Well-to-key inset at every size |
| `hit-area` | 44px | Minimum touch target on `pointer: coarse`, added invisibly around a control |
| `focus-edge-width` | 2px | Edge width of a focused control or field |
| `icon-xs` | 12px | Icons in xs controls and badges |
| `icon-sm` | 14px | Icons in sm controls |
| `icon-md` | 16px | Icons in md controls and rows |
| `icon-stroke` | 1.25px | Stroke of every icon, in screen pixels, at every size. Only the checkbox check differs (2px) |

## Layout

| Token | Value | Usage |
| --- | --- | --- |
| `content-width` | 720px | Maximum width of a reading column: a timeline, a settings form, an article |
| `sidebar-width` | 240px | Width of a fixed navigation sidebar from `breakpoint-md` up |
| `menu-width` | 160px | Minimum width of a menu, select list or combobox list. Above it, the longest row sets the width |
| `menu-max-width` | 280px | Maximum width of a menu or select list: labels truncate and descriptions wrap here |
| `list-height` | 240px | Maximum height of a combobox list before it scrolls |
| `popover-width` | 280px | Default width of a popover |
| `tooltip-width` | 240px | Maximum width of a tooltip |
| `toast-width` | 360px | Width of a toast from `breakpoint-sm` up |
| `dialog-width` | 440px | Default width of a dialog |
| `drawer-width` | 320px | Default width of a drawer from the start or end edge |

- `content-width` and `sidebar-width` are suggested values for an app's page layout. No component uses them. An app that needs another width uses its own value instead of overriding the token.
- The other widths are component defaults. To change one instance, pass `className` or `style` to it.

## Breakpoints

Two breakpoints. They are values, not tokens: CSS custom properties can't be used in media queries, so there is no `--mu-breakpoint-*` variable and nothing to override. Write the value in the query and name the breakpoint in a comment.

| Breakpoint | Value | Usage |
| --- | --- | --- |
| breakpoint-sm | 640px | Below this: one column, dialogs and menus become sheets, toasts span the top |
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
