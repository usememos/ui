# Components

28 components in five groups, chosen from what Base UI and other popular libraries provide and what our products need today. Every component is generic: it works the same in memos, the website, the web clipper and any future product.

| Group | Components |
| --- | --- |
| Actions | [Button](button.md), [Toggle](toggle.md), [ToggleGroup](toggle-group.md), [Menu](menu.md), [Link](link.md) |
| Forms | [Field and Fieldset](field.md), [Input](input.md), [Textarea](textarea.md), [Select](select.md), [Combobox](combobox.md), [Checkbox](checkbox.md), [Switch](switch.md), [RadioGroup](radio-group.md) |
| Navigation | [Tabs](tabs.md), [Collapsible](collapsible.md) |
| Overlays | [Dialog](dialog.md) (and its sheet form), [Popover](popover.md), [Tooltip](tooltip.md), [Toast](toast.md) |
| Display | [Avatar](avatar.md), [Badge](badge.md), [Kbd](kbd.md), [Separator](separator.md), [Spinner](spinner.md), [Skeleton](skeleton.md), [Table](table.md), [Prose](prose.md), plus [Lucide icons](../icons.md) |

## Left out on purpose

- **Card.** Content is grouped by spacing, headings and separators, not boxes.
- **Slider, Stepper.** No setting in our products needs a continuous range. Use an Input with `type="number"` or a Select.
- **Chip, SegmentedControl, Accordion.** A Toggle covers filter chips, a single-choice ToggleGroup covers segmented choices, and stacked Collapsibles cover an accordion.
- **Later, when a screen needs them:** multi-select Combobox, ContextMenu, ScrollArea, Progress, Calendar.

## Choosing between similar components

| Need | Use |
| --- | --- |
| Start an action | Button |
| Go somewhere | Link, or Button with `href` when it should look like an action |
| A setting that saves at once | Switch |
| An option saved with a form | Checkbox |
| One of 2 or 3 options, with room to show them | RadioGroup |
| One of a short list | Select |
| One of a long list, or typing to find | Combobox |
| On/off in a toolbar, or stacking filters | Toggle, or ToggleGroup `type="multiple"` |
| One of several views or filters on the same page | ToggleGroup `type="single"` |
| Sections of a page | Tabs |
| A list of actions for one thing | Menu |
| A few controls that belong to one thing | Popover |
| A decision that blocks the page | Dialog |
| Name an icon-only control | Tooltip |
| Confirm something happened | Toast |
| A status or tag label | Badge |
| A clickable tag filter | Toggle |
| Content still loading | Skeleton |
| A control waiting on a server | the control's `loading` prop |

## Shared types

```ts
type Size = "sm" | "md" | "lg";
type Tone = "neutral" | "success" | "warning" | "danger";
/** A Lucide icon element, such as <Pin /> from lucide-react. Size and stroke come from the component. */
type IconElement = React.ReactElement;
```

See [Building on it](../building.md#api-conventions) for the conventions every component follows.
