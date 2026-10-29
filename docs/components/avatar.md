# Avatar

An avatar shows a person. It is a circle with the person's photo, or their initials in `ink-muted` on `well`.

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
| `Avatar.Image` | `Avatar.Image` | The photo, an `<img>`, shown once it has loaded |
| `Avatar.Fallback` | `Avatar.Fallback` | The initials, shown while there is no photo or it fails to load |

## Props

```ts
interface Avatar.RootProps extends BaseAvatar.Root.Props {
  size?: Size; // 24, 32, 40px
}
// Avatar.Image and Avatar.Fallback take Base UI's props (src, alt, delay, render ...).
```

## Guidelines

- Give the image an `alt` with the person's name. Initials are one or two letters, computed by the app.
- Use `sm` in lists and comments, `md` in a sidebar, `lg` on profile pages.
- Avatars are one of the three round shapes in the system, with radios and switches.
