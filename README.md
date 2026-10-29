# @usememos/ui

The Memos UI design system: tokens, foundation styles and React components for memos, the website, the web clipper and future usememos projects.

- Calm, dense and tactile: pure grays, ink for emphasis, and a little depth that shows what holds a value and what you can press.
- Light, Dark and High contrast themes, all from CSS custom properties.
- One package, `@usememos/ui`. ESM only, for React 18 or later, with behavior from [Base UI](https://base-ui.com).

The package ships the tokens, the foundation styles and 28 components, each with a page in [docs/components](docs/components/README.md). Versions follow memos' CalVer (`26.10.0`, `26.10.1`) and do not signal breaking changes, so pin an exact version. [docs/](docs/README.md) is the design system and the source of truth for the package.

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

Use tokens through their variables (`var(--mu-ink)`, `var(--mu-space-4)`), never as copied values.

Both stylesheets sit in the `mu` cascade layer, so the app's own CSS overrides them without a specificity fight. If the app uses layers too (Tailwind CSS does), declare the order first; see [Loading the CSS](docs/building.md#cascade-layer).

Then build screens from the components. `lucide-react` is a peer dependency: icons are passed to components as elements.

```tsx
import { Button, Menu, Toast } from '@usememos/ui';
import { Ellipsis, Pin, Plus, Trash2 } from 'lucide-react';

export function App() {
  return (
    <Toast.Provider>
      <NewNote />
      <Toast.Viewport />
    </Toast.Provider>
  );
}

function NewNote() {
  const toasts = Toast.useToastManager();
  return (
    <>
      <Button variant="primary" icon={<Plus />} onClick={() => toasts.add({ title: 'Note created' })}>
        New note
      </Button>
      <Menu.Root>
        <Menu.Trigger render={<Button variant="ghost" icon={<Ellipsis />} aria-label="More actions" />} />
        <Menu.Popup align="end">
          <Menu.Item icon={<Pin />}>Pin</Menu.Item>
          <Menu.Separator />
          <Menu.Item icon={<Trash2 />} danger>
            Delete
          </Menu.Item>
        </Menu.Popup>
      </Menu.Root>
    </>
  );
}
```

Components with more than one element are namespaces of parts named after Base UI's (`Menu.Root`, `Menu.Trigger`, `Menu.Popup`). Each part takes Base UI's props, plus the few listed on its docs page.

### For coding agents

The package ships `llms.txt`, an index of the docs, and `llms-full.txt`, every docs page in one file. Point an agent at `node_modules/@usememos/ui/llms-full.txt` before it builds a screen.

### Themes

Set `data-theme="light"`, `"dark"` or `"contrast"` on the root element, or on any element to theme its subtree. Without the attribute the tokens are Light. The package does not read `prefers-color-scheme`; the app does, so a saved preference can win over the system setting.

### Inside another page

In a browser extension or an embed, mount the UI under a `.mu-root` element or inside a shadow root. The package has no global selectors beyond `:root`, `:host` and `.mu-root`.

## Develop

```sh
npm install
npm test           # unit tests (vitest), including tokens.css against the docs
npm run test:e2e   # browser tests (Playwright)
npm run typecheck
npm run build      # the published files, in packages/ui/dist
```

See [AGENTS.md](AGENTS.md) for the rules, the workflow and releasing.
