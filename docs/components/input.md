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
  size?: "sm" | "md";
  prefix?: React.ReactNode;        // says what the field is: a search or link icon
  suffix?: React.ReactNode;        // one action on the value (copy, clear), or a unit
  className?: string;              // on the visible box, not the <input>
  style?: React.CSSProperties;     // on the visible box, not the <input>
}

function inputClasses(options?: { size?: "sm" | "md" }): string; // the visible box
```

Wraps Base UI's [Input](https://base-ui.com/react/components/input), so inside a [Field](field.md) it gets its label, description and validity. The ref and every other prop (`value`, `onValueChange`, `type`, `disabled`, native attributes) go to the `<input>`. The visible box is a `<span>` around it that fills its container's width.

## Rules

- Provide a `Field.Label` or `aria-label`. Never a placeholder alone.
- `prefix` and `suffix` hold an icon, a short word or a small ghost Button.
- `sm` for filters inside panels, `md` everywhere else.
- An app's own one-line field, such as a tag input around a native `<input>`, takes `inputClasses()` on its box: focus anywhere inside darkens the edge, and `aria-invalid="true"` or `aria-disabled="true"` on the box show those states. See [Class functions](../custom-components.md#class-functions).

## Style

- Enabled fields use flat `surface` with a quiet 1px `edge` border. A gray well is reserved for the disabled state.
- Typed text weight 400; placeholder `text-secondary`. On touch screens typed text is 16px at every size, so iOS Safari does not zoom in on focus; the field keeps its height.
- Hover darkens the edge to `control-edge`; focus recolors the 1px edge to `focus-edge` (ink), on click and keyboard alike. There is no ring around the field. The background stays fixed on hover and focus. Invalid fields keep their `danger` edge on hover and focus. Disabled fields use `well`, a quiet `edge` and `text-disabled` text. See [boundary contrast](../depth.md#rules) for the resting edge's contrast tradeoff.
- The side with a prefix or suffix has 2px less padding.
