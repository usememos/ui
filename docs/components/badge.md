# Badge

Labels a thing with a tag or a status.

## Example

```tsx
import { Badge } from "@usememos/ui";
import { Hash, Lock } from "lucide-react";

<Badge icon={<Hash />}>reading</Badge>
<Badge icon={<Hash />} color={tag.color}>work</Badge>
<Badge tone="outline" icon={<Lock />}>Private</Badge>
<Badge tone="success">Synced</Badge>
<Badge tone="primary">New</Badge>
```

## Props

```ts
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone | "outline" | "primary"; // default "neutral"
  icon?: IconElement;
  color?: string; // a color the user gave this tag, any CSS color; neutral only
  children: React.ReactNode; // one or two words
  render?: React.ReactElement;
}

function badgeClasses(options?: { tone?: Tone | "outline" | "primary" }): string;
```

## Rules

- Tags: `neutral` with a `Hash` icon. Visibility: `outline` with its icon. Status: `success`, `warning` or `danger`, always with a word, never color alone. A label that should stand out, such as New on a feature: `primary`, in ink, the system's one emphasis. Use it for one badge in a view at most, and never for a status.
- A tag in an entry's footer, or anywhere outside running text, is a `neutral` Badge with a `Hash` icon, in `ink`: it is the user's own word, not secondary text, so it is never muted. A tag inside text is a Prose tag (see [Prose](prose.md)).
- When people can give a tag a color, pass it as `color`. The color tints the fill; the text and the icon stay `ink`, so every color the user can pick stays readable in both themes. Never set the text or the icon in the user's color: on its own tint it falls below 4.5:1 for most colors in one theme or the other. A tag without a color keeps `well`.
- `color` is for colors people choose. The package's own meanings use tones: status is `success`, `warning` or `danger`, emphasis is `primary`.
- A badge is not a button. A clickable tag filter is a [Toggle](toggle.md).
- An app's own element that should look like a badge, such as a tag that is also a link, takes `badgeClasses()`. See [Class functions](../custom-components.md#class-functions).

## Style

- `control-xs` (20px) tall, `radius-sm` (never a pill), `label-xs` text (12px, 500), optional `icon-xs` (12px) icon at a 1.25px stroke. It lines up with xs controls.
- `neutral`: `ink` on `well`. With `color`, the fill is an 18% tint of that color over the background, the same amount in both themes, and the text and icon stay `ink`. The color's lightness is first kept between 50% and 75% (OKLCH), so an ink-like color (black in Dark, white in Light) still gives a visible gray chip instead of vanishing into the background; hues in that range are unchanged. The prop sets `--mu-badge-color` on the badge; an app's own element with `badgeClasses()` sets that variable itself (see [Class functions](../custom-components.md#class-functions)). `primary`: `on-primary` on `primary`, the colors of a primary Button. Status tones: their `-soft` background with full-strength text.
