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

function textareaClasses(options?: { size?: "sm" | "md" }): string;
```

Base UI has no textarea part, so this renders Base UI's `Field.Control` as a `<textarea>`. Inside a [Field](field.md) it gets its label, description and validity. Native textarea props (`value`, `onChange`, `maxLength`) pass through.

## Rules

- Provide a `Field.Label` or `aria-label`.
- Rich content is not a textarea: use the editor (`@usememos/editor`) and its own content styles.
- An app's own multi-line field, such as a content-editable editor, takes `textareaClasses()`: the caret or text selection indicates focus without changing the edge, and `aria-invalid="true"` or `aria-disabled="true"` show those states. See [Class functions](../custom-components.md#class-functions).

## Style

- Looks like [Input](input.md), including an unchanged border and surface under mouse and keyboard focus. The caret or text selection identifies the active field; state changes have no animation. Resizes vertically only.
- Typed text follows the size row on every input device, like Input: 13px on an 18px line at sm and 14px on a 20px line at md.
