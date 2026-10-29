# Tooltip

Names an icon-only control and shows its shortcut.

## Example

```tsx
import { Button, Tooltip } from "@usememos/ui";
import { Archive } from "lucide-react";

<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger render={<Button variant="ghost" icon={<Archive />} aria-label="Archive" />} />
    <Tooltip.Popup shortcut="⌘ E">Archive</Tooltip.Popup>
  </Tooltip.Root>
</Tooltip.Provider>
```

## Parts

| Part | Base UI part | Renders |
| --- | --- | --- |
| `Tooltip.Provider` | `Tooltip.Provider` | Nothing. Shares the hover delay, so the next tooltip in a toolbar opens at once |
| `Tooltip.Root` | `Tooltip.Root` | Nothing. Groups a trigger and its popup |
| `Tooltip.Trigger` | `Tooltip.Trigger` | The control, usually a Button through `render` |
| `Tooltip.Popup` | `Tooltip.Portal`, `Positioner`, `Popup` | The label, a `<div>` portaled to the body |

## Props

```ts
interface Tooltip.TriggerProps extends BaseTooltip.Trigger.Props {
  delay?: number; // hover time before opening, ms; default 400
}
interface Tooltip.PopupProps extends BaseTooltip.Popup.Props {
  shortcut?: React.ReactNode; // after the label, at 65% opacity
  side?: Side; align?: Align; sideOffset?: number; alignOffset?: number; collisionPadding?: Padding; // Positioner props; default side "top", sideOffset 6
  container?: HTMLElement | ShadowRoot | React.RefObject<HTMLElement | ShadowRoot | null> | null; // portal target
}
```

Base UI's props pass through: `open`, `defaultOpen`, `onOpenChange`, `disabled` on the root; `closeOnClick` on the trigger; `delay`, `closeDelay`, `timeout` on the provider.

## Rules

- Give every icon-only Button and Toggle a tooltip with the same text as its `aria-label`. Two or three words.
- Never put essential information only in a tooltip: it doesn't open on touch screens.
- For text that explains something, use a [Popover](popover.md) instead.
- Wrap a toolbar, or the whole app, in one `Tooltip.Provider`.

## Style

- `primary` background, `on-primary` text, `label-sm`, `radius-md`, `space-1` by `space-2` padding, at most `tooltip-width` wide.
- Opens after 400ms of hover, or at once on keyboard focus. Fades in and rises `space-1`; no rise under reduced motion.
