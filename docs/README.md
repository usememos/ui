# Memos UI design system

Memos UI is one calm, dense and flat system for every product we build: memos (the app), the website, the web clipper and whatever comes next. Quiet neutrals, a warm Light canvas and ink emphasis keep attention on people's content. Hierarchy comes from type, spacing and fills. Components reuse a few shared state treatments; pointer events do not add decorative motion or effects.

These docs describe the target system. They are the source of truth for `@usememos/ui`. Where the code in `packages/` differs from them, the code is out of date and should move toward the docs.

## Who it is for

- **Product code** in memos, the website, the web clipper and future usememos projects. Each product builds its screens from these components and patterns, so the products look and feel like one family. Parts a product needs beyond them follow [Building your own component](custom-components.md).
- **People and coding agents** who build or change the package. Start with [`AGENTS.md`](../AGENTS.md).

It is not a general-purpose UI library for outside developers. Components are generic: nothing in the package knows what a note, a memo or a clip is.

## Contents

| Doc | What it covers |
| --- | --- |
| [Design reference: Linear](design-reference.md) | Official source evidence and how we apply it to Memos UI |
| [Principles and voice](principles.md) | The taste in six rules, and how interface text is written |
| [Keeping the system consistent](consistency.md) | Rule ownership, app styling boundaries and the documentation-to-verification loop |
| [Component verification](testing.md) | Prop coverage, component fixtures, browser checks and screenshot maintenance |
| [Color](color.md) | Color roles, every color token in Light and Dark, and how themes are chosen |
| [Depth](depth.md) | Flat surface roles, borders and focus without shadows or outlines |
| [Typography](typography.md) | The system font, the type scale and text rules |
| [Size, spacing and layout](layout.md) | Control sizes, the 4px scale, radius, layout widths, breakpoints and layers |
| [Motion](motion.md) | Immediate feedback, minimal opening and closing, and reduced motion |
| [States](states.md) | Hover, pressed, loading, disabled, invalid and focus |
| [Icons](icons.md) | Lucide, sizes, the fixed stroke and accessibility |
| [Components](components/README.md) | The components, what was left out, and one page per component |
| [Using the components](usage.md) | Which component to pick (overlays, controls, feedback), recipes for combining them, size, emphasis, an accessibility checklist, common mistakes and a map from other UI kits |
| [Patterns](patterns.md) | Page, form, entry, confirmation, loading, empty state and mobile |
| [Building on it](building.md) | Base UI, loading the CSS, scoping inside a host page, theme selection and API conventions |
| [Building your own component](custom-components.md) | How an app builds a part the package doesn't ship: Base UI, class functions, public classes, row variables and Tailwind CSS |

## Decisions at a glance

- **Behavior from Base UI.** Focus management, keyboard support, ARIA, portals and positioning come from [Base UI](https://base-ui.com). Styling, tokens and the component API are our own.
- **No shadcn.** No shadcn dependency, no copied shadcn code, and no shadcn-compatible component or token names (`card`, `muted`, `destructive`, `foreground` and so on are not used).
- **Flat and calm by default.** Fills identify controls and state. Reuse shared interaction treatments without press movement, scaling or brightness filters. Light is the default theme; Dark ships with it.
- **Ink is the accent.** The primary action and checked marks use `primary`: near-black in Light, near-white in Dark. Toggles and single choices use quiet saved-state fills.
- **One quiet hue.** `accent` is a quiet blue used only for links and text selection, never as a fill. Non-text keyboard focus is ink; text-entry focus uses its caret or selection.
- **Status colors only for status.** Green means success, amber means warning, red means danger or error. None of them is used for emphasis.
- **Lucide icons** at one fixed screen-pixel stroke, 1.25px, at every size.
- **The system UI font** for all text. The package ships no font files.
- **Few sizes, two weights.** App UI uses 13, 14, 16 and 20px text at weights 400 and 500. 20px is for the page title only.
- **Dense, on a 4px grid.** Controls are 32px tall by default.
