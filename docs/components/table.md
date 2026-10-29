# Table

A table lists things with the same attributes, such as tokens, users or webhooks. It is rows separated by `line`, with no boxes or stripes.

## Props

```ts
interface TableColumn<Row> {
  key: string;
  label: React.ReactNode;
  num?: boolean;   // right-aligned, tabular numbers
  muted?: boolean; // ink-muted cells
  render?: (row: Row) => React.ReactNode;
}

interface TableProps<Row = Record<string, any>> {
  columns: TableColumn<Row>[];
  rows: (Row & { key?: string | number })[];
  size?: Size; // sm for dense admin lists
  caption?: React.ReactNode;
}
```

## Guidelines

- Headers are 12px `ink-muted`. Cells are 14px with tabular numerals; numbers right-align with `num`.
- Rows highlight with `hover`. Put row actions in the last column as a ghost [Menu](menu.md) trigger.
- Tables are for data. Lists of content (notes, comments) are [entries](../patterns.md#entry) with spacing, not rows.
