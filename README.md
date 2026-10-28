# @usememos/ui

React UI library workspace for `@usememos/ui`.

## Workspace

- `packages/react`: published package
- `packages/primitives`: internal Base UI wrappers
- `packages/theme`: shared CSS theme output
- `apps/docs`: Vite docs website

## Development

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
pnpm docs
```

Vitest browser tests use Playwright:

```bash
pnpm exec playwright install chromium
```

## Releasing

Versions follow the same CalVer as memos ([discussion](https://github.com/orgs/usememos/discussions/6351)) and `@usememos/editor`: `year.month.n`, where `n` counts the releases that month from 0. The first release in October 2026 is `26.10.0`, the second `26.10.1`, and the first in April 2027 is `27.4.0`. `version` in `packages/react/package.json` stays `0.0.0` in the repo.

To release, open Actions, pick "Release" and choose "Run workflow" on main. The workflow (`.github/workflows/release.yml`) works out the version from today's date (UTC) and the versions already on npm, runs the typecheck, tests and package checks, and publishes to npm under the `latest` tag. There are no canary builds, release candidates, git tags, GitHub releases or release notes. The version does not signal breaking changes, so apps should pin an exact version.

Publishing uses npm trusted publishing, so there is no npm token. On npmjs.com, the `@usememos/ui` package settings list `usememos/ui` and `release.yml` under "Trusted Publisher".

## Reference Docs

- [Design system](docs/DESIGN_SYSTEM.md): core foundations, tokens, primitives, accessibility gates, governance, and migration rules.
- [Package usage](packages/react/README.md): public entrypoints, examples, and consumer setup.
