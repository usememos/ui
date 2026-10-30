# Badge

Labels a thing with a tag or a status.

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

## Rules

- Tags: `neutral` with a `Hash` icon. Visibility: `outline` with its icon. Status: `success`, `warning` or `danger`, always with a word, never color alone.
- A badge is not a button. A clickable tag filter is a [Toggle](toggle.md).

## Style

- `control-xs` (20px) tall, `radius-sm` (never a pill), `label-xs` text (12px, 500), optional `icon-xs` (12px) icon at a 1.25px stroke. It lines up with xs controls.
- `neutral`: `ink` on `well`. Status tones: their `-soft` background with full-strength text.
