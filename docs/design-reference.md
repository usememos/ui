# Design reference: Linear

Linear's product interface is the reference for our hierarchy, restraint and interaction judgment. Our rules below turn that direction into a contract for Memos UI.

## What the sources establish

- The [March 2026 refresh](https://linear.app/now/behind-the-latest-design-refresh) reduces competing chrome, unnecessary icons and dividing lines. Its neutrals move toward a warmer, less saturated gray while content stays clear.
- The [2024 redesign](https://linear.app/now/how-we-redesigned-the-linear-ui) treats alignment, density and hierarchy as one system, tested across views, platforms and themes.
- The [August 2026 styling account](https://linear.app/now/styling-linear-for-the-future-stylex) describes explicit component contracts and shared interaction styling, including a highlight treatment for pointer hover and touch press. It also says Linear does not have a formal design system; these articles are not a complete public component specification.
- The [contextual-menu account](https://linear.app/now/invisible-details) improves the pointer's path into a submenu. Craft includes reducing effort even when no visible effect is added.
- Emil Kowalski's [animation guidance](https://emilkowal.ski/ui/you-dont-need-animations), with examples from his work at Linear, distinguishes purposeful motion from repeated effects that slow work. It supports short content transitions and immediate keyboard navigation; it does not prescribe one timing for every Linear component.

A signed-in browser inspection on 14 November 2026 checked Display options, Preferences and the workspace menu. Display-option and settings-page names were 500; Select values and options were 400; sampled workspace-menu text and helper descriptions were 450. Compact-panel names used a quieter color than values, while settings-page names used primary text with quieter descriptions. These are observations of those views, not a complete Linear type specification. Memos UI adopts the name/value distinction with its existing system fonts, 400/500 weights and size scale; it does not copy Linear's Inter Variable font, 450 weight or 12px panel text.

## How we apply this

These are Memos UI decisions informed by those sources and product review, not claims about Linear's private CSS, tokens or animation timings. A screenshot of a focused composer does not establish how all of Linear's inputs or keyboard paths behave.

| Before | After | Why |
| --- | --- | --- |
| Every interaction event calls for a distinct appearance | Implement every behavioral state; add a visible change only when it conveys useful information | Events are not visual variants |
| A text field emphasizes its entire boundary on focus | Keep border and surface stable; use its caret or text selection | Content and editing stay primary |
| Holding an action adds a new fill or contrasting border | Reuse one immediate highlight for hover and press; keyboard focus stays independent | Fewer transient treatments |
| Tabs and single-choice groups animate each selection | Update the selected key immediately | Frequent navigation does not wait for decoration |
| Select has a separate opening treatment over its chosen value | Open an anchored list with the shared short fade and small offset; keep one chevron and one selected check | Content appears smoothly without extra choreography |
| Simplifying event feedback also removes opening and closing animations | Retain minimal content transitions; keep hover, focus, press and row navigation immediate | Content visibility and repeated control feedback have different purposes |
| A switch fades its track, border and knob colors | Update colors immediately; only the knob moves briefly | Motion explains a saved position |
| Screens restyle controls to solve local taste problems | Fix shared roles and components, then test the contract | Products stay consistent |
| Horizontal settings names lose the weight of a field label | Keep all Field labels at 500; keep values and option text at 400; use contextual text colors | A name and its chosen value have distinct roles |

## Boundaries

Keep Memos' warm Light canvas, bright surfaces, ink emphasis, text contrast, system fonts and existing size rows. Base UI owns behavior. These remain our tokens and APIs; adopting this reference does not require another styling framework or Linear's branding.

State feedback is immediate. Motion is reserved for spatial changes, appearing or disappearing content, and progress. See [States](states.md), [Motion](motion.md) and [Surfaces and boundaries](depth.md) for the executable rules.
