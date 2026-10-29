# Dialog and AlertDialog

Dialog asks for a short form or a decision on top of the page. AlertDialog asks to confirm an action and closes only through its buttons.

## Example

```tsx
import { AlertDialog, Button, Dialog, Field, Input } from "@usememos/ui";

<Dialog.Root>
  <Dialog.Trigger render={<Button>Create access token</Button>} />
  <Dialog.Popup>
    <Dialog.Title>Create access token</Dialog.Title>
    <Dialog.Description>Use it to call the API from scripts.</Dialog.Description>
    <Field.Root>
      <Field.Label>Description</Field.Label>
      <Input />
    </Field.Root>
    <Dialog.Footer>
      <Dialog.Close render={<Button variant="ghost">Cancel</Button>} />
      <Button variant="primary" onClick={create}>Create</Button>
    </Dialog.Footer>
  </Dialog.Popup>
</Dialog.Root>

<AlertDialog.Root open={open} onOpenChange={setOpen}>
  <AlertDialog.Popup>
    <AlertDialog.Title>Delete this note?</AlertDialog.Title>
    <AlertDialog.Description>It moves to the trash for 30 days.</AlertDialog.Description>
    <AlertDialog.Footer>
      <AlertDialog.Close render={<Button variant="ghost">Cancel</Button>} />
      <Button variant="danger" onClick={remove}>Delete</Button>
    </AlertDialog.Footer>
  </AlertDialog.Popup>
</AlertDialog.Root>
```

## Parts

Dialog and AlertDialog have the same parts.

| Part | Base UI part | Renders |
| --- | --- | --- |
| `Root` | `Root` | Nothing. Holds the open state |
| `Trigger` | `Trigger` | The control that opens it, usually a Button through `render` |
| `Popup` | `Portal`, `Backdrop`, `Viewport`, `Popup` | The panel over a dimmed backdrop, portaled to the body. Dialog adds an X at the top right |
| `Title` | `Title` | An `<h2>` that names the dialog |
| `Description` | `Description` | A `<p>` under the title |
| `Close` | `Close` | A button that closes it, usually a Button through `render` |
| `Footer` | none (ours) | A `<div>` that right-aligns the buttons |

## Props

```ts
interface Dialog.PopupProps extends BaseDialog.Popup.Props {
  sheet?: boolean;      // below breakpoint-sm, a sheet from the bottom; default true
  closeLabel?: string;  // accessible name of the X; default "Close"
  container?: HTMLElement | ShadowRoot | React.RefObject<HTMLElement | ShadowRoot | null> | null; // portal target
}
// AlertDialog.Popup takes sheet and container; it has no X.
```

Base UI's props pass through: `open`, `defaultOpen`, `onOpenChange`, `modal`, `disablePointerDismissal` on the root; `initialFocus`, `finalFocus` on the popup.

## Rules

- Title: a question or a task ("Delete this note?", "Create access token"). Description: what will happen.
- Footer: Cancel as a `ghost` Button, then the action. Name the action with its verb, never "OK". Use `danger` only for destructive confirmations.
- Use AlertDialog for confirmations; see the [confirmation pattern](../patterns.md#confirmation). Open it from a Menu item with `open` and `onOpenChange`.
- Escape and a backdrop click close a Dialog. While a form has unsaved input, keep it open from `onOpenChange`.
- Focus moves into the dialog and returns to the trigger on close.

## Style

- `mu-popup` with `radius-2xl`, `space-5` padding, `dialog-width` wide; children stack `space-4` apart. The backdrop is `overlay`.
- Title: `title`. Description: `body` in `ink-muted`, `space-2` under the title. The X is a small ghost Button at `space-4` from the corner.
- Fades in and rises `space-1` over `duration-settle`. A sheet slides up `space-6`, with square bottom corners and full-width buttons stacked with the action on top. No movement under reduced motion.
- Long content scrolls the viewport around the panel.
