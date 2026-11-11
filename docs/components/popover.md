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
  variant?: "panel" | "list"; // default "panel"; list: a Menu's padding and no gap, for rows
}

function popoverClasses(options?: { variant?: "panel" | "list" }): { popup: string; title: string; description: string };
```

Base UI's props pass through: `open`, `defaultOpen`, `onOpenChange`, `modal` on the root; `openOnHover`, `delay` on the trigger; `initialFocus`, `finalFocus` on the popup.

## Rules

- Use it for a few controls that belong to one thing. For a list of actions, use [Menu](menu.md). For a decision that blocks the page, use [Dialog](dialog.md).
- Give it a `Popover.Title`, or `aria-label` on the popup.
- `variant="list"` is for a panel made of rows, such as an account panel (a name, then links) or a scope picker with a header. Draw the rows with `menuClasses().item` and the lines between them with `menuClasses().separator`. When the rows are only actions, use a [Menu](menu.md) instead. For 28px rows beside a sidebar with `mu-compact`, put `mu-compact` on the popup too: `className="mu-compact"`.
- A row that opens a list of choices beside the panel (Theme, Language) is its own `Menu.Root`: the row is the `Menu.Trigger` (`openOnHover`, `render={<button className={menuClasses().item} />}`), and its `Menu.Popup` takes `side="inline-end" align="start"`. The choices then line up with the row like a submenu's, and the menu's edge touches the panel's. Give the Menu's popup `mu-compact` too when the panel has it.
- The panel is always md: controls inside it ignore the size of the Root around the Popover (a sm toolbar). Pass `size` to a control inside only when it should differ.
- It closes on Escape and on a click outside; focus returns to the trigger.
- An app's own floating panel, such as an emoji picker, takes `popoverClasses()`. See [Class functions](../custom-components.md#class-functions).

## Style

- `mu-popup` (`surface`, a 1px `edge`, `radius-xl`), `space-4` padding, `popover-width` wide. Children stack `space-3` apart.
- Title: `label`. Description: `caption` in `text-secondary`, `space-1` under the title.
- `list`: 6px padding and no gap, like a Menu. A title and description inside line up with the rows' text, with `space-2` above the title and below the description.
- Fades in and rises `space-1` over `duration-fade`; no rise under reduced motion.
