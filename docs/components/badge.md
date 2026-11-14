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
type BadgeProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "color"> & {
  icon?: IconElement;
  children: React.ReactNode; // one or two words
  render?: React.ReactElement;
} & (
  | { tone?: "neutral"; color?: string } // default tone; any user-chosen CSS color
  | { tone: Exclude<Tone, "neutral"> | "outline" | "primary"; color?: never }
);

function badgeClasses(options?: { tone?: Tone | "outline" | "primary" }): string;
```

## Rules

- Tags: `neutral` with a `Hash` icon. Visibility: `outline` with its icon. Status: `success`, `warning` or `danger`, always with a word, never color alone. A label that should stand out, such as New on a feature: `primary`, in ink, the system's one emphasis. Use it for one badge in a view at most, and never for a status.
- A tag in an entry's footer, or anywhere outside running text, is a `neutral` Badge with a `Hash` icon, in `text`: it is the user's own word, not secondary text, so it is never muted. A tag inside running text belongs to the product’s content renderer.
- When people can give a tag a color, pass it as `color`. The color tints the fill; the text and the icon stay `text`, so every color the user can pick stays readable in both themes. Never set the text or the icon in the user's color: on its own tint it falls below 4.5:1 for most colors in one theme or the other. A tag without a color keeps `well`.
- `tone` is Badge's existing set of label treatments: `neutral` for tags, `outline` for quiet labels, `primary` for emphasis, and `success`, `warning` or `danger` for status. `outline` and `primary` are not status tones. There is no separate Badge `variant` prop.
- `color` is for colors people choose, with `tone="neutral"` or no tone. TypeScript rejects `color` with every other tone; those combinations never used the tint. The package's own meanings use tones: status is `success`, `warning` or `danger`, emphasis is `primary`.
- A badge is not a button. A clickable tag filter is a [Toggle](toggle.md).
- Badges use `radius-full`. Buttons and Toggles keep their size-row corners unless `shape="pill"` is explicitly selected.
- A label wider than its container ends in an ellipsis. Keep tags short; give a cut tag its full text in `title`.
- An app's own element that should look like a badge, such as a tag that is also a link, takes `badgeClasses()`. See [Class functions](../custom-components.md#class-functions).

## Style

- `control-xs` (20px) tall, `radius-full` (a pill), `caption` text (13px, 400), optional `icon-xs` (12px) icon at a 1.25px stroke. It lines up with xs controls.
- Inline padding is the xs row's `--mu-row-padding` plus 2px (half of `space-1`) on each side, so the text clears the round ends. The gap between icon and text is `space-1`.
- Regular weight, because a badge is a label, not a heading: hierarchy among badges comes from tone and fill, not weight. `outline` text is `text-secondary`, 5.1:1 or more on `canvas`, `surface` and `well` in both themes.
- `neutral`: `text` on `well`. With `color`, the fill is an 18% tint of that color over the background, the same amount in both themes, and the text and icon stay `text`. The color's lightness is first kept between 50% and 75% (OKLCH), so an ink-like color (black in Dark, white in Light) still gives a visible gray chip instead of vanishing into the background; hues in that range are unchanged. The prop sets `--mu-badge-color` on the badge; an app's own element with `badgeClasses()` sets that variable itself (see [Class functions](../custom-components.md#class-functions)). `primary`: `on-primary` on `primary`, the colors of a primary Button. Status tones: their `-soft` background with full-strength text.
