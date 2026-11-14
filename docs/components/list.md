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
| `List.ItemButton` | A `<button>` that fills its Item, for a row that acts as a whole. Takes `render` for a link |

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
- When the whole row opens something (a space, a record's page), put one `List.ItemButton` in the Item and the row's content inside it. For a link, `render={<a href="…" />}` or the router's link. Don't give a button negative margins to fill the row yourself.
- A row with an ItemButton has no other controls: buttons don't nest. A row with its own actions (a Menu trigger, a Switch) keeps them in the Item and opens the record from a Link in its text.

  ```tsx
  <List.Root aria-label="Spaces">
    {spaces.map((space) => (
      <List.Item key={space.id}>
        <List.ItemButton render={<a href={`/s/${space.id}`} />}>
          {space.name}
        </List.ItemButton>
      </List.Item>
    ))}
  </List.Root>
  ```
- An empty list shows the [empty state](../patterns.md#empty-state) in place of the List.

## Style

- `surface` fill, a 1px `line` edge, `radius-lg`. No shadow: it is flat, like a field.
- Rows pad `space-3` × `space-4` at md and `space-2` × `space-3` at sm, divided by a 1px `line`. No hover on a plain row. An ItemButton fills its row, padded as the row is, lays out its children in a row `space-3` apart, highlights immediately with `hover` on pointer hover or touch press, and rounds with the box at the first and last row; keyboard focus darkens the row's reserved border.
- Record text is `body` in `text`. Settings rows follow [Field](field.md): the name is 500 in `text`, values are 400, and descriptions are `caption` in `text-secondary`.
