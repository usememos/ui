# Memos UI design system

Memos UI is one calm, dense and tactile system for every product we build: memos (the app), the website, the web clipper and whatever comes next. It reads like ink on paper: pure grays, black ink for the one thing that matters, and no brand color competing with what people write. Controls have a little physical depth, so you can tell at a glance what holds a value and what you can press.

These docs describe the target system. They are the source of truth for `@usememos/ui`. Where the code in `packages/` differs from them, the code is out of date and should move toward the docs.

## Who it is for

- **Product code** in memos, the website, the web clipper and future usememos projects. Each product builds its screens from these components and patterns, so the products look and feel like one family.
- **People and coding agents** who build or change the package. Start with [`AGENTS.md`](../AGENTS.md).

It is not a general-purpose UI library for outside developers. Components are generic: nothing in the package knows what a note, a memo or a clip is.

## Contents

| Doc | What it covers |
| --- | --- |
| [Principles and voice](principles.md) | The taste in six rules, and how interface text is written |
| [Color](color.md) | Color roles, every color token in Light, Dark and High contrast, and how themes are chosen |
| [Depth](depth.md) | The tactile model: recessed, key, raised, popup and flat; shadow tokens |
| [Typography](typography.md) | Inter, the type scale and text rules |
| [Size, spacing and layout](layout.md) | Control sizes, the 4px scale, radius, layout widths, breakpoints and layers |
| [Motion](motion.md) | Press, settle and fade timing, and reduced motion |
| [States](states.md) | Hover, pressed, loading, disabled, invalid and focus |
| [Icons](icons.md) | Lucide, sizes, fixed stroke widths and accessibility |
| [Components](components/README.md) | The 28 components, what was left out, and one page per component |
| [Patterns](patterns.md) | Page, form, entry, confirmation, loading, empty state and mobile |
| [Building on it](building.md) | Base UI, loading the CSS, scoping inside a host page, theme selection and API conventions |

## Decisions at a glance

- **Behavior from Base UI.** Focus management, keyboard support, ARIA, portals and positioning come from [Base UI](https://base-ui.com). Styling, tokens and the component API are our own.
- **No shadcn.** No shadcn dependency, no copied shadcn code, and no shadcn-compatible component or token names (`card`, `muted`, `destructive`, `foreground` and so on are not used).
- **Light, tactile by default.** Restrained depth that shows behavior. Light is the default theme; Dark and High contrast ship with it.
- **Ink is the accent.** The primary action and every on state use `primary`: near-black in Light, near-white in Dark.
- **One quiet hue.** `accent` is a quiet blue used only for focus rings, links and text selection, never as a fill.
- **Status colors only for status.** Green means success, amber means warning, red means danger or error. None of them is used for emphasis.
- **Lucide icons** at a fixed screen-pixel stroke: 1.5px at md and lg, 1.25px at sm and in badges.
- **Inter** for all text, shipped as a local variable font.
- **Dense, on a 4px grid.** Controls are 32px tall by default.
