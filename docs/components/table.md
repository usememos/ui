# Table

Lists things with the same attributes, such as tokens, users or webhooks.

## Example

```tsx
import { Button, Menu, Table } from "@usememos/ui";
import { Ellipsis } from "lucide-react";

<Table.Root>
  <Table.Caption>Access tokens</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head>Name</Table.Head>
      <Table.Head>Created</Table.Head>
      <Table.Head num>Uses</Table.Head>
      <Table.Head><span className="mu-visually-hidden">Actions</span></Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {tokens.map((token) => (
      <Table.Row key={token.id}>
        <Table.Cell>{token.name}</Table.Cell>
        <Table.Cell muted>{token.created}</Table.Cell>
        <Table.Cell num>{token.uses}</Table.Cell>
        <Table.Cell num>
          <Menu.Root>
            <Menu.Trigger render={<Button variant="ghost" icon={<Ellipsis />} aria-label={`Actions for ${token.name}`} />} />
            <Menu.Popup align="end">…</Menu.Popup>
          </Menu.Root>
        </Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table.Root>
```

## Parts

No Base UI part: these are styled native table elements.

| Part | Renders |
| --- | --- |
| `Table.Root` | A `<table>` inside a `<div>` that scrolls sideways when the table is too wide. Takes `size` and `bordered`. The ref and props go to the `<table>` |
| `Table.Caption` | `<caption>`, under the table. Names it for screen readers |
| `Table.Header` | `<thead>` |
| `Table.Body` | `<tbody>` |
| `Table.Row` | `<tr>` |
| `Table.Head` | `<th scope="col">`. Takes `num` |
| `Table.Cell` | `<td>`. Takes `num` and `muted` |
| `Table.Actions` | A `<div>` that lays two or more row actions side by side in one Cell |

## Props

```ts
interface Table.RootProps extends React.ComponentProps<"table"> {
  size?: "sm" | "md";  // sm for dense admin lists
  bordered?: boolean;  // a line edge and rounded corners around the table, for a table that sits among other sections
}
interface Table.HeadProps extends React.ComponentProps<"th"> {
  num?: boolean; // right-aligned, for a column of numbers
}
interface Table.CellProps extends React.ComponentProps<"td"> {
  num?: boolean;   // right-aligned
  muted?: boolean; // ink-muted, for secondary values such as dates
}
```

Every native attribute passes through.

## Rules

- Use it for data with columns. Lists of content (notes, comments) are [entries](../patterns.md#entry), not rows.
- Set `num` on a numeric column's Head and on its Cells.
- Put row actions in the last column as a ghost [Menu](menu.md) trigger, named for its row. Give that column's Head text in `mu-visually-hidden`.
- Two or three frequent actions, such as Edit and Delete, go in a `Table.Actions` inside that Cell, as ghost Buttons. Put a single Button straight in the Cell:

  ```tsx
  <Table.Cell num>
    <Table.Actions>
      <Button variant="ghost" size="sm" icon={<Pencil />} aria-label={`Edit ${hook.name}`} />
      <Button variant="ghost" size="sm" icon={<Trash2 />} aria-label={`Delete ${hook.name}`} />
    </Table.Actions>
  </Table.Cell>
  ```
- Name the table with a Caption, or `aria-label` on the root.
- Sort, select and paginate in the app. The table has no data props.
- Set `bordered` when the table is one section of a settings or admin page, next to other sections or a [List](list.md), so it reads as one block. Its head row gets a `canvas` fill, so the head reads apart from the first row inside the box. Leave it off when the table is the page's main content. Never put a bordered table inside a Dialog or Popover.

## Style

- No stripes: a `line` under the head row and between body rows. Body rows highlight with `hover`.
- `bordered`: `surface` fill, a 1px `line` edge and `radius-lg` on the scrolling wrapper; the head row has a `canvas` fill, so it reads as the head inside the box; the Caption sits inside the edge, under a `line`. The outer columns pad `space-1` more, so the text lines up with a [List](list.md) row's.
- Heads: `label-sm` (13px, 500) in `ink-muted`, a control height tall.
- Cells: `caption` at sm and `body` at md, with tabular numbers. Rows are 34 or 40px; a Button in a cell, or a `Table.Actions` group of them (`space-1` apart), overlaps the padding, so rows keep that height.
- Cells pad `px` at the sides. Caption: `caption` in `ink-muted`, `space-2` above.
