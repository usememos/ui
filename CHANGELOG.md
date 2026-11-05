# Changelog

Changes to `@usememos/ui` that an app can see. New entries go under "Unreleased"; when a release ships, that heading becomes its version (see "Releasing" in `AGENTS.md`). Breaking changes are also marked with `!` in their commit.

## Unreleased

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
