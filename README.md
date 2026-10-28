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

## Reference Docs

- [Design system](docs/DESIGN_SYSTEM.md): core foundations, tokens, primitives, accessibility gates, governance, and migration rules.
- [Package usage](packages/react/README.md): public entrypoints, examples, and consumer setup.
