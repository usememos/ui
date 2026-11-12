# Working in this repo

Notes for people and coding agents. See `README.md` for usage and [`docs/`](docs/README.md) for the design system. The repo is set up like [usememos/editor](https://github.com/usememos/editor): when a tooling or layout question comes up, do what the editor does.

## What this repo is

`@usememos/ui` is the Memos UI design system: one shared set of tokens, components and patterns for memos (the app), the website, the web clipper and future usememos projects. It is not a general-purpose UI library for outside developers.

The docs in `docs/` describe the target system and are the source of truth. The package in `packages/ui` is being built from them: it ships the tokens (`tokens.css`) and foundation classes (`styles.css`) today, and components are added one at a time following their pages in `docs/components/`. When code and docs disagree, change the code toward the docs, or, if the docs are wrong, change the docs in the same commit.

`packages/ui/test/tokens.test.ts` checks that `tokens.css` and the type classes in `foundation.css` match the token tables in the docs, and `contrast.test.ts` checks the 4.5:1 text contrast promised in [Color](docs/color.md). Change a token in both places at once.

## Read before changing anything visual

| Task | Read |
| --- | --- |
| Any UI change | [Principles](docs/principles.md), [Color](docs/color.md), [Depth](docs/depth.md) |
| A component | Its page in [`docs/components/`](docs/components/README.md), [States](docs/states.md), [Building on it](docs/building.md) |
| Spacing, sizes, layout | [Size, spacing and layout](docs/layout.md) |
| Text | [Typography](docs/typography.md) and the voice rules in [Principles](docs/principles.md#voice-and-interface-text) |
| Icons | [Icons](docs/icons.md) |
| Animation | [Motion](docs/motion.md) |
| A screen in a product | [Patterns](docs/patterns.md), [Using the components](docs/usage.md) |
| A part an app builds itself | [Building your own component](docs/custom-components.md) |

## Rules

These are decisions, not suggestions. Changing one needs the maintainer's sign-off.

- **Generic only.** Components never know about a product's domain (notes, memos, clips). Product screens are built from components and [patterns](docs/patterns.md).
- **Base UI for behavior.** Focus, keyboard, ARIA, portals and positioning come from Base UI. Don't hand-roll them.
- **Follow established libraries, not one product.** A component's parts, props and behavior follow Base UI and other popular libraries. A product's special case is solved in that product.
- **Parts, not data props.** Multi-element components are namespaces of parts with Base UI's names (`Menu.Root`, `Menu.Trigger`, `Menu.Popup`, `Menu.Item`). Portal, Positioner and Backdrop fold into one `Popup`. No `items` or `options` arrays. See [API conventions](docs/building.md#api-conventions).
- **No shadcn.** No shadcn dependency, no copied shadcn code, and no shadcn-compatible names (`card`, `muted`, `destructive`, `foreground`, `secondary`, `ring` and so on). Use the token names in [Color](docs/color.md).
- **Tokens only.** Use `var(--mu-<token>)` for every color, radius, space, size, duration, easing and z-index. No raw values in component CSS; the exceptions are a `color-mix()` of a variable with `transparent` by a percentage, and `oklch(from var(--…) …)`, both for a tint of a color the user chose (Badge `color`).
- **A token is named for its job, not its look.** Use `focus` and `edge`, not `ring` or elevation scales. No shadow tokens. A test checks the names.
- **Ink, not a hue.** `primary` (near-black in Light, near-white in Dark) is the only emphasis. `accent` (quiet blue) is only for links and selection, never a fill. Focus is ink. `success`, `warning` and `danger` are only for status.
- **Flat surfaces, clear states.** No shadows, sheen, focus rings or visible outlines. Use `mu-well`, `mu-key` and `mu-popup` for flat fills and borders. Text inputs keep their surface fill. See [Surfaces and boundaries](docs/depth.md).
- **Few shared interaction treatments.** Controls do not move, scale or use brightness filters while pressed. Passive content does not highlight on hover. Reuse the shared focus treatment; do not add per-component focus variants. Persistent selection uses fill and text, never a stronger border. Hover keeps quiet boundaries. `control-edge` is only for small checkbox/radio marks; text tokens never become persistent borders. Selection, disabled, invalid and loading states remain explicit. See [States](docs/states.md).
- **Apps set only color and font tokens.** The 28 color tokens and three font tokens are the whole theming surface; `themeTokens` lists the 28 an app theme sets. Every other token and every `mu-*` class rule is internal to the package. See [What an app can change](docs/color.md#what-an-app-can-change).
- **Apps build their own parts from the package.** Base UI for behavior, class functions (`buttonClasses`, `menuClasses`) and [public classes](docs/custom-components.md#public-classes) for looks, `--mu-row-*` variables and tokens for the rest. A component whose look apps reuse exports `<component>Classes()` and builds its own classes with it. See [Building your own component](docs/custom-components.md).
- **Two themes.** Every change works in Light and Dark (`data-theme="light" | "dark"`), and under `prefers-reduced-motion`. Apps add their own themes by setting the theme tokens ([App themes](docs/color.md#app-themes)); the package ships and tests only these two.
- **Few sizes, two weights.** Text uses the nine styles in [Typography](docs/typography.md): 13, 14, 16 and 20px in apps (11px only for the text of 20px parts: xs controls and kbd; badges use 13px; 32px only for a website hero), weights 400 and 500 (600 only for bold and headings inside Prose), letter spacing 0. Font decisions follow Apple's typography guidelines, as that page explains. No other size or weight without a written reason in that page.
- **Sizes come in rows.** `size` is `xs | sm | md` (20, 24, 32px; md default; there is no `lg`) and sets height, padding, text, icon and radius together. Only the components listed in [Control sizes](docs/layout.md#control-sizes) take `xs`; text entry, menus, tabs and tables are `sm | md`. The one height between sizes is `mu-compact`, a class that makes md 28px inside an app's sidebar; it is not a `size` value.
- **One spacing ladder.** Layout uses 4, 8, 12, 16, 20, 24, 32, 48 and 64px, and each step has a job: see [Spacing](docs/layout.md#spacing). 2px is `inset` only. Closer means more related, and a container's padding is never smaller than the gap between its blocks. Apps follow the same ladder: `spacingSteps` lists the steps, and `offLadderSpacing()` finds an app's Tailwind classes that miss them.
- **Lucide icons as elements** (`icon={<Pin />}`). No `size` or `strokeWidth` props: CSS sets 12/14/16px and a 1.25px screen-pixel stroke at every size.
- **Not in the set:** Card (the only boxes are List, a `bordered` Table and a `bordered` Form), Slider, Stepper, Chip, SegmentedControl, Accordion. See [what was left out](docs/components/README.md#left-out-on-purpose) and what to use instead.
- **Scoped CSS.** Classes start with `mu-`. No global selectors beyond `:root` and `.mu-root`, so the package can mount inside a host page.
- **Source order decides.** Inside the package a later rule beats an earlier one on the same element. Every `:has()` sits in `:where()`, so it adds no specificity. See [Writing component CSS](docs/building.md#writing-component-css).
- **Accessibility.** Text keeps 4.5:1 contrast in both themes. Keyboard focus recolors the existing 1px border (`focus` ink, or contrasting text color on filled controls); text links get a double underline. A focused field darkens its own 1px edge. Forced-colors mode uses a 2px system focus edge. No focus rings or visible outlines; popups never draw a focus boundary. Icon-only controls have an `aria-label` and a Tooltip. Touch targets reach 44px on `pointer: coarse`.
- **Interface text** is sentence case, starts buttons with a verb, and uses no emoji.

## Adding or changing a component

1. Check the [inventory](docs/components/README.md). If a screen needs something new, confirm no existing component or pattern covers it.
2. Write or update the component's page in `docs/components/`, following the [page template](docs/components/README.md#page-template), and the inventory table.
3. Build it in `packages/ui/src/components/<name>/` on Base UI (`@base-ui/react`), styled only with tokens and the foundation classes, in both sizes, all [states](docs/states.md) and both themes. Its CSS goes in `<name>/<name>.css`, imported from `src/styles/styles.css`; the build inlines it, so the package still ships one stylesheet.
4. Export it from `packages/ui/src/index.ts`. The package has one JS entry point. If apps put its look on their own elements, also export a `<component>Classes()` function, build the component's classes with it, and list it in [Class functions](docs/custom-components.md#class-functions).
5. Show every variant and state in `playground/sections/<name>.tsx` and list it in `playground/sections/index.ts`.
6. Add unit tests in `packages/ui/test/` for behavior that isn't Base UI's (controlled and uncontrolled state, `loading`, `size` through context, `render`), with `// @vitest-environment happy-dom` at the top. Add a browser test in `e2e/<name>.spec.ts` for keyboard paths, reduced motion and touch hit areas. `e2e/foundations.spec.ts` runs axe over the whole playground in every theme.
7. Update the screenshots (below).

The tests enforce part of this: `inventory.test.ts` fails when a component folder has no docs page, export or playground section, `css.test.ts` fails on raw colors, lengths, durations or z-indexes in component CSS (only `0.5px` and `1px` lengths are allowed), `classes.test.tsx` fails when a component and its class function disagree or a public class or row variable in the docs is missing, `tailwind.test.ts` fails when `tailwind.css` misses a token, and `cascade.test.ts` fails when a `:has()` adds specificity or an earlier rule outranks a later modifier rule. `e2e/icons.spec.ts` checks that icon-only controls center their icon in every size.

## Workspace

- `packages/ui`: the published package, `@usememos/ui`. ESM only, for React 18 or later.
  - `src/index.ts`: the one JS entry point
  - `src/styles/tokens.css`: every token, published as `@usememos/ui/tokens.css`
  - `src/styles/styles.css`: imports `foundation.css` (size rows, depth, focus, icons, type scale) and each component's stylesheet; published as one file, `@usememos/ui/styles.css`
  - `src/styles/tailwind.css`: the tokens as Tailwind CSS v4 theme variables, published as written as `@usememos/ui/tailwind.css`
  - `src/components/<name>/`: one folder per component, with its stylesheet
  - `scripts/build.mjs`: the build (the JavaScript by `scripts/modules.mjs`, the stylesheets by esbuild, then `tsc` for the declarations, then `llms.txt` and `llms-full.txt` from `docs/` by `scripts/llms.mjs`). The JavaScript ships as one ES module per source file, never one bundled file, so apps' bundlers drop the components they don't import
  - `test/`: Vitest tests: tokens and docs in sync, color contrast, CSS rules, the inventory, component behavior, and that an app importing one component bundles only that component
- `playground/`: the test page. It renders every component section and the foundations, in the theme and size given by `?theme=` and `?size=`. The browser tests and screenshots run against its build. It is a test fixture, not a site for people to browse. `playground/interop.html` loads the components inside an app-like stylesheet (its own variables, a reset layer, utility classes, an app theme) for `e2e/interop.spec.ts`.
- `e2e/`: Playwright browser tests
- `docs/`: the design system docs. They also ship in the package as `llms.txt` and `llms-full.txt`, for agents in apps

Dependencies are deliberately few, and the dev tools match the editor's versions. Add a dependency only when code uses it. The package has no dependencies, only peer dependencies: `@base-ui/react` at one exact version, so an app's own Base UI components share the package's copy, and `react`, `react-dom` and `lucide-react` as ranges. The root `package.json` pins `@base-ui/react` to the same version for development; upgrade both together. Pin dev dependencies to exact versions.

## Commands

```sh
npm install
npm test           # unit tests (vitest), including tokens.css against the docs
npm run test:e2e   # browser tests (Playwright, Chromium)
npm run test:visual  # screenshots of every playground section (compared in CI only; see below)
npx playwright test --project=firefox --project=webkit  # the browser tests in Firefox and WebKit (needs those browsers)
npm run typecheck
npm run build      # the published files, in packages/ui/dist
```

## Screenshots

`e2e/visual.spec.ts` takes a screenshot of every playground section, and of each overlay open (menu, select, popover, tooltip, dialog, toast), in every theme and size, and CI compares them with the baselines in `e2e/__screenshots__/`. Baselines are made on CI's Linux runner, never locally: browsers and fonts on other machines render a few pixels differently.

When a change is meant to look different, run the "Screenshots" workflow on the branch (Actions, "Screenshots", "Run workflow"), look at the images in its `screenshots` artifact, and commit the ones that changed into `e2e/__screenshots__/`. Say in the commit message which components changed and why. Never update baselines just to make CI pass.

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
feat(tokens): add the warning-soft token
fix(switch): keep the knob inset at sm
docs: describe the Memos UI design system
```

## Releasing

Versions follow the same CalVer as memos ([discussion](https://github.com/orgs/usememos/discussions/6351)) and `@usememos/editor`: `year.month.n`, where `n` counts the releases that month from 0. The release workflow picks the version from today's date (UTC) and the versions already on npm. The first release in October 2026 is `26.10.0`, the second `26.10.1`, and the first in April 2027 is `27.4.0`. `version` in `packages/ui/package.json` stays `0.0.0` in the repo.

To release, run `/release` in Claude Code (the skill in `.agents/skills/release/` checks CI and what will ship, then starts the workflow and reports the version), or open Actions, pick "Release" and choose "Run workflow" on main. The workflow (`.github/workflows/release.yml`) works out the version, runs the typecheck and tests, and publishes to npm under the `latest` tag. There are no release candidates, git tags or GitHub releases. Changes an app can see go under "Unreleased" in [CHANGELOG.md](CHANGELOG.md) in the commit that makes them; after a release, rename that heading to the version. The version does not signal breaking changes, so apps should pin an exact version, and commits marked with `!` show what breaks.

Publishing uses npm trusted publishing, as `usememos/editor` does, so there is no npm token. On npmjs.com, the `@usememos/ui` package settings list `usememos/ui` and `release.yml` under "Trusted Publisher".
