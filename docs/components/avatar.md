# Avatar

An avatar shows a person. It is a circle with the person's photo, or their initials in `ink-muted` on `well`.

## Props

```ts
interface AvatarProps {
  name?: string; // used for initials and the accessible name
  src?: string;
  size?: Size;   // 24, 32, 40px
}
```

## Guidelines

- Use `sm` in lists and comments, `md` in a sidebar, `lg` on profile pages.
- Avatars are one of the three round shapes in the system, with radios and switches.
