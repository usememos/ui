# Link

Goes somewhere.

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

## Rules

- A link navigates; a button acts. A "Get started" that goes to a page is an anchor with [`buttonClasses()`](button.md#rules). "View all" is a link.
- Inside running text, use `underline="always"`, so the link isn't told apart by color alone.
- Inside [Prose](prose.md), plain anchors get this style without the component.

## Style

- `accent` text that underlines on hover: the one place the hue appears at rest. `muted` uses `ink-muted`.
- High contrast underlines every link.
