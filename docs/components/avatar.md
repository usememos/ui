# Avatar

Shows a person.

## Example

```tsx
import { Avatar } from "@usememos/ui";

<Avatar.Root size="sm">
  <Avatar.Image src={user.avatarUrl} alt={user.name} />
  <Avatar.Fallback>{initials(user.name)}</Avatar.Fallback>
</Avatar.Root>
```

## Parts

| Part | Base UI part | Renders |
| --- | --- | --- |
| `Avatar.Root` | `Avatar.Root` | The circle, a `<span>`. Takes `size` |
| `Avatar.Image` | `Avatar.Image` | The photo, an `<img>`, shown once loaded |
| `Avatar.Fallback` | `Avatar.Fallback` | The initials, shown while there is no photo or it fails to load |

## Props

```ts
interface Avatar.RootProps extends BaseAvatar.Root.Props {
  size?: Size; // 20, 24, 32px
}
```

`Avatar.Image` and `Avatar.Fallback` take Base UI's props (`src`, `alt`, `delay`, `render`).

## Rules

- Give the image an `alt` with the person's name. Initials are one or two letters, computed by the app.
- `xs` inline with a name in 13px text, `sm` in lists and comments, `md` in a sidebar and on profile pages.

## Style

- A circle (one of three round shapes, with radios and switches). Initials in `ink-muted` on `well`.
