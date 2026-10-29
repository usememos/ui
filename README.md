# @usememos/ui

The Memos UI design system: shared tokens, components and patterns for memos, the website, the web clipper and future usememos projects. See [`docs/`](docs/README.md) for the system and [`AGENTS.md`](AGENTS.md) for how to work in this repo.

## Workspace

- `packages/ui`: the published package, `@usememos/ui`
- `docs/`: the design system docs, the source of truth for the package

## Development

```bash
pnpm install
pnpm typecheck
pnpm test        # includes a check that tokens.css matches the docs
pnpm build
pnpm check       # build, then lint the published package (publint, attw)
```

## Releasing

Versions follow the same CalVer as memos ([discussion](https://github.com/orgs/usememos/discussions/6351)) and `@usememos/editor`: `year.month.n`, where `n` counts the releases that month from 0. The first release in October 2026 is `26.10.0`, the second `26.10.1`, and the first in April 2027 is `27.4.0`. `version` in `packages/ui/package.json` stays `0.0.0` in the repo.

To release, open Actions, pick "Release" and choose "Run workflow" on main. The workflow (`.github/workflows/release.yml`) works out the version from today's date (UTC) and the versions already on npm, runs the typecheck, tests and package checks, and publishes to npm under the `latest` tag. There are no canary builds, release candidates, git tags, GitHub releases or release notes. The version does not signal breaking changes, so apps should pin an exact version.

Publishing uses npm trusted publishing, so there is no npm token. On npmjs.com, the `@usememos/ui` package settings list `usememos/ui` and `release.yml` under "Trusted Publisher".

## Reference Docs

- [Design system](docs/README.md): principles, color, depth, typography, layout, motion, states, icons, components and patterns.
- [AGENTS.md](AGENTS.md): rules and workflow for people and coding agents working in this repo.
- [Package README](packages/ui/README.md): installing and loading the package.
