# Patterns

How the components go together. Each product builds its screens from these patterns. None of them is specific to one product.

## Page

- From `breakpoint-md` (1024px) up: a fixed sidebar of `sidebar-width` (240px). Below it, the sidebar is a sheet opened from a ghost button.
- Content sits in a column of at most `content-width` (720px), padded `space-4` on phones and `space-6` on desktop.
- A page header is a `heading` with an optional `body` line under it, and the page's one primary action at the right. `heading` appears once per page.
- Sections inside a page have a `label` title (14px, 500) with `space-6` above it and `space-2` below. Section titles are never larger than the text around them; space and grouping set them apart. A section's rows use `label` for the name and `caption` in `ink-muted` for the description.

## Form

- Fields stack `space-4` apart with the label above the control.
- Related checkboxes or switches sit in a `Fieldset`.
- Actions go at the end, right-aligned: a ghost Cancel, then the primary.
- A form that saves at once (settings) uses switches and has no Save button. A form with a Save button uses checkboxes.
- Errors appear under the field, in words that say how to fix it.

## Entry

A repeated unit of content in a list: a note, a comment, a changelog item.

- **Header line** in `caption` (`ink-muted`): who or when, visibility as an outline Badge, and a ghost Menu trigger at the right that appears on hover. On touch screens the menu trigger is always visible.
- **Body** in `Prose`.
- **Footer line:** tags as Prose tags, attachments, reactions.
- Entries are separated by `space-6` of whitespace or a `Separator`, never by boxes.

## Confirmation

- A destructive action opens an alert Dialog that names the object and the outcome.
- It has a ghost Cancel and a danger Button that repeats the verb ("Delete note").
- On phones it is a sheet with stacked, full-width buttons.
- After the action runs, a neutral Toast confirms it, with Undo where undo is possible.

## Loading

- A list or page that is loading shows Skeletons in the shape of what is coming. The layout must not jump when content arrives.
- A control that is waiting uses its `loading` prop.
- Nothing spins for less than about 300ms.
- Mark the loading region with `aria-busy`.

## Empty state

Centered in the content column:

- a `title` line that says what is missing ("No notes yet"),
- a `body` line that says what to do,
- one primary Button.

No illustration.

## Mobile

Under `breakpoint-sm` (640px):

- One column.
- Dialogs and menus become sheets.
- Toasts sit bottom-center.
- Every control keeps its 44px hit area.
- Controls stay `md`. `lg` is for marketing pages and primary actions in sheets.
