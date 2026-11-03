# List

A boxed list of rows: settings, or records such as webhooks, sessions or linked accounts.

## Example

```tsx
import { Field, List, Switch } from "@usememos/ui";

<h2 className="mu-label" id="preferences">Preferences</h2>
<List.Root aria-labelledby="preferences">
  <List.Item>
    <Field.Root orientation="horizontal">
      <Field.Label>Compact mode</Field.Label>
      <Field.Description>Show more notes on one screen.</Field.Description>
      <Switch checked={compact} onCheckedChange={saveCompact} />
    </Field.Root>
  </List.Item>
  <List.Item>
    <Field.Root orientation="horizontal">
      <Field.Label>Show pinned first</Field.Label>
      <Switch checked={pinnedFirst} onCheckedChange={savePinnedFirst} />
    </Field.Root>
  </List.Item>
</List.Root>
```

## Parts

No Base UI part: these are styled native list elements.

| Part | Renders |
| --- | --- |
| `List.Root` | A `<ul>` with a `line` edge and rounded corners. Takes `size` |
| `List.Item` | An `<li>`: one row, divided from the next by a `line` |

## Props

```ts
interface List.RootProps extends React.ComponentProps<"ul"> {
  size?: "sm" | "md"; // sm for dense lists; also the size of the controls inside
}
```

Every native attribute passes through.

## Rules

- Use it for settings rows and for short lists of records with an action or two each. Data with several columns goes in a [Table](table.md); content people read (notes, comments) goes in [entries](../patterns.md#entry), never in a List.
- A settings row is a horizontal [Field](field.md) inside the Item. A record row lays out its own content: the record's text first, its actions at the end (a ghost [Menu](menu.md) trigger named for the row, or one or two Buttons).
- Name the list: `aria-labelledby` pointing at the section title above it, or `aria-label`.
- Don't nest Lists, and don't put a List inside a Dialog or Popover: those are boxes already. Use horizontal Fields stacked `space-4` apart there.
- Rows are not links or buttons. To open a record, put a Link or a Button in the row.
- An empty list shows the [empty state](../patterns.md#empty-state) in place of the List.

## Style

- `surface` fill, a 1px `line` edge, `radius-lg`. No shadow: it is flat, like a field.
- Rows pad `space-3` × `space-4` at md and `space-2` × `space-3` at sm, divided by a 1px `line`. No hover: rows don't act on click.
- Text is `body` in `ink`.
