# Working in this repo

Notes for people and coding agents. See `README.md` for usage and [`docs/`](docs/README.md) for the design system. The repo is set up like [usememos/editor](https://github.com/usememos/editor): when a tooling or layout question comes up, do what the editor does.

## What this repo is

`@usememos/ui` is the Memos UI design system: one shared set of tokens, components and patterns for memos (the app), the website, the web clipper and future usememos projects. It is not a general-purpose UI library for outside developers.

The docs in `docs/` describe the target system and are the source of truth. The package in `packages/ui` is being built from them: it ships the tokens (`tokens.css`) and foundation classes (`styles.css`) today, and components are added one at a time following their pages in `docs/components/`. When code and docs disagree, change the code toward the docs, or, if the docs are wrong, change the docs in the same commit.

`packages/ui/test/tokens.test.ts` checks that `tokens.css` and the type classes in `styles.css` match the token tables in the docs. Change a token in both places at once.

## Read before changing anything visual

| Task | Read |
| --- | --- |
| Any UI change | [Principles](docs/principles.md), [Color](docs/color.md), [Depth](docs/depth.md) |
| A component | Its page in [`docs/components/`](docs/components/README.md), [States](docs/states.md), [Building on it](docs/building.md) |
| Spacing, sizes, layout | [Size, spacing and layout](docs/layout.md) |
| Text | [Typography](docs/typography.md) and the voice rules in [Principles](docs/principles.md#voice-and-interface-text) |
| Icons | [Icons](docs/icons.md) |
| Animation | [Motion](docs/motion.md) |
| A screen in a product | [Patterns](docs/patterns.md) |

## Rules

These are decisions, not suggestions. Changing one needs the maintainer's sign-off.

- **Generic only.** Components never know about a product's domain (notes, memos, clips). Product screens are built from components and [patterns](docs/patterns.md).
- **Base UI for behavior.** Focus, keyboard, ARIA, portals and positioning come from Base UI. Don't hand-roll them.
- **No shadcn.** No shadcn dependency, no copied shadcn code, and no shadcn-compatible names (`card`, `muted`, `destructive`, `foreground`, `secondary`, `ring` and so on). Use the token names in [Color](docs/color.md).
- **Tokens only.** Use `var(--token)` for every color, shadow, radius, space, size, duration, easing and z-index. No raw values in component CSS.
- **Ink, not a hue.** `primary` (near-black in Light, near-white in Dark) is the only emphasis. `accent` (quiet blue) is only for focus, links and selection, never a fill. `success`, `warning` and `danger` are only for status.
- **Depth means behavior.** Recessed holds a value, raised can be pressed, popups float, everything else is flat. Text inputs are flat. Use the `mu-recessed`, `mu-key`, `mu-raised` and `mu-popup` classes before writing new shadows. See [Depth](docs/depth.md).
- **Three themes.** Every change works in Light, Dark and High contrast (`data-theme="light" | "dark" | "contrast"`), and under `prefers-reduced-motion`.
- **Sizes come in rows.** `size` is `sm | md | lg` (24, 32, 40px; md default) and sets height, padding, text, icon and radius together.
- **4px grid.** The only 2px value is `inset`.
- **Lucide icons as elements** (`icon={<Pin />}`). No `size` or `strokeWidth` props: CSS sets 14/16/20px and a 1.25px (sm) or 1.5px (md, lg) screen-pixel stroke.
- **Not in the set:** Card, Slider, Stepper, Chip, SegmentedControl, Accordion. See [what was left out](docs/components/README.md#left-out-on-purpose) and what to use instead.
- **Scoped CSS.** Classes start with `mu-`. No global selectors beyond `:root` and `.mu-root`, so the package can mount inside a host page.
- **Accessibility.** Text keeps 4.5:1 contrast in every theme. Focus rings show on `:focus-visible` only. Icon-only controls have an `aria-label` and a Tooltip. Touch targets reach 44px on `pointer: coarse`.
- **Interface text** is sentence case, starts buttons with a verb, and uses no emoji.

## Adding or changing a component

1. Check the [inventory](docs/components/README.md). If a screen needs something new, confirm no existing component or pattern covers it.
2. Write or update the component's page in `docs/components/` (summary, props, guidelines) and the inventory table.
3. Build it in `packages/ui/src/components/<name>/` on Base UI (`@base-ui/react`), styled only with tokens and the foundation classes, in all three sizes, all [states](docs/states.md) and all three themes. Its CSS goes into `styles.css`; there are no per-component CSS entry points.
4. Export it from `packages/ui/src/index.ts`. The package has one JS entry point.
5. Add tests for behavior that isn't Base UI's (controlled and uncontrolled state, `loading`, sizes).

## Workspace

- `packages/ui`: the published package, `@usememos/ui`. ESM only, for React 18 or later.
  - `src/index.ts`: the one JS entry point
  - `src/styles/tokens.css`: every token, published as `@usememos/ui/tokens.css`
  - `src/styles/styles.css`: foundation classes and component styles, published as `@usememos/ui/styles.css`
  - `scripts/build.mjs`: the build (esbuild, then `tsc` for the declarations)
  - `test/`: Vitest tests
- `docs/`: the design system docs

Dependencies are deliberately few, and the dev tools match the editor's versions. Add a dependency only when code uses it: `@base-ui/react` and `lucide-react` (as a peer dependency) arrive with the first component. Pin dev dependencies to exact versions.

## Commands

```sh
npm install
npm test           # unit tests (vitest), including tokens.css against the docs
npm run typecheck
npm run build      # the published files, in packages/ui/dist
```

## Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <summary>
```

- **type**: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `ci` or `chore`. Add `!` after the type or scope for a breaking change.
- **scope** (optional): the area changed, such as `tokens`, `button`, `dialog`, `theme`, `docs-site`. Leave it out when a change spans several areas.
- **summary**: lowercase, imperative ("add", not "added"), no period at the end, under about 72 characters.

Examples:

```
feat(tokens): add the high contrast theme
fix(switch): keep the knob inset at sm
docs: describe the Memos UI design system
```

## Releasing

Versions follow the same CalVer as memos ([discussion](https://github.com/orgs/usememos/discussions/6351)) and `@usememos/editor`: `year.month.n`, where `n` counts the releases that month from 0. The release workflow picks the version from today's date (UTC) and the versions already on npm. The first release in October 2026 is `26.10.0`, the second `26.10.1`, and the first in April 2027 is `27.4.0`. `version` in `packages/ui/package.json` stays `0.0.0` in the repo.

To release, run `/release` in Claude Code (the skill in `.agents/skills/release/` checks CI and what will ship, then starts the workflow and reports the version), or open Actions, pick "Release" and choose "Run workflow" on main. The workflow (`.github/workflows/release.yml`) works out the version, runs the typecheck and tests, and publishes to npm under the `latest` tag. There are no release candidates, git tags, GitHub releases or release notes. The version does not signal breaking changes, so apps should pin an exact version, and commits marked with `!` show what breaks.

Publishing uses npm trusted publishing, as `usememos/editor` does, so there is no npm token. On npmjs.com, the `@usememos/ui` package settings list `usememos/ui` and `release.yml` under "Trusted Publisher".
