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
  variant?: "panel" | "bare"; // default "panel"; bare: no padding, gap or X (Dialog only)
  fullScreen?: boolean;  // covers the whole screen with square corners, at every width (Dialog only)
  closeLabel?: string;  // accessible name of the X; default "Close"
  container?: HTMLElement | ShadowRoot | React.RefObject<HTMLElement | ShadowRoot | null> | null; // portal target
}
// AlertDialog.Popup takes sheet and container; it has no X, no variant and no fullScreen.
```

Base UI's props pass through: `open`, `defaultOpen`, `onOpenChange`, `modal`, `disablePointerDismissal` on the root; `initialFocus`, `finalFocus` on the popup.

## Rules

- Title: a question or a task ("Delete this note?", "Create access token"). Description: what will happen.
- Footer: Cancel as a `ghost` Button, then the action. Name the action with its verb, never "OK". Use `danger` only for destructive confirmations.
- Use AlertDialog for confirmations; see the [confirmation pattern](../patterns.md#confirmation). Open it from a Menu item with `open` and `onOpenChange`.
- Escape and a backdrop click close a Dialog. While a form has unsaved input, keep it open from `onOpenChange`.
- Focus moves into the dialog and returns to the trigger on close.
- `variant="bare"` is for content that runs edge to edge: a search palette, a picker with its own header, an image. The content sets its own padding. Name the dialog with a `Dialog.Title` (hidden with `mu-visually-hidden` if needed) or `aria-label` on the popup; Escape and a backdrop click still close it.
- Every Dialog has the same backdrop, `overlay`, including a search palette and a `variant="bare"` one. There is no prop or class slot to lighten or remove it: a Dialog is modal, and a lighter scrim would make one modal layer look like a different kind of layer.
- `fullScreen` is for content that needs the whole screen, such as an image viewer (`variant="bare" fullScreen`). It replaces the sheet on phones. The content handles the safe-area insets. Don't add `fixed inset-0` or `rounded-none` yourself.
- The panel is always md: controls inside it ignore the size of a Root the Dialog is declared in (a sm Table). Pass `size` to a control inside only when it should differ.

## Style

- `mu-popup` with `radius-2xl`, `space-5` padding, `dialog-width` wide; children stack `space-4` apart, and the Footer sits `space-6` under them. The backdrop is `overlay`.
- Title: `title`. Description: `body` in `text-secondary`, `space-1` under the title, so the two read as one header. The X is a small ghost Button at `space-4` from the corner. The title leaves room for the same 24px close button on every input device.
- Opening and closing use the shared [Motion](../motion.md) fade and `space-1` offset over `duration-settle`; the backdrop fades with the same timing. A sheet uses `space-6` from the bottom, with square bottom corners and full-width buttons stacked with the action on top. Opening and closing are immediate under reduced motion, including the backdrop.
- Long content scrolls the viewport around the panel.
- `bare`: no padding, no gap and no X; the content is clipped to the radius. Set the width with `className` when it differs from `dialog-width`.
- `fullScreen`: the viewport's padding goes, and the popup fills it with square corners.
