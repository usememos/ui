# Popover

A small floating panel of controls next to its trigger, such as a share panel or a link editor.

## Example

```tsx
import { Button, Input, Popover } from "@usememos/ui";

<Popover.Root>
  <Popover.Trigger render={<Button>Share</Button>} />
  <Popover.Popup align="start">
    <Popover.Title>Share this note</Popover.Title>
    <Popover.Description>Anyone with the link can read it.</Popover.Description>
    <Input readOnly value={link} aria-label="Link" />
  </Popover.Popup>
</Popover.Root>
```

## Parts

| Part | Base UI part | Renders |
| --- | --- | --- |
| `Popover.Root` | `Popover.Root` | Nothing. Groups a trigger and its popup |
| `Popover.Trigger` | `Popover.Trigger` | The control that opens it, usually a Button through `render` |
| `Popover.Popup` | `Popover.Portal`, `Positioner`, `Popup` | The panel, a `<div>` portaled to the body |
| `Popover.Title` | `Popover.Title` | An `<h2>` that names the popup |
| `Popover.Description` | `Popover.Description` | A `<p>` under the title |
| `Popover.Close` | `Popover.Close` | A button that closes it, usually a Button through `render` |

## Props

```ts
interface Popover.PopupProps extends BasePopover.Popup.Props {
  side?: Side; align?: Align; // Positioner props; default side "bottom"
  container?: HTMLElement | ShadowRoot | React.RefObject<HTMLElement | ShadowRoot | null> | null; // portal target
  variant?: "panel" | "list"; // default "panel"; list: a Menu's padding and no gap, for rows
}

function popoverClasses(options?: { variant?: "panel" | "list" }): { popup: string; title: string; description: string };
```

Base UI's props pass through: `open`, `defaultOpen`, `onOpenChange`, `modal` on the root; `openOnHover`, `delay` on the trigger; `initialFocus`, `finalFocus` on the popup.

## Rules

- Use it for a few controls that belong to one thing. For a list of actions, use [Menu](menu.md). For a decision that blocks the page, use [Dialog](dialog.md).
- Give it a `Popover.Title`, or `aria-label` on the popup.
- `variant="list"` is for a panel made of rows, such as an account panel (a name, then links) or a scope picker with a header. Draw the rows with `menuClasses().item` and the lines between them with `menuClasses().separator`. When the rows are only actions, use a [Menu](menu.md) instead. For 28px rows beside a sidebar with `mu-compact`, put `mu-compact` on the popup too: `className="mu-compact"`.
- A row that opens a list of choices beside the panel (Theme, Language) is its own `Menu.Root`: the row is the `Menu.Trigger` (`openOnHover`, `render={<button className={menuClasses().item} />}`), and its `Menu.Popup` takes `side="inline-end" align="start"`. The choices then line up with the row like a submenu's, and the menu's edge touches the panel's. Give the Menu's popup `mu-compact` too when the panel has it.
- The panel is always md: controls inside it ignore the size of the Root around the Popover (a sm toolbar). Pass `size` to a control inside only when it should differ.
- It closes on Escape and on a click outside; focus returns to the trigger.
- An app's own floating panel, such as an emoji picker, takes `popoverClasses()`. See [Class functions](../custom-components.md#class-functions).

## Style

- `mu-popup` (`surface`, a 1px `edge`, `radius-xl`), `space-4` padding, `popover-width` wide. Children stack `space-3` apart.
- Horizontal Field labels are 500 in `text-secondary`; selected and entered values remain 400 in `text`. Vertical Field labels stay 500 in `text`. Disabled labels keep `text-disabled`, and state changes never promote a setting name's color. See [Settings](../patterns.md#settings).
- Title: `label`. Description: `caption` in `text-secondary`, `space-1` under the title.
- `list`: 6px padding and no gap, like a Menu. Rows use the [floating-list item contract](../layout.md#floating-list-items). A title and description use the same 8px inline padding as text-only rows, with `space-2` above the title and below the description; they do not reserve a leading icon column.
- Opening and closing use the shared [Motion](../motion.md) fade and `space-1` offset over `duration-fade`. Both are immediate under reduced motion.


## Compact reaction picker

Compose Popover, Toggle and Button; the library does not ship a ReactionPicker. The app owns counts, user identity, requests, pending/disabled state and whether a successful choice closes the popup. Both places read the same controlled `pressed` values; do not give the picker a separate selection state. This example keeps the popup open so several choices can be toggled.

The strip is 24px high (`sm`) on every input device: soft pills, 14px emoji, 13px counts and 4px between them. The ghost add button is circular and the same height. The picker uses `mu-compact` for 28px cells, 2px between cells and 8px total inset (including its border). It sizes to its contents and Base UI anchors it to the add button. The default eight choices form one row; narrow viewports use four columns regardless of input device. Neither the strip nor the picker expands its hit areas. Text and emoji stay the same size.

`icon` remains a Lucide slot. An emoji is content in `children`, with its own type class; the small layout class below makes an emoji-only Toggle square without depending on undocumented icon-slot behavior or internal `mu-*` classes. This is a CSS grid of ordinary toggles, not an ARIA grid or menu: Tab reaches each choice, Space/Enter toggles it, Escape dismisses an open Tooltip first, then the popup and restores trigger focus. Give each emoji a localized accessible name and a matching Tooltip. The popup is named with `aria-label` because this compact example has no visible title.

```tsx
import { Button, Popover, Toggle, Tooltip } from "@usememos/ui";
import { SmilePlus } from "lucide-react";

const choices = [
  { emoji: "👍", label: "Thumbs up" },
  { emoji: "❤️", label: "Heart" },
  { emoji: "🎉", label: "Celebrate" },
  { emoji: "😄", label: "Smile" },
  { emoji: "🤔", label: "Thinking" },
  { emoji: "👀", label: "Eyes" },
  { emoji: "🚀", label: "Rocket" },
  { emoji: "🙏", label: "Thanks" },
];

type Reaction = { emoji: string; label: string; count: number; pressed: boolean };

// The parent supplies server counts and the current user's selected choices.
function CompactReactions({ reactions, onPressedChange }: {
  reactions: Reaction[];
  onPressedChange: (emoji: string, pressed: boolean) => void;
}) {
  return (
    <Tooltip.Provider>
      <div className="reaction-strip" role="group" aria-label="Reactions">
        {reactions.filter((reaction) => reaction.count > 0).map((reaction) => (
          <Toggle
            key={reaction.emoji}
            variant="soft" shape="pill" size="sm"
            aria-label={`${reaction.label}, ${reaction.count} reactions`}
            pressed={reaction.pressed}
            onPressedChange={(pressed) => onPressedChange(reaction.emoji, pressed)}
          >
            <span className="reaction-label">
              <span className="mu-body" aria-hidden>{reaction.emoji}</span>
              <span className="mu-caption reaction-count" aria-hidden>{reaction.count}</span>
            </span>
          </Toggle>
        ))}
        <Popover.Root>
          <Tooltip.Root>
            <Tooltip.Trigger render={
              <Popover.Trigger render={
                <Button variant="ghost" shape="pill" size="sm" icon={<SmilePlus />} aria-label="Add reaction" />
              } />
            } />
            <Tooltip.Popup>Add reaction</Tooltip.Popup>
          </Tooltip.Root>
          <Popover.Popup align="start" aria-label="Choose reactions" className="mu-compact reaction-popup">
            <div className="reaction-options">
              {choices.map(({ emoji, label }) => (
                <Tooltip.Root key={emoji}>
                  <Tooltip.Trigger render={
                    <Toggle
                      variant="soft" className="reaction-option"
                      aria-label={label}
                      pressed={reactions.some((reaction) => reaction.emoji === emoji && reaction.pressed)}
                      onPressedChange={(pressed) => onPressedChange(emoji, pressed)}
                    >
                      <span className="mu-body" aria-hidden>{emoji}</span>
                    </Toggle>
                  } />
                  <Tooltip.Popup>{label}</Tooltip.Popup>
                </Tooltip.Root>
              ))}
            </div>
          </Popover.Popup>
        </Popover.Root>
      </div>
    </Tooltip.Provider>
  );
}
```

The remaining CSS describes content and layout, not control colors, borders, focus or disabled states. Put it in the app's stylesheet, after the library (or in a later cascade layer). `Popover.Popup` supplies the surface and viewport collision constraints; keep its `max-width`. Its size context is md even if the trigger is sm. `mu-compact` must be on the popup itself because it is portaled.

```css
.reaction-strip { display: flex; flex-wrap: wrap; align-items: center; gap: var(--mu-space-1); }
.reaction-label { display: inline-flex; align-items: center; gap: var(--mu-space-1); }
.reaction-count { font-variant-numeric: tabular-nums; }
.reaction-popup { width: max-content; padding: calc(var(--mu-space-2) - 1px); }
.reaction-options { display: grid; grid-auto-flow: column; gap: var(--mu-inset); max-height: var(--mu-list-height); overflow-y: auto; }
.reaction-option { width: var(--mu-row-height); padding: 0; }
@media (max-width: 639px) {
  .reaction-options { grid-auto-flow: row; grid-template-columns: repeat(4, max-content); }
}
```

A custom app theme now supplies `selected` alongside its other [color tokens](../color.md#app-themes); it must stay distinct from `hover`/`well` and keep at least 4.5:1 with `text` and `text-disabled`. Consumers do not need `data-pressed:bg-*`, `data-pressed:hover:bg-*`, forced-color rules, a custom focus treatment, control corner overrides or touch-size overrides.
