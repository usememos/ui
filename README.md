# @usememos/ui

The Memos UI design system: tokens, foundation styles and React components for memos, the website, the web clipper and future usememos projects.

- Calm, dense and tactile: pure grays, ink for emphasis, and a little depth that shows what holds a value and what you can press.
- Light, Dark and High contrast themes, all from CSS custom properties.
- One package, `@usememos/ui`. ESM only, for React 18 or later, with behavior from [Base UI](https://base-ui.com) as components are added.

Status: early. The package ships the tokens and foundation styles; components are being built from their specs in [docs/components](docs/components/README.md). Versions follow memos' CalVer (`26.10.0`, `26.10.1`) and do not signal breaking changes, so pin an exact version. [docs/](docs/README.md) is the design system and the source of truth for the package.

## Use it

```sh
npm install @usememos/ui
```

Load the tokens first, then the styles:

```ts
import '@usememos/ui/tokens.css';
import '@usememos/ui/styles.css';
```

- `tokens.css` defines every token as a CSS custom property on `:root`, on a shadow root's `:host`, and on any `.mu-root` element.
- `styles.css` holds the foundation classes (`mu-s-md`, `mu-raised`, `mu-recessed`, `mu-key`, `mu-popup`, `mu-icon`, the `mu-` type scale) and the component styles.

Use tokens through their variables (`var(--ink)`, `var(--space-4)`), never as copied values.

### Themes

Set `data-theme="light"`, `"dark"` or `"contrast"` on the root element, or on any element to theme its subtree. Without the attribute the tokens are Light. The package does not read `prefers-color-scheme`; the app does, so a saved preference can win over the system setting.

### Inside another page

In a browser extension or an embed, mount the UI under a `.mu-root` element or inside a shadow root. The package has no global selectors beyond `:root`, `:host` and `.mu-root`.

## Develop

```sh
npm install
npm run dev        # the playground
npm test           # unit tests (vitest), including tokens.css against the docs
npm run test:e2e   # browser tests (Playwright)
npm run typecheck
npm run build      # the published files, in packages/ui/dist
```

See [AGENTS.md](AGENTS.md) for the rules, the workflow and releasing.
