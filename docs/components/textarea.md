# Textarea

A textarea takes a few lines of plain text. It looks like [Input](input.md): `surface` with an `edge`, three lines tall by default.

## Props

```ts
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: Size;
}
```

Provide a [Field](field.md) label or `aria-label`, plus native textarea props (`rows`, `value`, `onChange`).

## Guidelines

- Rich content is not a textarea. It is the editor (`@usememos/editor`), styled with [Prose](prose.md) from the same tokens.
- People can resize it vertically only.
