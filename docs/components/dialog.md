# Dialog

A dialog asks for a decision or a short form on top of the page. It is a `surface` panel with `radius-2xl` and `space-5` padding over a dimmed `overlay`. Under `breakpoint-sm` it becomes a sheet that rises from the bottom, with full-width stacked buttons.

## Props

```ts
interface DialogProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode; // form fields
  footer?: React.ReactNode | ((close: () => void) => React.ReactNode);
  trigger?: React.ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  alert?: boolean;       // confirmations: no close button
  closeButton?: boolean;
  sheet?: boolean;       // true forces the bottom sheet; false keeps a centered dialog under breakpoint-sm
}
```

## Guidelines

- The title is a question or a task ("Delete this note?", "Create access token") in the `title` style. The description says what will happen.
- Buttons sit right-aligned: Cancel as `ghost`, then the action. Name the action with its verb, never "OK".
- Use `alert` for confirmations. See the [confirmation pattern](../patterns.md#confirmation).
- Form dialogs get a close button at the top right. Escape and a click on the backdrop close the dialog, except while a form has unsaved input.
- Long content scrolls inside the panel; the title and footer stay put.
- The dialog fades in and rises 4px over `duration-settle`. A sheet slides up 24px.
