# Link

A link goes somewhere. It is `accent` text that underlines on hover: the one place the hue appears at rest.

## Example

```tsx
import { Link } from "@usememos/ui";

<Link href="/notes">View all</Link>
<p>Read the <Link href="/changelog" underline="always">release notes</Link> first.</p>
<Link href="https://www.usememos.com" external>usememos.com</Link>
```

## Props

```ts
interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  muted?: boolean;                 // navigation that shouldn't draw the eye
  external?: boolean;              // opens a new tab and shows an arrow
  underline?: "hover" | "always";  // default "hover"
  render?: React.ReactElement;     // a router's link: render={<RouterLink to="/notes" />}
}
```

Provide `href` and `children`.

## Guidelines

- A link navigates; a button acts. A "Get started" that goes to a page is an anchor with [`buttonClasses()`](button.md#links-that-look-like-buttons), because it should look like an action. "View all" is a link.
- Inside running text, use `underline="always"`, so the link isn't told apart by color alone. In High contrast every link is underlined.
- Inside [Prose](prose.md), plain anchors get the same style without the component.
