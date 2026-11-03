# Using the components

How to pick the right component for a screen and put components together. Read it before building or migrating a screen in an app. Each component's own page has its props and rules; this page decides between them.

## Before you build a screen

1. Find the [pattern](patterns.md) the screen follows: page, form, entry, confirmation, loading, empty state, mobile. Follow it before choosing components.
2. Pick each component with the guides below. When two seem to fit, the first row that matches wins.
3. Import components from `@usememos/ui` and icons from `lucide-react`. Don't wrap a component to restyle it.
4. Use `className` and `style` for layout only: width, margin, grid or flex placement. Don't change a component's color, height, padding, radius, shadow, font size or focus style. If the look is wrong, the component or its page is wrong; change the package, not the screen.
5. A part the package doesn't ship is built with [Building your own component](custom-components.md), never by copying a component's CSS.

## Picking something that floats

The most common mistake is reaching for the wrong overlay. Decide by what the floating thing holds and how it closes.

| Component | Holds | Opens on | Closes when | Blocks the page | Use it for |
| --- | --- | --- | --- | --- | --- |
| [Tooltip](components/tooltip.md) | Two or three words of text, and a shortcut | Hover or keyboard focus | The pointer or focus leaves | No | Naming an icon-only control |
| [Menu](components/menu.md) | A list of commands | Click on its trigger | One command is picked, Escape, a click outside | No | Actions on one thing: "Pin", "Copy link", "Delete" |
| [Select](components/select.md), [Combobox](components/combobox.md) | A list of values | Click or typing | One value is picked | No | Choosing a value that a form or setting keeps |
| [Popover](components/popover.md) | Any small content: text, a few controls | Click on its trigger | Escape, a click outside, or its own Close | No | A share panel, a link editor, a filter panel, an explanation |
| [Dialog](components/dialog.md) | A short form or a decision | An action | Its buttons, Escape, a backdrop click | Yes | Creating something, editing settings of one thing |
| [AlertDialog](components/dialog.md) | A question and two buttons | An action | Only its buttons | Yes | Confirming a destructive or irreversible action |
| [Drawer](components/drawer.md) | Navigation, or the details of one thing | A ghost button | Escape, a backdrop click, a swipe toward its edge, or a link inside | Yes | The sidebar on a phone; details beside a list |
| [Toast](components/toast.md) | A sentence about what happened, at most one action | The app, after something happened | A timeout, its X, or its action | No | "Note archived" with Undo; "Couldn't sync" |

### Menu or Popover

- **Menu: picking an item runs a command and closes the menu.** Items are verbs. Arrow keys move between items; typing jumps to one. Nothing inside a Menu takes text or holds focus.
- **Popover: the content stays open while people use it.** It can hold text, inputs, buttons, a list of toggles. People tab through it like a small page.
- An input, a checkbox list with an Apply button, or explanatory text inside a Menu means it should be a Popover.
- A Popover whose content is only a list of actions should be a Menu.
- A Menu may hold `Menu.CheckboxItem`s and `Menu.RadioItem`s for view options ("Show archived", "Sort by"). They stay open on click. Use them only for options of the view the menu belongs to, not for form values.

### Menu or Select

- **Menu runs commands; Select keeps a value.** A Select's trigger shows the chosen value, it sits in a [Field](components/field.md) with a label, and its value is submitted with a form.
- A "Sort by" control in a toolbar that changes a view is a Menu with a `Menu.RadioGroup`, or a [ToggleGroup](components/toggle-group.md) when the options fit in a row.
- A "Visibility" field in a form is a Select.

### Popover, Dialog or a page

- **Popover**: one to three controls about the thing next to it, changes that apply as they are made or are trivial to undo.
- **Dialog**: more than three controls, a Save or Create button, or a decision that must be made before going on.
- **A page**: more than about six fields, sections, or content people need to link to.
- Don't open a Dialog from a Dialog. Replace the content, or close the first one. The one exception is an AlertDialog that confirms discarding the first one's input.

### Tooltip or Popover

- **Tooltip**: a label for a control. It has no interactive content and never opens on touch screens, so it must never be the only place a fact appears.
- **Popover**: anything people need to read, anything with a link or a button, or anything that must work on touch. For a hover card ("show the person on hover"), use a Popover with `openOnHover` on its trigger, and make sure a click shows the same thing.

### Dialog or AlertDialog

- **AlertDialog** for "Are you sure?": deleting, discarding unsaved input, revoking a token. It has no X and ignores the backdrop, so people must answer.
- **Dialog** for everything else. A Dialog with a form keeps itself open while it has unsaved input (see [Recipes](#form-in-a-dialog)).
- Don't confirm actions that can be undone. Run them and show a Toast with Undo instead.

### Toast or an inline message

- **Toast**: the result of an action people just took, when the screen doesn't already show it. "Note archived" (the note disappeared), "Link copied" (nothing else changed).
- **Inline**: anything tied to a place on the screen. A field's error goes in `Field.Error` under the field. A page that fails to load says so in the page, with a Retry button.
- Don't toast what the screen already shows. A saved setting whose Switch moved needs no toast.
- A toast never asks a question. A decision is an AlertDialog.

## Picking a control

### Starting an action or going somewhere

| Need | Use | Not |
| --- | --- | --- |
| Run an action | [Button](components/button.md) | A Link with an `onClick` |
| Go to another page | [Link](components/link.md) | A Button with `navigate()` in `onClick` |
| Go to another page, styled as an action ("Get started") | An `<a>` (or router link) with `buttonClasses()` | `Button` with `render={<a />}` |
| Several actions on one thing | A ghost Button that opens a [Menu](components/menu.md) | A row of icon buttons for rare actions |
| Turn one option on or off in a toolbar | [Toggle](components/toggle.md) | A Button that changes its own label |

### Choosing a value

Answer in order; the first yes decides.

1. **Does it save the moment it changes (a settings page)?** On or off: [Switch](components/switch.md). One of a few: [Select](components/select.md) that saves in `onValueChange`.
2. **Is it on or off, saved with a form?** [Checkbox](components/checkbox.md).
3. **Is it one of 2 or 3 options, with room to show them or each needing a description?** [RadioGroup](components/radio-group.md).
4. **Is it one of up to about 10 options?** [Select](components/select.md).
5. **Is it one of a long list, or do people know what they're looking for and type it?** [Combobox](components/combobox.md).
6. **Is it several of a few options?** Checkboxes in a [Fieldset](components/field.md).
7. **Is it a view or filter on the current page, not a stored value?** One choice: [ToggleGroup](components/toggle-group.md) without `multiple`. Stacking filters: [Toggle](components/toggle.md)s, or a ToggleGroup with `multiple`.
8. **Is it text?** One line: [Input](components/input.md). A few plain lines: [Textarea](components/textarea.md). Formatted content: the editor (`@usememos/editor`) with [Prose](components/prose.md).
9. **Is it a number?** An Input with `type="number"` and `inputMode="numeric"`, or a Select of the sensible values. There is no Slider or Stepper.

### Grouping and moving between sections

| Need | Use | Not |
| --- | --- | --- |
| Sections of one page (Account, Notifications) | [Tabs](components/tabs.md) | ToggleGroup |
| A view or filter of the same content (All, Pinned, Archived) | [ToggleGroup](components/toggle-group.md) without `multiple` | Tabs |
| Navigation between pages | [Link](components/link.md)s in the app's sidebar | Tabs |
| Details or advanced settings people rarely need | [Collapsible](components/collapsible.md) | A Dialog |
| Several sections, one open at a time | Collapsibles, controlled together | A third-party accordion |
| Separating groups of content | `space-6` of whitespace, then a section title, then a [Separator](components/separator.md) if still unclear | A box, border or card |
| Data with columns (tokens, users, webhooks) | [Table](components/table.md), `bordered` when it is one section among others | A List with columns faked in each row |
| Settings rows, or a few records with an action each | [List](components/list.md) | Separate boxes for each row |
| A list of content (notes, comments) | [Entries](patterns.md#entry) | A Table |

## Picking feedback

| Situation | Use |
| --- | --- |
| A button's action is waiting on a server | The Button's `loading`, with `loadingLabel` ("Saving") |
| A list or page is loading | [Skeleton](components/skeleton.md)s in the shape of the content, and `aria-busy` on the region |
| Something short is running with no control to put it in | [Spinner](components/spinner.md) with a `label` |
| An action finished and the screen doesn't show it | [Toast](components/toast.md), neutral or `success` |
| An action failed | Toast with `type: "danger"` and `timeout: 0`; a field's own error in `Field.Error` instead |
| A field's value is wrong | `invalid` on `Field.Root` and a `Field.Error` that says how to fix it |
| A thing has a status (Synced, Expired) | [Badge](components/badge.md) with a tone and a word |
| A list is empty | The [empty state](patterns.md#empty-state) pattern |
| An action is about to destroy something | [AlertDialog](components/dialog.md), then a Toast after it runs |

Waits under about 300ms show nothing. Status colors (`success`, `warning`, `danger`) appear only with words or an icon, never as the only signal.

## Recipes

### Trigger through `render`

Every `Trigger` and `Close` renders the element given in `render`. Pass the Button there; don't put it inside.

```tsx
// Do: one <button>
<Menu.Trigger render={<Button variant="ghost" icon={<Ellipsis />} aria-label="More actions" />} />

// Don't: a <button> inside a <button>
<Menu.Trigger><Button variant="ghost" icon={<Ellipsis />} aria-label="More actions" /></Menu.Trigger>
```

### An icon-only button with a tooltip and a menu

Stack the triggers with `render`. One `<button>` gets both behaviors.

```tsx
<Menu.Root>
  <Tooltip.Root>
    <Tooltip.Trigger
      render={<Menu.Trigger render={<Button variant="ghost" icon={<Ellipsis />} aria-label="More actions" />} />}
    />
    <Tooltip.Popup>More actions</Tooltip.Popup>
  </Tooltip.Root>
  <Menu.Popup align="end">…</Menu.Popup>
</Menu.Root>
```

The same works for a Dialog or Popover trigger: `<Tooltip.Trigger render={<Popover.Trigger render={<Button … />} />} />`.

### A menu item that opens a dialog

Keep the Dialog outside the Menu and control it with `open`. The Menu closes when the item is picked, so a Dialog inside `Menu.Popup` would unmount with it.

```tsx
const [confirming, setConfirming] = useState(false);

<Menu.Root>
  <Menu.Trigger render={<Button variant="ghost" icon={<Ellipsis />} aria-label="More actions" />} />
  <Menu.Popup align="end">
    <Menu.Item icon={<Pin />} onClick={pin}>Pin</Menu.Item>
    <Menu.Separator />
    <Menu.Item icon={<Trash2 />} danger onClick={() => setConfirming(true)}>Delete</Menu.Item>
  </Menu.Popup>
</Menu.Root>

<AlertDialog.Root open={confirming} onOpenChange={setConfirming}>
  <AlertDialog.Popup>
    <AlertDialog.Title>Delete this note?</AlertDialog.Title>
    <AlertDialog.Description>It moves to the trash for 30 days.</AlertDialog.Description>
    <AlertDialog.Footer>
      <AlertDialog.Close render={<Button variant="ghost">Cancel</Button>} />
      <Button variant="danger" loading={deleting} loadingLabel="Deleting" onClick={remove}>Delete note</Button>
    </AlertDialog.Footer>
  </AlertDialog.Popup>
</AlertDialog.Root>
```

`remove` closes the dialog with `setConfirming(false)` once the server answers, then shows a Toast. Use `AlertDialog.Close render={<Button variant="danger" />}` only when the action can't fail.

### Form in a dialog

```tsx
<Dialog.Root
  open={open}
  onOpenChange={(next) => {
    if (!next && dirty) return; // keep unsaved input; Cancel resets and closes
    setOpen(next);
  }}
>
  <Dialog.Trigger render={<Button>Create access token</Button>} />
  <Dialog.Popup>
    <Dialog.Title>Create access token</Dialog.Title>
    <Dialog.Description>Use it to call the API from scripts.</Dialog.Description>
    <form id="create-token" onSubmit={create}>
      <Field.Root invalid={!!error}>
        <Field.Label>Description</Field.Label>
        <Input value={description} onValueChange={setDescription} />
        <Field.Error match>{error}</Field.Error>
      </Field.Root>
    </form>
    <Dialog.Footer>
      <Button variant="ghost" onClick={cancel}>Cancel</Button>
      <Button variant="primary" type="submit" form="create-token" loading={saving} loadingLabel="Creating">Create</Button>
    </Dialog.Footer>
  </Dialog.Popup>
</Dialog.Root>
```

- One Field per control. The submit button is `primary`, named with its verb, and shows `loading`.
- On a server error, keep the dialog open and show the error on the field it belongs to. Close it only on success.
- On phones the dialog becomes a sheet by itself. Don't build a separate mobile layout.

### Settings that save at once

```tsx
<h2 className="mu-label" id="notifications">Notifications</h2>
<List.Root aria-labelledby="notifications">
  <List.Item>
    <Field.Root orientation="horizontal">
      <Field.Label>Email me when I'm mentioned</Field.Label>
      <Field.Description>Sent at most once an hour.</Field.Description>
      <Switch checked={mentions} onCheckedChange={saveMentions} />
    </Field.Root>
  </List.Item>
  <List.Item>…</List.Item>
</List.Root>
```

A horizontal Field puts the setting's name first, at weight 400, and the Switch or Select at the end of the row. The section title above it is the `label` (500). A [List](components/list.md) boxes the rows of one section and divides them with lines. Inside a Dialog, leave out the List and stack the Fields. For a short list of options under one heading (notification types), a Switch or Checkbox inside its `Field.Label` also works.

No Save button and no toast: the Switch shows the result. If saving fails, move the Switch back and show a danger Toast.

### A toolbar

```tsx
<Tooltip.Provider>
  <ToggleGroup multiple size="sm" value={marks} onValueChange={setMarks} aria-label="Formatting">
    <Tooltip.Root>
      <Tooltip.Trigger render={<Toggle value="bold" icon={<Bold />} aria-label="Bold" />} />
      <Tooltip.Popup shortcut="⌘ B">Bold</Tooltip.Popup>
    </Tooltip.Root>
    …
    <Separator orientation="vertical" />
    …
  </ToggleGroup>
</Tooltip.Provider>
```

One `Tooltip.Provider` around the toolbar (or the app) so moving along it opens the next tooltip at once.

### Row and entry actions

- Put rare actions in a ghost "More actions" Menu trigger at the end of the row. Name it for the row: `aria-label={`Actions for ${token.name}`}`.
- Show one or two frequent actions as xs or sm ghost Buttons beside it, each with a Tooltip.
- On an entry the trigger appears on hover; on touch screens it is always visible (see [Entry](patterns.md#entry)).

### A sidebar navigation row

The package ships no navigation component: the sidebar's rows are the app's links. For 28px rows, put `mu-compact` on the sidebar: every md control and row inside it is `control-compact` (28px) tall instead of 32px, with md text, icons, padding and radius. The app's own rows read the row variables, so they match the package's controls beside them:

```tsx
<aside className="app-sidebar mu-compact">
  <Select.Root value={space} onValueChange={setSpace}>
    <Select.Trigger variant="ghost">…</Select.Trigger>
    …
  </Select.Root>
  <Button variant="primary" icon={<Plus />}>New note</Button>
  <nav className="app-nav mu-s-md mu-base" aria-label="Main">
    <a className="app-nav-row mu-focus" href="/" aria-current={path === "/" ? "page" : undefined}>
      <House className="mu-icon" aria-hidden />
      Home
    </a>
    …
  </nav>
</aside>
```

```css
.app-nav { display: grid; gap: var(--mu-inset); }
.app-nav-row {
  display: flex;
  align-items: center;
  gap: var(--mu-row-gap);
  height: var(--mu-row-height); /* 28px inside mu-compact, 32px without */
  padding: 0 var(--mu-row-padding-icon);
  border-radius: var(--mu-row-radius);
  color: var(--mu-ink-muted);
  font-weight: 400; /* mu-base sets 500, for control labels */
  text-decoration: none;
}
.app-nav-row:hover, .app-nav-row[aria-current="page"] { color: var(--mu-ink); background-color: var(--mu-hover); }
```

- `mu-compact` changes only md. sm (24px) and xs (20px) controls inside keep their heights, so an xs ghost Button for a row action still fits.
- Popups opened from the sidebar (the Select's list, a Menu) mount outside it, at the normal 32px. To give a panel of rows the same 28px, put `mu-compact` on its popup: `<Popover.Popup variant="list" className="mu-compact">`.
- `mu-s-md` gives the rows 14px text, 16px icons with a 1.25px stroke, and md padding and radius; `mu-base` sets the font. Never set the `--mu-row-*` variables or the size tokens yourself; `mu-compact` is the only way to change a row's height.
- Rows are weight 400 (`body`), like Menu items, Select items and settings row names. A column of rows is content people scan; at 500 every row competes and the sidebar reads as bold. 500 is for what names a group: a section title in the sidebar and the "New" Button's label. The current row stands out by its fill and `ink` color, not by weight, so the text doesn't shift when the current page changes.
- Mark the current page with `aria-current="page"`, not with color alone; the fill shows it too.
- Rows stack `inset` (2px) apart. Don't add `mu-hit` to stacked rows: their 44px touch areas would overlap. 28px is above the 24px minimum target size.
- A row with a count or a menu at its end adds it after the label with `margin-inline-start: auto`.

### Buttons over a photo

Controls over an image or a video sit in a dark-theme scope, so they read on any picture in both app themes:

```tsx
<figure className="app-viewer">
  <img src={src} alt={alt} />
  <div className="app-viewer-controls" data-theme="dark">
    <Button icon={<X />} aria-label="Close" onClick={close} />
    <Button icon={<ChevronLeft />} aria-label="Previous image" onClick={previous} />
    <Button icon={<ChevronRight />} aria-label="Next image" onClick={next} />
  </div>
</figure>
```

- `data-theme="dark"` on any element sets the Dark tokens for everything inside it, so the Buttons are dark `neutral` keys with light icons. Don't use `ghost` there: it has no fill and disappears on a busy picture.
- When the scope holds only Buttons, leave its own background transparent: the keys carry their own fill and shadow. Text in the scope, such as a counter or a file name, has no fill of its own and needs the pill in [Text over a photo](#text-over-a-photo).
- A full-screen viewer is a Dialog with `variant="bare" fullScreen`; put the scope inside its Popup.

### Text over a photo

Plain text over a picture, such as a viewer's "3 / 12" counter or its zoom level, has no fill of its own, so it needs one. Put it in the same dark-theme scope and give the text a `surface` pill:

```tsx
<div className="app-viewer-controls" data-theme="dark">
  <span className="app-viewer-label mu-label-sm" aria-live="polite">{index + 1} / {count}</span>
  <Button icon={<ZoomIn />} aria-label="Zoom in" onClick={zoomIn} />
</div>
```

```css
.app-viewer-label {
  display: inline-flex;
  align-items: center;
  height: var(--mu-control-md);
  padding: 0 var(--mu-space-3);
  border-radius: var(--mu-radius-md);
  color: var(--mu-ink);
  background-color: var(--mu-surface);
  box-shadow: var(--mu-shadow-pop);
  font-variant-numeric: tabular-nums;
}
```

- The pill is opaque, as tall as the Buttons beside it, with their radius. Dark `surface` with `ink` text keeps 4.5:1 on any picture.
- No blur and no translucent fill: glass behind text is not in the system (see [Depth](depth.md)), and it fails contrast on bright pictures.
- Several labels and Buttons in one row can share one pill instead: put the `surface`, radius, padding and shadow on the scope, and the Buttons become `ghost` inside it, since the pill is their fill.

### Inside a shadow root or a host page

In an extension or an embed, pass the same `container` to every `Popup` and to `Toast.Viewport`, so popups mount inside the shadow root and pick up its styles. See [Scoping inside a host page](building.md#scoping-inside-a-host-page).

```tsx
<Menu.Popup container={shadowRoot}>…</Menu.Popup>
<Toast.Viewport container={shadowRoot} />
```

## Size

- **Set `size` once, on the outermost part that takes it.** `Menu.Root`, `Select.Root`, `Combobox.Root`, `Tabs.Root`, `Collapsible.Root`, `Table.Root`, `Field.Root`, `Fieldset.Root`, `RadioGroup` and `ToggleGroup` pass their size to every part and every Button, Toggle, Checkbox or Input inside them. Don't repeat it on the parts.
- **Pick by place, not by importance.** `md` everywhere by default, including dialogs, forms, onboarding, marketing pages and an app's sidebar. A sidebar with 28px rows puts `mu-compact` on itself, which makes md 28px inside it; see [A sidebar navigation row](#a-sidebar-navigation-row). `sm` for dense toolbars, table rows and filters inside panels. `xs` for secondary actions beside 13px text (entry footers, row actions). See [Control sizes](layout.md#control-sizes).
- **Never make a control bigger to make it stronger.** Emphasis is the `primary` variant.
- **Don't mix sizes in one row.** A Button beside an Input has the Input's size.
- **Dialogs and Popovers start at md.** Their panels are md wherever they are declared, so a Dialog inside a `Table.Root size="sm"` still has md Buttons and fields. Set `size` inside the panel only for a part that should differ.
- **Menus follow their surroundings.** A Menu, Select or Combobox without its own `size` takes the size of the Root around it, so a menu opened from a sm toolbar has sm rows.
- Text entry, menus, tabs and tables have no `xs`; an inherited `xs` renders them at `sm`.

## Emphasis and color

- **One `primary` Button per view.** A view is a page, a dialog or a popover. Everything else is `neutral`, or `ghost` in toolbars and rows.
- **`danger` confirms; it never starts.** The first click on "Delete" is a Menu item with `danger` or a neutral Button; the `danger` Button lives in the AlertDialog that follows.
- **Dialog footers** are a ghost Cancel, then the action, named with its verb ("Delete note", "Create"), never "OK" or "Yes".
- **Tone is status only.** Badge and Toast tones say success, warning or danger. Don't use them to highlight, decorate or color-code categories. The one exception is Badge `tone="primary"`: ink, for the single label in a view that should stand out, such as New.
- **Links are the only blue.** Don't color text, icons or backgrounds with `accent`.

## Accessibility checklist

Run through it for every screen.

- [ ] Every control has a name: a `Field.Label`, a visible label, or `aria-label`. Placeholders are never names.
- [ ] Every icon-only Button and Toggle has an `aria-label` and a Tooltip with the same text.
- [ ] Every group has a name: `aria-label` on a ToggleGroup and a `Tabs.List`; a `Fieldset.Legend`; a `Table.Caption` or `aria-label` on a Table; a `Popover.Title` or `aria-label`; a `Dialog.Title`.
- [ ] Checkboxes, Switches and Radios sit inside their `Field.Label`, so the text is clickable.
- [ ] Repeated triggers are named for their row ("Actions for Backup token"), not just "More actions".
- [ ] No fact appears only in a Tooltip, only in color, or only in a placeholder.
- [ ] Loading regions have `aria-busy`; loading Buttons have a `loadingLabel`.
- [ ] Errors are in `Field.Error` or a danger Toast with `timeout: 0`, worded as how to fix them.
- [ ] No `outline: none`, custom focus ring or `tabIndex` on a component. Focus, keyboard and ARIA come from Base UI; don't add key handlers that fight them.
- [ ] Nothing pressable is built from a `<div>`. If the package has no component for it, build it on Base UI ([Building your own component](custom-components.md)).

## Common mistakes

| Don't | Do |
| --- | --- |
| An Input or checkbox list inside a Menu | A Popover |
| A Popover holding only a list of actions | A Menu |
| A Menu to choose a form value | A Select in a Field |
| A Dialog for one or two quick controls | A Popover |
| A Dialog for "Are you sure?" | An AlertDialog |
| A confirmation for an action that can be undone | Run it, then a Toast with Undo |
| A Tooltip with a link, a button or a paragraph | A Popover |
| A Tooltip on text that isn't a control | Visible text, or a Popover |
| A Toast for a field's error | `Field.Error` under the field |
| A success Toast after every Switch | Nothing; the Switch shows it |
| A Button that navigates | A Link, or an anchor with `buttonClasses()` |
| `<Button render={<a href="…" />}>` | `<a className={buttonClasses()} href="…">` |
| A Button nested inside a `Trigger` | `render={<Button … />}` on the Trigger |
| A clickable Badge | A Toggle (filters) or a Link with `badgeClasses()` (tag pages) |
| Tabs to filter a list | A ToggleGroup without `multiple` |
| A ToggleGroup to switch page sections | Tabs |
| A Switch in a form with a Save button | A Checkbox |
| A Checkbox that saves at once | A Switch |
| A Select with 30 options | A Combobox |
| A Select with two options and room to spare | A RadioGroup |
| A boxed card around each item | Whitespace, a section title, or a Separator. Rows of settings or records go in one [List](components/list.md); a small form among them in a `bordered` [Form](components/form.md) |
| An icon after a Button's label inside `children` | `iconEnd` |
| A `<button>` with its own classes as a row in a Popover | `menuClasses().item`, in a Popover with `variant="list"` |
| A Dialog with `className` that removes its padding and X | `variant="bare"` |
| A local box (a "settings panel") around a small form on a settings page | `Form.Root bordered` with `Form.Footer` |
| A Dialog with `fixed inset-0 rounded-none` | `variant="bare" fullScreen` |
| A lighter or clear backdrop for one Dialog, such as a search palette | The standard backdrop: every Dialog dims the page the same way |
| A blue or custom-colored New badge | `tone="primary"` |
| A wrapper with negative margins around two Buttons in a table cell | `Table.Actions` |
| A button with negative margins to make a List row clickable | `List.ItemButton` |
| `w-full` on a ToggleGroup and `flex-1` on its Toggles | `fullWidth` |
| `h-dvh`, a `border-e` or your own Close on a bare Drawer's content | Nothing: bare does these; give your content `height: 100%` |
| A 28px row class, or `--mu-row-height` set by hand | `mu-compact` on the sidebar or popup |
| `mu-base` (weight 500) alone on sidebar navigation rows | `font-weight: 400` on the rows: they are `body` text, like Menu items |
| A tag chip of your own in an entry's footer, or a Prose tag there | A `neutral` Badge with a `Hash` icon, in ink |
| A tag in the user's color as text, or on a fill you mixed yourself | `<Badge color={tag.color}>`: a tint, with ink text |
| Text over a photo on a translucent, blurred fill | An opaque `surface` pill in a `data-theme="dark"` scope |
| Tailwind `size-4` on a standalone icon | `mu-icon-sm` or `mu-icon-md`, which set the stroke too |
| A Spinner where a list will appear | Skeletons in the shape of the list |
| `size="md"` or `"lg"` on a Button to emphasize it | `variant="primary"` at the row's size |
| `size` on every part of a Menu or Select | `size` on its Root |
| Two `primary` Buttons in one view | One `primary`, the rest `neutral` |
| `danger` Button as the first click | A `danger` Menu item, then an AlertDialog |
| A placeholder as the only label | `Field.Label`, or `aria-label` |
| Color as the only signal of status | A Badge or Toast with a word and an icon |
| `className` that changes a component's color, height or radius | Use the component as it is, or change the package |
| Copying a component's CSS to make a lookalike | Base UI with a class function or public classes |
| A `<div onClick>` as a control | A component, or Base UI's part with a class function |

## Migrating from another UI kit

Names and parts from other libraries and where they go.

| Other kits | Memos UI |
| --- | --- |
| Modal, Dialog | [Dialog](components/dialog.md); `sheet` covers phones |
| ConfirmDialog, AlertDialog, `window.confirm` | [AlertDialog](components/dialog.md) |
| Drawer, Sheet | [Drawer](components/drawer.md) from an edge; a Dialog already becomes a bottom sheet below 640px |
| Command palette, Spotlight | Dialog with `variant="bare"` around an inline [Combobox](components/combobox.md) |
| Lightbox, image viewer | Dialog with `variant="bare"`, its controls as neutral Buttons in a `data-theme="dark"` scope ([recipe](#buttons-over-a-photo)) |
| List group, settings card, DataList | [List](components/list.md) |
| Emoji or icon picker | Combobox with `inline` and `grid` |
| DropdownMenu, ActionMenu | [Menu](components/menu.md) |
| ContextMenu | Not built. Put the same actions in a Menu on a visible trigger |
| HoverCard | [Popover](components/popover.md) with `openOnHover` on the trigger |
| Tooltip with a `title` or `content` prop | [Tooltip](components/tooltip.md) parts: Root, Trigger, Popup |
| Snackbar, Toaster, sonner's `toast()` | [Toast](components/toast.md) and `Toast.useToastManager().add()` |
| Toast `variant="destructive"` | `type: "danger"` |
| Card, Paper, Panel | No component: spacing, a section title and [Separator](components/separator.md). For a boxed group of rows, [List](components/list.md); for a boxed small form, a `bordered` [Form](components/form.md) |
| Form (Base UI, React Hook Form wrappers) | [Form](components/form.md), with [Field](components/field.md)s inside |
| Divider | [Separator](components/separator.md) |
| Chip, Tag | [Badge](components/badge.md) to show, [Toggle](components/toggle.md) to filter |
| SegmentedControl, RadioButtons in a row | [ToggleGroup](components/toggle-group.md) without `multiple` |
| Accordion | [Collapsible](components/collapsible.md)s |
| Slider, NumberInput, Stepper | Input `type="number"` or a Select |
| Autocomplete, SearchSelect | [Combobox](components/combobox.md) |
| NativeSelect, `<select>` | [Select](components/select.md) |
| Label, FormLabel | `Field.Label` |
| FormMessage, HelperText | `Field.Error`, `Field.Description` |
| FormItem, FormControl | `Field.Root` |
| Loader, CircularProgress | [Spinner](components/spinner.md), or a control's `loading` |
| Progress bar | Not built. Use Skeletons for loading, or text ("3 of 10") |
| Typography, Text, Heading | The type classes (`mu-body`, `mu-caption`, `mu-heading`) from [Typography](typography.md) |
| Markdown or rich-text body | [Prose](components/prose.md) |
| `variant="secondary"`, `"outline"` on a button | `neutral`; `ghost` in toolbars |
| `variant="destructive"` on a button | `danger`, only inside a confirmation |
| `size="lg"` | `md`; emphasis comes from `primary` |
| `options={[…]}`, `items={[…]}` data props | Parts: `Select.Item`, `Menu.Item`, `Tabs.Tab`. Select and Combobox still take `items` on the Root for labels and filtering |
| `asChild` | `render={<… />}` |
