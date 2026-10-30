# Popover

A small floating panel of controls next to its trigger, such as a share panel or a link editor.

## Example

```tsx
import { Button, Input, Popover } from "@usememos/ui";

<Popover.Root>
  <Popover.Trigger render={<Button>Share</Button>} />
  <Popover.Popup align="start">
    <Popover.Title>Share this note</Popover.Title>
    <Popover.Description>Anyone with the link can read it.</Popover.Description>
    <Input readOnly value={link} aria-label="Link" />
  </Popover.Popup>
</Popover.Root>
```

## Parts

| Part | Base UI part | Renders |
| --- | --- | --- |
| `Popover.Root` | `Popover.Root` | Nothing. Groups a trigger and its popup |
| `Popover.Trigger` | `Popover.Trigger` | The control that opens it, usually a Button through `render` |
| `Popover.Popup` | `Popover.Portal`, `Positioner`, `Popup` | The panel, a `<div>` portaled to the body |
| `Popover.Title` | `Popover.Title` | An `<h2>` that names the popup |
| `Popover.Description` | `Popover.Description` | A `<p>` under the title |
| `Popover.Close` | `Popover.Close` | A button that closes it, usually a Button through `render` |

## Props

```ts
interface Popover.PopupProps extends BasePopover.Popup.Props {
  side?: Side; align?: Align; // Positioner props; default side "bottom"
  container?: HTMLElement | ShadowRoot | React.RefObject<HTMLElement | ShadowRoot | null> | null; // portal target
}
```

Base UI's props pass through: `open`, `defaultOpen`, `onOpenChange`, `modal` on the root; `openOnHover`, `delay` on the trigger; `initialFocus`, `finalFocus` on the popup.

## Rules

- Use it for a few controls that belong to one thing. For a list of actions, use [Menu](menu.md). For a decision that blocks the page, use [Dialog](dialog.md).
- Give it a `Popover.Title`, or `aria-label` on the popup.
- It closes on Escape and on a click outside; focus returns to the trigger.

## Style

- `mu-popup` (`surface`, `shadow-pop`, `radius-xl`), `space-4` padding, `popover-width` wide. Children stack `space-3` apart.
- Title: `label`. Description: `caption` in `ink-muted`, `space-1` under the title.
- Fades in and rises `space-1` over `duration-fade`; no rise under reduced motion.
