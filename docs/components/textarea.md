# Textarea

Takes a few lines of plain text.

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
  size?: "sm" | "md";
  rows?: number; // visible lines, default 3
}
```

Base UI has no textarea part, so this renders Base UI's `Field.Control` as a `<textarea>`. Inside a [Field](field.md) it gets its label, description and validity. Native textarea props (`value`, `onChange`, `maxLength`) pass through.

## Rules

- Provide a `Field.Label` or `aria-label`.
- Rich content is not a textarea: use the editor (`@usememos/editor`) with [Prose](prose.md).

## Style

- Looks like [Input](input.md). Resizes vertically only.
