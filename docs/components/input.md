# Input

A text input takes one line of text. It is `surface` with a 1px `edge`, a faint inner shadow from the top, and the `focus` ring when active.

## Example

```tsx
import { Input } from "@usememos/ui";
import { Search } from "lucide-react";

<Input prefix={<Search />} placeholder="Search notes" aria-label="Search notes" />
```

## Props

```ts
interface InputProps extends Omit<BaseInput.Props, "size" | "prefix"> {
  size?: Size;
  prefix?: React.ReactNode; // says what the field is: a search or link icon
  suffix?: React.ReactNode; // one action on the value (copy, clear), or a unit
  className?: string;       // goes on the visible box, not the <input>
  style?: React.CSSProperties; // goes on the visible box, not the <input>
}
```

`Input` wraps Base UI's [Input](https://base-ui.com/react/components/input), so inside a [Field](field.md) it gets its label, description and validity. The ref and every other prop (`value`, `onValueChange`, `type`, `disabled`, native attributes) go to the `<input>`. The visible box is a `<span>` around it, so `prefix` and `suffix` sit inside the edge. The box fills its container's width.

Provide a `Field.Label` or `aria-label`.

## Guidelines

- Text entry is flat, never a gray well, so it never reads as disabled next to a key.
- Typed text is weight 400. The placeholder is `ink-muted` and never the only label.
- Hover darkens the edge to `ink-muted`; focus adds the ring. The background never changes.
- `prefix` and `suffix` can hold an icon, a short word or a small ghost Button. The side with one has 2px less padding.
- Use `sm` for filters inside panels and `md` everywhere else.
