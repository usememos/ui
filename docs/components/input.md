# Input

Takes one line of text.

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
  prefix?: React.ReactNode;        // says what the field is: a search or link icon
  suffix?: React.ReactNode;        // one action on the value (copy, clear), or a unit
  className?: string;              // on the visible box, not the <input>
  style?: React.CSSProperties;     // on the visible box, not the <input>
}
```

Wraps Base UI's [Input](https://base-ui.com/react/components/input), so inside a [Field](field.md) it gets its label, description and validity. The ref and every other prop (`value`, `onValueChange`, `type`, `disabled`, native attributes) go to the `<input>`. The visible box is a `<span>` around it that fills its container's width.

## Rules

- Provide a `Field.Label` or `aria-label`. Never a placeholder alone.
- `prefix` and `suffix` hold an icon, a short word or a small ghost Button.
- `sm` for filters inside panels, `md` everywhere else.

## Style

- Flat `surface` with a 1px `edge` and a faint inner shadow from the top. Never a gray well, so it never reads as disabled.
- Typed text weight 400; placeholder `ink-muted`.
- Hover darkens the edge to `ink-muted`; focus adds the ring. The background never changes.
- The side with a prefix or suffix has 2px less padding.
