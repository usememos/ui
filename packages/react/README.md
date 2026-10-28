# @usememos/ui

Opinionated React UI kit with explicit CSS delivery and compound component APIs.

## Install

```bash
pnpm add @usememos/ui react react-dom
```

Import the packaged theme once:

```tsx
import "@usememos/ui/theme.css";
```

## Compound API

```tsx
import { Button, Dialog, Input, Select } from "@usememos/ui";

<Input aria-label="Project name" placeholder="Project name" />;

<Dialog.Root>
  <Dialog.Trigger render={<Button />}>Open dialog</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Team access</Dialog.Title>
      <Dialog.Description>Review the current members.</Dialog.Description>
    </Dialog.Header>
  </Dialog.Content>
</Dialog.Root>;

<Select.Root defaultValue="react">
  <Select.Trigger aria-label="Framework">
    <Select.Value placeholder="Pick one" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="react">React</Select.Item>
    <Select.Item value="vue">Vue</Select.Item>
  </Select.Content>
</Select.Root>;
```

## Public Entrypoints

- `@usememos/ui`
- `@usememos/ui/theme.css`
- `@usememos/ui/button`
- `@usememos/ui/checkbox`
- `@usememos/ui/dialog`
- `@usememos/ui/dropdown-menu`
- `@usememos/ui/input`
- `@usememos/ui/popover`
- `@usememos/ui/radio-group`
- `@usememos/ui/select`
- `@usememos/ui/separator`
- `@usememos/ui/switch`
- `@usememos/ui/tooltip`

## Customization

Theme overrides are done with CSS variables on `:root`, `[data-mui-theme]`, or any subtree wrapper:

```css
:root {
  --mui-color-background: oklch(0.985 0.0015 260);
  --mui-color-foreground: oklch(0.205 0.004 260);
  --mui-color-card: oklch(1 0 0);
  --mui-color-popover: oklch(1 0 0);
  --mui-color-primary: oklch(0.245 0.006 260);
  --mui-color-primary-foreground: oklch(0.99 0 0);
  --mui-color-secondary: oklch(0.952 0.002 260);
  --mui-color-border: oklch(0.895 0.003 260);
  --mui-color-input: oklch(0.84 0.003 260);
  --mui-color-ring: oklch(0.52 0.085 155);
}
```

Dark mode is supported out of the box:

```html
<html class="dark">
  <!-- app -->
</html>
```

or on any subtree:

```tsx
<div data-mui-theme="dark">{/* app */}</div>
```

Components also accept `className` for local overrides:

```tsx
<Button className="my-custom-styles">Custom Button</Button>
```

## Development

```bash
pnpm docs
pnpm test
pnpm test:browser
pnpm build
```

The browser test project uses Vitest Browser Mode with Playwright. On a new machine, install Chromium once:

```bash
pnpm exec playwright install chromium
```

## License

MIT © [usememos](https://github.com/usememos)
