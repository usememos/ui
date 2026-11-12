# Changelog

Changes to `@usememos/ui` that an app can see. New entries go under "Unreleased"; when a release ships, that heading becomes its version (see "Releasing" in `AGENTS.md`). Breaking changes are also marked with `!` in their commit.

## Unreleased

- Select uses one downward chevron and opens its list below the trigger, aligned to its start edge. The selected value has one check; pointer and keyboard targets reuse the shared row highlight. `alignItemWithTrigger={true}` remains available for value-aligned positioning.

- Components retain minimal opening and closing transitions: 100ms for shared popups, including Select, and 150ms for Dialog and Drawer. Keyboard opening and dismissal use the same short transitions; grouped tooltips skip repeated entrances. Hover, focus, press and row navigation remain immediate; Collapsible chevrons change orientation without rotating through a transition. Reduced motion removes content transitions, including fades and backdrops.

- Design rules now use Linear's product-interface principles as an explicit reference: quiet supporting chrome, consistent styling contracts, fewer visual state treatments and purposeful motion. Actions reuse their hover highlight while held, without an extra border. Hover, press, focus and Tabs/ToggleGroup selection update immediately; Switch animates only the knob's position.

- Input, Textarea and Combobox keep the same border and surface under hover, focus and press. The caret or text selection identifies typing focus, without an edge transition or other event animation. Invalid fields keep their error edge; non-text control focus and forced-colors focus retain their treatments.

## 26.11.16

Published 12 November 2026.

- Persistent choices no longer draw heavy borders: on Toggles use a well fill and ink text, and public `mu-key` surfaces keep their quiet edge under selected/pressed attributes. Hover no longer strengthens Button, Select, Input, Textarea, Combobox or Switch boundaries. Keyboard focus, errors and small checkbox/radio markers retain their distinct edges; forced colors preserves on-toggle selection.

- Default Light uses a pale warm-gray paper canvas, with matching wells, hover fills and quiet boundaries. Surfaces and keys stay white; text, ink emphasis, focus and Dark keep their existing colors.

## 26.11.15

Published 12 November 2026.

- Interactive Prose task checkboxes reserve 44px touch targets while keeping their 16px marks and compact read-only layout.
- Select values use regular weight, matching Input and Combobox. Disabled pressed Toggles use quiet edges, and disabled Combobox and Collapsible icons follow their text color.
- Built-in Dialog, Drawer and Toast close buttons and the Combobox chevron include Tooltips, including inside custom portal containers and shadow roots.
- ToggleGroup labels wrap at word boundaries. Groups scroll horizontally when complete words, icons and padding cannot fit, keeping the page within its container.

## 26.11.14

Published 12 November 2026.

- **Clarify Tabs and ToggleGroup usage in the shipped design-system guides.** Tabs switches content panels; ToggleGroup changes layout preferences, filters or independent tool states. Both retain the shared segmented appearance. Runtime behavior and tokens are unchanged.

## 26.11.13

Published 12 November 2026.

- **Breaking: Badge custom colors are restricted to neutral tags in TypeScript.** Omit `tone` or use `tone="neutral"` with `color`. Other tones never used the custom tint and now reject that combination at compile time. `BadgeProps` is now a union type; wrappers use a type intersection instead of extending it with an interface. Existing tones and rendering are unchanged.
- **Disabled ghost actions and held danger actions stay distinguishable.** Disabled ghost buttons share the existing disabled well and edge. Filled primary and danger buttons recolor their reserved edge to the contrasting text color while held, with no movement, filters, new colors or new tokens.
- **Interaction styles use fewer shared effects across the system.** Buttons no longer move or use brightness filters when pressed; Checkboxes and Radios no longer shrink or animate their marks; Switch knobs no longer grow on press. Toggles no longer show selection before activation, and passive table rows no longer highlight on hover. Focus reuses the shared 1px edge without a thicker invalid-control variant; forced colors retains its system treatment. Existing color, size and motion tokens are unchanged.
- **Single-choice ToggleGroups and Tabs have lighter selection.** A quiet well holds the selected key without a dark static border. Groups use the existing size rows, radii and inset; full-width items continue to grow from their natural widths. Hover only changes label and icon contrast, and focus reuses the shared foundation treatment. Forced colors retains the selected-key border.

## 26.11.12

Published 12 November 2026.

### Interaction fixes

- **Touch targets no longer cover neighboring controls.** Buttons, tabs, toggles, fields and option rows reserve at least 44px on coarse pointers. Checkboxes, radios and switches keep their small visual marks, with space reserved around their 44px targets. Menus stay anchored on phones.
- **Custom menu rows show keyboard focus.** Focusable buttons and anchors styled with `menuClasses().item` use the highlighted fill on keyboard focus, including Quick find results.
- **Long toggle and tab labels wrap.** Narrow groups grow to show the complete label instead of cutting off the text; the sliding key follows the group's height.

### Visual changes

- **Focus uses a finer border.** Normal keyboard and field focus recolor the existing 1px edge instead of thickening it to 2px. Filled controls keep a contrasting fine edge, selected states retain their boundaries, and invalid non-text controls and forced-colors mode keep a 2px cue.
- **Text fields have quieter resting borders.** Input, Textarea and Combobox use `edge` at rest, `control-edge` on hover and a fine 1px ink edge on focus. Invalid borders stay `danger` on hover and focus. The resting field boundary no longer promises 3:1 contrast; text colors and field fills are unchanged.
- **Resting control surfaces have quiet boundaries.** Neutral buttons, Select triggers, switch tracks and the public `mu-well` / `mu-key` surfaces use `edge`. Neutral buttons, Selects and off switches strengthen to `control-edge` on hover. Checkbox/Radio markers, pressed Toggles, selected keys and keyboard focus retain their contrasting boundaries. `mu-key` uses a `text-secondary` edge when `data-selected`, `data-pressed`, `aria-selected="true"` or `aria-pressed="true"` identifies its active state. Off switch knobs stay `text`, and disabled knobs stay `text-disabled`. Select errors stay danger on hover and keyboard focus.
- **Selected tabs and single-choice toggles have one clear boundary.** The group remains borderless; only the selected key has a `text-secondary` border. Select triggers retain their quiet `edge`.
- **Badges use 13px regular text.** Tags and status names stay as readable as the metadata beside them. Badge height remains 20px; xs control labels and keyboard shortcuts remain 11px.

## 26.11.10

Published 11 November 2026.

### State clarity

- **Focus is easier to see.** Keyboard focus thickens the control's own boundary to 2px without moving text or changing its size. Shadows, rings and visible outlines remain absent.
- **Disabled labels stay readable.** Controls use `text-disabled` instead of whole-control opacity. Filled controls and fields use a quiet well; checked marks and switch positions remain visible.
- **Control boundaries have their own token.** `control-edge` passes 3:1 against canvas and surface in both themes, while popup and badge borders keep the quieter `edge`. App themes now set 28 color tokens, adding `control-edge` and `text-disabled` to `themeTokens`.
- **Button skips spinners for short waits.** `loading` blocks presses and reports busy immediately, but keeps the label for 300ms before showing a spinner. Finishing cancels the timer and restores the label immediately.

### Breaking changes

- **Text color tokens have literal role names.** Rename `--mu-ink` to `--mu-text`, `--mu-ink-muted` to `--mu-text-secondary`, and `--mu-ink-disabled` to `--mu-text-disabled` in app CSS and themes. Tailwind utilities follow the new names (for example, `text-mu-text-secondary`). The old names are removed; values and appearance are unchanged.
- **The interface is flat.** Remove app overrides of the five `--mu-shadow-*` tokens and `--mu-key-sheen`; they and the Tailwind shadow utilities are gone. `themeTokens` now lists 26 color tokens. Replace `mu-recessed` with `mu-well` and `mu-raised` with `mu-key`. The focus width and offset tokens are removed; custom parts using `mu-focus` must reserve a real 1px border.

### Visual changes

- **Controls and popups use flat fills and real borders.** Shadows and key sheen are removed throughout, including fields, checkboxes, radios, switches, tabs, badges and Prose task lists. Pressed buttons change fill. Keyboard focus changes a control's existing edge, using contrasting text color on filled controls; links use a double underline. Fields retain their darker, thicker focus edge. No external focus ring or visible outline is drawn, including in forced-colors mode.

- **The smallest text is 11px, not 12px.** `label-xs` and `caption-xs` are 11 / 16px (were 12 / 16px), and the xs size row's `--mu-row-font-size` is 11px. This is the text of every 20px part: Badge, Kbd, the labels of xs Buttons, Toggles, ToggleGroups, Checkboxes, Radios and Switches, and the initials of an xs Avatar. Heights, padding, the 16px line and the 12px icons are unchanged, so the parts keep their size and only the letters are smaller. A line of text with a Kbd or Badge inside it can become 1px taller, because the part's text baseline moved. The reason: 12px was 1px under the 13px `caption` text beside it, a step too small to see, so xs parts did not read as smaller. The type scale is now 11, 13, 14, 16 and 20px. An app's own element that uses `mu-label-xs`, `mu-caption-xs`, `badgeClasses()` or the xs row follows.
- **The `display` style adds no letter spacing.** `.mu-display`, the 32px hero headline of a website, no longer sets −0.02em. The system fonts set their own letter spacing at each size, and San Francisco is already tuned at 32px, so the extra value made the headline tighter than the platform intends. Every type style now has letter spacing 0. An app that wants a tighter hero sets `letter-spacing` on that element.
- **A Dialog's or Drawer's description sits 4px under its title, not 8px.** The title and the description now read as one header, with the same `space-1` between them as in a Form and a Popover. The space after the description is unchanged (16px), so a Dialog or Drawer with a description is 4px shorter. Padding stays 20px.
- **A Fieldset's legend sits 8px above its options, not 16px.** The legend was further from its options than the options are from each other (12px), so it read as a separate line. It now reads as their name. This also applies to a RadioGroup rendered through `Fieldset.Root`, in both orientations. A Fieldset is 8px shorter.

### Additions

- `spacingSteps` and `offLadderSpacing()`, so an app can hold its own layout to the spacing ladder. `spacingSteps` is the ladder in px: 4, 8, 12, 16, 20, 24, 32, 48 and 64. `offLadderSpacing(source)` returns the Tailwind CSS padding, margin and gap classes in a text whose value is not a step, such as `gap-1.5`, `py-7` or `px-[10px]`. An app runs it over its source files in a test; `docs/layout.md` has the recipe under "Spacing in an app". It does not check widths, heights or positions. Nothing in the package's own styles changes.

## 26.11.9

Published 7 November 2026.

### Visual changes

- **A toast's text no longer shows below a newer, shorter toast.** When a toast moved behind the front one, its text faded out over 150ms while its card shrank, so for a moment the old description showed under a title-only toast in front, and the same happened when a fanned-out stack collapsed. A toast behind the front one now hides its text at once; it still fades in when the stack fans out or the toast comes to the front.
- **The toasts behind the front one are visible in Dark.** Their peeks sat under the front toast's dark shadow and nearly disappeared, so a stack read as one toast. A toast behind now has a 1px inset `edge`, in both themes. It goes away when the stack fans out.
- **Menus, select lists and combobox lists have new proportions.** sm rows are 28px (`control-compact`) instead of 24px, with the same sm text and icons; md rows stay 32px. The list padding and the space above and below a separator are 6px instead of 4px (`radius-xl` minus `radius-md`), and the highlight takes the row's radius (4px at sm, 6px at md) instead of 8px on every row. A `Popover` with `variant="list"` has the same 6px padding. Apps will see sm menus get taller: a six-row sm menu goes from 161px to 193px.
- **Menus fit their content.** A menu is as wide as its longest row, between `menu-width` (now 160px, was a 200px minimum) and the new `menu-max-width` (280px), both clamped to the space available. Most short menus get narrower. A long description now wraps at 280px instead of stretching the menu toward the screen edge. A Select list is at least as wide as its trigger, as before; a Combobox list still takes the input's width.
- **A submenu still meets its parent's edge.** A menu beside its trigger now sits its own padding (6px) from the trigger row instead of 4px, so with the new padding a submenu's edge still touches the parent's. Its first row still lines up with the trigger row. Menus above or below a trigger stay 4px from it.

## 26.11.8

Published 6 November 2026.

### Visual changes

- **A menu that opens beside its trigger lines up with it, not only a submenu.** Any `Menu.Popup` placed to the side of its trigger (`side` left, right, `inline-start` or `inline-end`) and aligned to `start` or `end` now moves by its own top padding, as a submenu has since 26.11.7: its first row lines up with the trigger, or its last row when it opens upward. This covers a row in a `Popover` with `variant="list"` that opens its own Menu beside the panel, such as a Theme or Language row. Menus that open above or below, or are centered, are unchanged. `Menu.SubmenuRoot` is Base UI's part again; its props are the same.
- **A row keeps its highlight while its menu is open.** `menuClasses().item` now uses `hover` on any row with `data-popup-open`, as a SubmenuTrigger already did, so a panel row that is a `Menu.Trigger` stays highlighted while its choices are open.

## 26.11.7

Published 6 November 2026.

### Visual changes

- **A submenu's first row lines up with its trigger row.** A `Menu.Popup` inside `Menu.SubmenuRoot` used to open with its top edge at the trigger row's top, so its first row sat `space-1` (4px) lower. It now moves up by its own top padding. When there is no room below and it opens upward, its last row lines up with the trigger row instead of sitting 4px higher. The submenu still opens 4px from the row, which puts its edge against the parent menu's edge. Root menus are unchanged. `Menu.SubmenuRoot` is now a component of ours that wraps Base UI's; its props are the same.

## 26.11.6

Published 5 November 2026.

### Visual changes

- **Badge is a pill.** `.mu-badge` uses `radius-full` instead of `radius-sm`, and its inline padding grows by 2px on each side (the xs row's padding plus half of `space-1`) so the text clears the round ends. Height, gap, tones, `color` tinting and the icon are unchanged. `badgeClasses()` returns the same classes for the root, so an app's own element styled as a badge follows. Round now marks a label and square marks a control: Button, Toggle and Kbd stay square. The docs that said badges are never pills (principles.md, layout.md, badge.md) now say they always are.
- **Badge text is regular weight.** Badge text is 12px at weight 400 (was 500), through the new `caption-xs` type style. Hierarchy among badges comes from tone and fill. `outline` text stays `ink-muted`, which keeps 5.1:1 or more on `canvas`, `surface` and `well` in both themes, so no color changed.
- **Badge truncates a long label.** The label is wrapped in a `mu-badge-label` span, and the badge is at most as wide as its container, so a long tag ends in an ellipsis instead of overflowing.

### Additions

- `caption-xs` type style and `.mu-caption-xs` class: 12 / 16px, 400, for text inside 20px labels (badges). `label-xs` (12 / 16px, 500) stays for xs controls and Kbd.
