# @usememos/ui

The Memos UI design system for usememos products: design tokens, foundation styles and, as they are built, React components on [Base UI](https://base-ui.com). The design is documented in [usememos/ui/docs](https://github.com/usememos/ui/tree/main/docs).

## Install

```sh
pnpm add @usememos/ui react react-dom
```

The package is ESM only and supports React 18 and 19. Versions are CalVer (`26.10.0`) and don't signal breaking changes, so pin an exact version.

## Load the styles

Load the tokens first, then the styles:

```ts
import "@usememos/ui/tokens.css";
import "@usememos/ui/styles.css";
```

- `tokens.css` defines every token as a CSS custom property on `:root`, on a shadow root's `:host`, and on any `.mu-root` element.
- `styles.css` holds the foundation classes (`mu-s-md`, `mu-raised`, `mu-recessed`, `mu-key`, `mu-popup`, `mu-icon`, the `mu-` type scale) and the component styles.

Use tokens through their variables (`var(--ink)`, `var(--space-4)`) and never copy raw values.

## Themes

Set `data-theme="light"`, `"dark"` or `"contrast"` on the root element, or on any element to theme its subtree. Without the attribute the tokens are Light. The package doesn't read `prefers-color-scheme`; the app does, so a saved preference can win over the system setting.

## Inside another page

In a browser extension or an embed, mount the UI under a `.mu-root` element or inside a shadow root. The package has no global selectors beyond `:root`, `:host` and `.mu-root`.
