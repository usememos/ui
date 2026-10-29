# Prose

Prose styles rendered Markdown: the body of a note, a comment, a changelog, a page on the website. One class, `mu-prose`, covers headings, paragraphs, lists, task lists, code, quotes, tables, images, tags and links, so content looks the same wherever it is read or edited.

## Props

```ts
interface ProseProps {
  children: React.ReactNode; // rendered HTML
  size?: Size; // sm for dense lists; default 15/24px
  className?: string;
}
```

## Guidelines

- Body text is 15px on a 24px line for reading comfort. `sm` is 14px on a 22px line, for lists.
- Headings are three steps (20, 17 and 15px) in weight 600, with `space-5` above and `space-2` below.
- Links are `accent`. Inline code and code blocks sit on `well`; inline code uses `radius-xs`. Quotes get a 2px `edge` bar.
- Tags are `ink-muted` on `well` and read as words, not badges.
- Task lists use the system [Checkbox](checkbox.md) at 16px. Done items go `ink-muted` with a strike-through.
- Images and video are full width with `radius-lg`. Tables follow the [Table](table.md) rules.
- The editor (`@usememos/editor`) uses the same CSS in edit mode, so content never shifts between editing and reading.
