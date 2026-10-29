# Textarea

A textarea takes a few lines of plain text. It looks like [Input](input.md): `surface` with an `edge`, three lines tall by default.

## Example

```tsx
import { Field, Textarea } from "@usememos/ui";

<Field.Root>
  <Field.Label>About</Field.Label>
  <Textarea placeholder="A line or two about you" />
</Field.Root>
```

## Props

```ts
interface TextareaProps extends Omit<BaseField.Control.Props, "size" | "render"> {
  size?: Size;
  rows?: number; // visible lines, default 3
}
```

Base UI has no textarea part, so `Textarea` renders Base UI's `Field.Control` as a `<textarea>`. Inside a [Field](field.md) it gets its label, description and validity like an Input. Native textarea props (`value`, `onChange`, `maxLength`) pass through.

Provide a `Field.Label` or `aria-label`.

## Guidelines

- Rich content is not a textarea. It is the editor (`@usememos/editor`), styled with [Prose](prose.md) from the same tokens.
- People can resize it vertically only.
