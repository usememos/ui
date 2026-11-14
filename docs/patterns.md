# Patterns

How the components go together. Each product builds its screens from these patterns. None of them is specific to one product. The gaps come from the [spacing ladder](layout.md#spacing). The playground verifies component props and focused compositions; product screen mockups belong to the products, not this package's test fixture.

## Page

- From `breakpoint-md` (1024px) up: a fixed sidebar of `sidebar-width` (240px). Below it, the sidebar is a [Drawer](components/drawer.md) from the start edge (`side="start"`, `variant="bare"`) opened from a ghost button.
- A sidebar may use 28px rows: put `mu-compact` on it and every md control and row inside is `control-compact` (28px) tall, the package's (a ghost Select switcher, the "New" Button) and the app's own navigation rows alike. See [A sidebar navigation row](usage.md#a-sidebar-navigation-row). Without it, sidebar rows are md (32px).
- Sidebar navigation rows (pages, views, tags) are `body` text, weight 400, `text-secondary`, and the current row is `text` on the `hover` fill. A sidebar section title ("Tags") is `label-sm` or `label`, 500, and the "New" Button keeps its 500 label. Rows are scanned content; weight is for the few things that name them.
- Content sits in a column of at most `content-width` (720px), padded `space-4` on phones and `space-6` on desktop.
- A page header is a `heading` with an optional `body` line `space-1` under it, and the page's one primary action at the right. `heading` appears once per page.
- Sections inside a page have a `label` title (14px, 500) with `space-6` above it and `space-2` below. Section titles are never larger than the text around them; space and grouping set them apart. A section's rows are horizontal Fields: the name at weight 500 in `text`, the description in `caption` and `text-secondary`, and any entered or selected value at 400. Space separates a section title from its rows; do not lower the rows' label weight. Two blocks of one section (a List and the Form that adds to it) are `space-4` apart.

## Form

- Fields stack `space-4` apart with the label above the control.
- Related checkboxes or switches sit in a `Fieldset`.
- Actions go at the end, right-aligned: a ghost Cancel, then the primary.
- A form that saves at once (settings) uses switches and has no Save button. A form with a Save button uses checkboxes.
- On a settings page, each section is a title and a [List](components/list.md) of horizontal Fields: the setting's name at the start, its Switch or Select at the end. A section of records (tokens, webhooks) is a List, or a `bordered` [Table](components/table.md) when the records have columns.
- Errors appear under the field, in words that say how to fix it.
- A small form on a settings page, among Lists ("Add a tag rule", a reactions picker), is a `bordered` [Form](components/form.md): a title, its fields, and the buttons in a footer bar.

## Settings

- Use horizontal Fields for a setting's name and its Switch or Select. Names stay 500, including when a Checkbox, Switch or Radio is inside `Field.Label`; values and Select options stay 400. Descriptions are `caption`, 400.
- On a settings page, put a section's Fields in one List: names use `text`, descriptions use `text-secondary`. Inside a Dialog, stack Fields without a List and keep the same colors.
- For a compact view-options panel, use a Popover and stack horizontal Fields without a List. The package gives these labels `text-secondary`; current values stay `text`, making the chosen configuration easier to scan. Vertical form labels inside a Popover still use `text`. Do not add per-label font or color overrides.
- A section or panel title stays 500 in `text`. Layout toggles keep their 500 labels in every state. Chosen values and Menu, Select or Combobox options keep 400 in every state; selection uses the component's fill or check.
- Disabled text keeps its weight and uses `text-disabled`. Do not change label colors on hover or while a setting is checked. See [Text roles](typography.md#text-roles).

## Entry

A repeated unit of content in a list: a note, a comment, a changelog item.

- **Header line** in `caption` (`text-secondary`): who or when, visibility as an outline Badge, and a ghost Menu trigger at the right that appears on hover. On touch screens the menu trigger is always visible.
- **Body** in `Prose`.
- **Footer line:** tags as `neutral` [Badge](components/badge.md)s with a `Hash` icon, in `text` (a tag is the user's own word, not metadata); a tag's own color goes in the Badge's `color`. Then attachments and reactions. Prose tags are only for tags inside the body's text.
- The three lines of an entry are `space-2` apart.
- Entries are separated by `space-6` of whitespace or a `Separator`, never by boxes.

## Confirmation

- A destructive action opens an alert Dialog that names the object and the outcome.
- It has a ghost Cancel and a danger Button that repeats the verb ("Delete note").
- On phones it is a sheet with stacked, full-width buttons.
- After the action runs, a neutral Toast confirms it, with Undo where undo is possible.

## Loading

- A list or page that is loading shows Skeletons in the shape of what is coming. The layout must not jump when content arrives.
- A control that is waiting uses its `loading` prop.
- Delay a spinner for 300ms; if the work finishes before then, show no spinner.
- Mark the loading region with `aria-busy`.

## Empty state

Centered in the content column:

- a `title` line that says what is missing ("No notes yet"),
- a `body` line in `text-secondary` that says what to do, `space-1` under the title,
- one primary Button, `space-4` under the text.

The block has `space-8` above and below it, so it reads as a region of its own under the page header. The Button is the page's one primary action: a page that shows an empty state has no second primary in its header.

No illustration.

## Mobile

Under `breakpoint-sm` (640px):

- One column.
- Dialogs become sheets. Menus, Select and Combobox lists stay anchored to their triggers and keep their documented row heights.
- Toasts span the top of the screen.
- Every control keeps the same size, text and hit boundaries as on a wider screen; input capabilities do not change geometry.
- Choose control sizes by context, as on wider screens; a narrow viewport does not promote smaller controls to `md`.
