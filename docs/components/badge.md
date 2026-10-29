# Badge

A badge labels a thing with a tag or a status. It is a 20px tag with `radius-sm`, 12px medium text and an optional 12px icon at a 1.25px stroke.

## Example

```tsx
import { Badge } from "@usememos/ui";
import { Hash, Lock } from "lucide-react";

<Badge icon={<Hash />}>reading</Badge>
<Badge tone="outline" icon={<Lock />}>Private</Badge>
<Badge tone="success">Synced</Badge>
```

## Props

```ts
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: Tone | "outline"; // default "neutral"
  icon?: IconElement;
  children: React.ReactNode; // one or two words
  render?: React.ReactElement;
}
```

## Guidelines

- Tags use `neutral` (`ink` on `well`) with a hash icon. Visibility uses `outline` with its icon.
- Status tones use their `-soft` background and full-strength text. Always pair the color with a word.
- Badges are not buttons. A clickable tag filter is a [Toggle](toggle.md).
- Badges are never pills.
