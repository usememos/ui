# Link

A link goes somewhere. It is `accent` text that underlines on hover: the one place the hue appears at rest.

## Props

```ts
interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  muted?: boolean;    // navigation that shouldn't draw the eye
  external?: boolean; // opens a new tab and shows an arrow
}
```

Provide `href` and `children`.

## Guidelines

- A link navigates; a button acts. A "Get started" that goes to a page is a [Button](button.md) with `href`, because it should look like an action. "View all" is a link.
- Inside [Prose](prose.md), plain anchors get the same style without the component.
- Links are never color alone in running text: they also underline on hover and focus.
