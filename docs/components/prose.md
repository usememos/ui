# Prose

Styles rendered Markdown: the body of a note, a comment, a changelog, a page on the website.

## Example

```tsx
import { Prose } from "@usememos/ui";

<Prose dangerouslySetInnerHTML={{ __html: renderMarkdown(memo.content) }} />

// or, with a React renderer
<Prose>
  <ReactMarkdown remarkPlugins={[remarkGfm]}>{memo.content}</ReactMarkdown>
</Prose>
```

Without React: `<div class="mu-prose">…</div>`, and `mu-prose mu-prose-sm` for the small size.

## Props

```ts
interface ProseProps extends React.ComponentProps<"div"> {
  size?: "sm" | "md"; // md: 15/24px for reading; sm: 14/22px for dense lists
}
```

Every native attribute passes through.

## Rules

- Put plain HTML from a Markdown renderer inside it. It styles elements (`h1`–`h6`, `p`, `ul`, `ol`, `li`, `a`, `code`, `pre`, `blockquote`, `table`, `img`, `video`, `hr`), so the renderer needs no classes.
- Task lists are `<li>` elements that start with `<input type="checkbox">`, as GFM renders them. Give each checkbox a name, such as `aria-label` with the item text. Drop `disabled` when people can tick them.
- Mark tags with `<span class="mu-prose-tag">#tag</span>`.
- Do not put components that are not content (forms, menus) inside it.
- The editor (`@usememos/editor`) uses the same stylesheet in edit mode, so content does not shift between editing and reading.

## Style

- Text: 15px on a 24px line (`sm`: 14 on 22), weight 400, `ink`. Blocks are `space-3` apart.
- Headings: `h1` 20/28px, `h2` 17/24px, `h3`–`h6` the text size; all weight 600, with `space-5` above and `space-2` below.
- Links: `accent`, underlined at rest, because color alone does not set them apart from the text.
- Code: `--mu-font-mono` at 0.875em on `well`. Inline code has `radius-xs`; blocks have `radius-md`, `space-3` by `space-4` padding, and scroll sideways.
- Quotes: a 2px `edge` bar, text in `ink-muted`. Rules: a 1px `line` with `space-5` around it.
- Lists indent `space-6`; markers are `ink-muted`. Task checkboxes are 16px, drawn like [Checkbox](checkbox.md); done items go `ink-muted` with a strike-through.
- Images and video: never wider than the column, `radius-lg`.
- Tables follow [Table](table.md): `line` between rows, 12px `ink-muted` heads, tabular numbers; they scroll sideways when too wide.
- Tags: `ink-muted` on `well`, `radius-xs`. They read as words, not badges.
- Sizes are custom properties set on `.mu-prose` in the foundation (`--prose-fs`, `--prose-lh`, heading sizes).
