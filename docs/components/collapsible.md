# Collapsible

Hides content behind one trigger until people ask for it.

## Example

```tsx
import { Collapsible } from "@usememos/ui";

<Collapsible.Root>
  <Collapsible.Trigger>Advanced settings</Collapsible.Trigger>
  <Collapsible.Panel>…</Collapsible.Panel>
</Collapsible.Root>
```

## Parts

| Part | Base UI part | Renders |
| --- | --- | --- |
| `Collapsible.Root` | `Collapsible.Root` | A `<div>` around the trigger and panel. Takes `size` |
| `Collapsible.Trigger` | `Collapsible.Trigger` | A ghost [Button](button.md) with a chevron at the end that turns while open |
| `Collapsible.Panel` | `Collapsible.Panel` | The content, a `<div>`; unmounted while closed unless `keepMounted` |

## Props

```ts
interface Collapsible.RootProps extends BaseCollapsible.Root.Props {
  size?: "sm" | "md"; // the trigger's size
}
```

Base UI's props pass through: `open`, `defaultOpen`, `onOpenChange`, `disabled` on the root; `keepMounted`, `hiddenUntilFound` on the panel.

## Rules

- Use it for "Show more" on long content, advanced settings and secondary details.
- The trigger label names what is hidden. To change it while open ("Show less"), control `open` and swap the label.
- For several sections that open one at a time, stack Collapsibles and control them. There is no Accordion.
- Enter and Space toggle it; the trigger has `aria-expanded`.

## Style

- The trigger is a ghost key that bleeds `px` to the left, so its label lines up with the content below.
- The chevron is `ink-muted` and turns 180° over `duration-settle` with `ease-settle`.
- The panel fades in and rises `space-1` over `duration-fade`. Its height never animates. No rise or turn under reduced motion.
