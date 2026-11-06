# Menu

Lists actions for one thing, opened from a trigger.

## Example

```tsx
import { Button, Menu } from "@usememos/ui";
import { Ellipsis, FolderInput, Pin, Trash2 } from "lucide-react";

<Menu.Root>
  <Menu.Trigger render={<Button variant="ghost" icon={<Ellipsis />} aria-label="More actions" />} />
  <Menu.Popup align="end">
    <Menu.Item icon={<Pin />} shortcut="P" onClick={pin}>Pin</Menu.Item>
    <Menu.SubmenuRoot>
      <Menu.SubmenuTrigger icon={<FolderInput />}>Move to</Menu.SubmenuTrigger>
      <Menu.Popup>
        <Menu.Item onClick={() => move("inbox")}>Inbox</Menu.Item>
      </Menu.Popup>
    </Menu.SubmenuRoot>
    <Menu.Separator />
    <Menu.Item icon={<Trash2 />} danger onClick={confirmDelete}>Delete</Menu.Item>
  </Menu.Popup>
</Menu.Root>
```

## Parts

| Part | Base UI part | Renders |
| --- | --- | --- |
| `Menu.Root` | `Menu.Root` | Nothing. Groups a trigger and its popup. Takes `size` |
| `Menu.Trigger` | `Menu.Trigger` | The control that opens it, usually a Button through `render` |
| `Menu.Popup` | `Menu.Portal`, `Positioner`, `Popup` | The list, a `<div role="menu">` portaled to the body. Also a submenu's list |
| `Menu.Item` | `Menu.Item` | One action. Takes `icon`, `shortcut`, `description`, `danger` |
| `Menu.CheckboxItem` | `Menu.CheckboxItem` with its indicator | An option that turns on or off, with a check at the end |
| `Menu.RadioGroup` | `Menu.RadioGroup` | Groups RadioItems; holds the value |
| `Menu.RadioItem` | `Menu.RadioItem` with its indicator | One choice, with a check at the end when chosen |
| `Menu.Group` | `Menu.Group` | A labeled set of items |
| `Menu.GroupLabel` | `Menu.GroupLabel` | The name of a Group or RadioGroup |
| `Menu.Separator` | `Menu.Separator` | A line between groups |
| `Menu.SubmenuRoot` | `Menu.SubmenuRoot` | Nothing. Holds a SubmenuTrigger and a Popup |
| `Menu.SubmenuTrigger` | `Menu.SubmenuTrigger` | The row that opens a submenu, with a chevron at the end. Takes `icon` |

## Props

```ts
interface Menu.RootProps extends BaseMenu.Root.Props {
  size?: "sm" | "md"; // row height: 24, 32px. An xs trigger still opens sm rows
}
interface Menu.PopupProps extends BaseMenu.Popup.Props {
  side?: Side; align?: Align; // Positioner props; default side "bottom"
  container?: HTMLElement | ShadowRoot | React.RefObject<HTMLElement | ShadowRoot | null> | null; // portal target
}
interface Menu.ItemProps extends BaseMenu.Item.Props {
  icon?: IconElement;
  shortcut?: React.ReactNode; // at the end of the row, "⌘ D"
  description?: React.ReactNode; // a line of ink-muted text under the label; the row grows to two lines
  danger?: boolean;           // destructive: red text
}
// CheckboxItem and RadioItem take icon, shortcut and description too. SubmenuTrigger takes icon.

function menuClasses(options?: { size?: "sm" | "md" }): {
  popup: string; item: string; dangerItem: string; label: string; text: string; description: string;
  shortcut: string; separator: string; groupLabel: string;
};
```

Base UI's props pass through: `open`, `defaultOpen`, `onOpenChange`, `modal` on the root; `onClick`, `closeOnClick`, `disabled`, `label` on items; `checked`, `defaultChecked`, `onCheckedChange` on CheckboxItem; `value`, `defaultValue`, `onValueChange` on RadioGroup; `value` on RadioItem.

## Rules

- Act in `onClick`. Labels are verbs in sentence case.
- Put destructive items last, after a Separator, with `danger`. Confirm them with an [AlertDialog](dialog.md).
- CheckboxItems and RadioItems stay open on click, so people can change several. A RadioItem that picks one setting and is done (a visibility picker) takes `closeOnClick`.
- `description` explains a choice in a few words ("Only you can see it"). The item is named by its label and described by the description. Keep descriptions to one short line; they wrap when longer.
- For picking a value saved with a form, use [Select](select.md). For content that stays open while people use it (inputs, text, several controls), use [Popover](popover.md). See [Menu or Popover](../usage.md#menu-or-popover).
- To open a Dialog from an item, keep the Dialog outside the Menu and control its `open`. See [the recipe](../usage.md#a-menu-item-that-opens-a-dialog).
- Arrow keys move the highlight; typing jumps to an item; Escape and an outside click close it; focus returns to the trigger.
- An app's own floating list, such as an editor's suggestion list, takes `menuClasses()`: `popup` on the list, `item` on each row, and `data-highlighted` on the active row. `item` works on a `<div>`, a `<button>` or an `<a>`: it resets their width, border, fill, font and centered text. See [Class functions](../custom-components.md#class-functions).

## Style

- `mu-popup` with `space-1` padding, at least `menu-width` wide, scrolls when taller than the space available.
- Rows are a control height (24 or 32px), text weight 400; icons in `ink-muted`; the shortcut right-aligned in `ink-muted`. Text starts at the start edge.
- A row with a description grows: the label, then the description in `caption` and `ink-muted`, with the row's vertical padding above and below. The icon and the check stay on the label's line.
- The highlighted row uses `hover`, and so does a row whose menu is open (a SubmenuTrigger, or a `menuClasses().item` row that is a `Menu.Trigger`). Disabled rows fade to 45%. `danger` rows use `danger`.
- A ghost trigger keeps its `hover` background while the menu is open.
- Fades in and rises `space-1` over `duration-fade`; no rise under reduced motion.
- A submenu opens beside its trigger row, 4px from the row. The row sits `space-1` inside the parent menu, so the submenu's edge touches the parent's edge.
- A menu that opens to the side of its trigger (`side` left, right, `inline-start` or `inline-end`; a submenu always does), aligned to `start` or `end`, moves along the trigger by its own top padding (`space-1`, read when it is placed). Its first row lines up with the trigger. With no room below, it opens upward instead and its last row lines up with the trigger. A menu that opens above or below, or is centered, does not move.
