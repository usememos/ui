# Input

A text input takes one line of text. It is `surface` with a 1px `edge`, a faint inner shadow from the top, and the `focus` ring when active.

## Props

```ts
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  size?: Size;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}
```

Provide a [Field](field.md) label or `aria-label`, plus native input props. The input fills its container's width.

## Guidelines

- Text entry is flat, never a gray well, so it never reads as disabled next to a key.
- Typed text is weight 400. The placeholder is `ink-muted` and never the only label.
- Hover darkens the edge to `ink-muted`; focus adds the ring. The background never changes.
- `prefix` is for an icon that says what the field is (search, link). `suffix` is for one action on the value (copy, clear) or a unit. Both can hold an icon, a short word or a small ghost Button.
- Use `sm` for filters inside panels and `md` everywhere else.
