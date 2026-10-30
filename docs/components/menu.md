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
| `Menu.Item` | `Menu.Item` | One action. Takes `icon`, `shortcut`, `danger` |
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
  danger?: boolean;           // destructive: red text
}
// CheckboxItem and RadioItem take icon and shortcut too. SubmenuTrigger takes icon.

function menuClasses(options?: { size?: "sm" | "md" }): {
  popup: string; item: string; dangerItem: string; label: string;
  shortcut: string; separator: string; groupLabel: string;
};
```

Base UI's props pass through: `open`, `defaultOpen`, `onOpenChange`, `modal` on the root; `onClick`, `closeOnClick`, `disabled`, `label` on items; `checked`, `defaultChecked`, `onCheckedChange` on CheckboxItem; `value`, `defaultValue`, `onValueChange` on RadioGroup; `value` on RadioItem.

## Rules

- Act in `onClick`. Labels are verbs in sentence case.
- Put destructive items last, after a Separator, with `danger`. Confirm them with an [AlertDialog](dialog.md).
- CheckboxItems and RadioItems stay open on click, so people can change several.
- For picking a value saved with a form, use [Select](select.md).
- Arrow keys move the highlight; typing jumps to an item; Escape and an outside click close it; focus returns to the trigger.
- An app's own floating list, such as an editor's suggestion list, takes `menuClasses()`: `popup` on the list, `item` on each row, and `data-highlighted` on the active row. See [Class functions](../custom-components.md#class-functions).

## Style

- `mu-popup` with `space-1` padding, at least `menu-width` wide, scrolls when taller than the space available.
- Rows are a control height (24 or 32px), text weight 400; icons in `ink-muted`; the shortcut right-aligned in `ink-muted`.
- The highlighted row uses `hover`. Disabled rows fade to 45%. `danger` rows use `danger`.
- A ghost trigger keeps its `hover` background while the menu is open.
- Fades in and rises `space-1` over `duration-fade`; no rise under reduced motion.
