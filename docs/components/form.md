# Form

A `<form>` with a title, its fields and its buttons. `bordered` boxes a small form among the [Lists](list.md) of a settings page.

## Example

```tsx
import { Button, Field, Form, Input, Switch } from "@usememos/ui";

<Form.Root bordered onSubmit={addRule}>
  <Form.Title>Add a tag rule</Form.Title>
  <Form.Description>Tag new notes that match a word.</Form.Description>
  <Field.Root name="tag">
    <Field.Label>Tag</Field.Label>
    <Input required />
  </Field.Root>
  <Field.Root orientation="horizontal">
    <Field.Label>Apply to existing notes</Field.Label>
    <Switch name="existing" />
  </Field.Root>
  <Form.Footer>
    <Button variant="ghost" onClick={cancel}>Cancel</Button>
    <Button variant="primary" type="submit">Add rule</Button>
  </Form.Footer>
</Form.Root>
```

## Parts

| Part | Base UI part | Renders |
| --- | --- | --- |
| `Form.Root` | `Form` | A `<form>`. Takes `bordered`. Named by its Title |
| `Form.Title` | none (ours) | An `<h2>` in `label` style. Takes `render` for another heading level |
| `Form.Description` | none (ours) | A `<p>` under the title |
| `Form.Footer` | none (ours) | A `<div>` that right-aligns the buttons |

## Props

```ts
interface Form.RootProps extends BaseForm.Props {
  bordered?: boolean; // a List's edge around the form, and the Footer as a canvas bar
}
interface Form.TitleProps extends React.ComponentProps<"h2"> {
  render?: React.ReactElement; // such as <h3 /> under a page section
}
```

Base UI's props pass through: `onFormSubmit`, `errors`, `validationMode` and `actionsRef`, as do the native `<form>` attributes (`onSubmit`, `action`).

## Rules

- Set `bordered` for a small form (a heading, two to four fields and its buttons) on a settings page, next to [Lists](list.md) or a `bordered` [Table](table.md), such as "Add a tag rule" under the rules it adds to. Leave it off for a form that is the page's main content.
- Never put a bordered Form inside a Dialog, Popover or Drawer: those are boxes already. A form in a Dialog uses the Dialog's own Title and Footer; see [Form in a dialog](../usage.md#form-in-a-dialog).
- Don't box single settings: a setting that saves at once is a horizontal [Field](field.md) in a List.
- Footer: a ghost Cancel, then one `primary` Button with `type="submit"` named with its verb ("Add rule", never "OK" or "Submit").
- Give each Field a `name`; errors from the server go in `errors`, keyed by name, and appear under their fields.
- Name it with a Title, or `aria-label` on the root when there is no visible heading.

## Style

- Children stack `space-4` apart. Title: `label` (14px, 500); Description: `caption` in `ink-muted`, `space-1` under the title. Footer: buttons `space-2` apart at the end.
- `bordered`: `surface` fill, a 1px `line` edge, `radius-lg`, `space-4` padding, no shadow, as a List. The Footer runs to the edges as a `canvas` bar under a `line`, padded `space-3` × `space-4`, rounded with the box at the bottom.
- The form is always md: controls inside it ignore the size of a parent Root.
