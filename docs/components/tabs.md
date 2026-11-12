# Tabs

Switches between sections of the same page.

## Example

```tsx
import { Tabs } from "@usememos/ui";
import { Bell, User } from "lucide-react";

<Tabs.Root defaultValue="account">
  <Tabs.List aria-label="Settings sections">
    <Tabs.Tab value="account" icon={<User />}>Account</Tabs.Tab>
    <Tabs.Tab value="notifications" icon={<Bell />}>Notifications</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="account">…</Tabs.Panel>
  <Tabs.Panel value="notifications">…</Tabs.Panel>
</Tabs.Root>
```

## Parts

| Part | Base UI part | Renders |
| --- | --- | --- |
| `Tabs.Root` | `Tabs.Root` | A `<div>` around the list and panels. Takes `size` |
| `Tabs.List` | `Tabs.List` with `Tabs.Indicator` | The well, a `<div role="tablist">`, with the sliding key built in |
| `Tabs.Tab` | `Tabs.Tab` | One tab, a `<button role="tab">`. Takes `icon` |
| `Tabs.Panel` | `Tabs.Panel` | One tab's content, a `<div role="tabpanel">` |

## Props

```ts
interface Tabs.RootProps extends BaseTabs.Root.Props {
  size?: "sm" | "md";
}
interface Tabs.TabProps extends BaseTabs.Tab.Props {
  icon?: IconElement; // before the label
}
```

Base UI's props pass through: `value`, `defaultValue`, `onValueChange` on the root; `activateOnFocus`, `loopFocus` on the list; `value`, `disabled` on each tab; `keepMounted` on each panel.

## Rules

- Give the list an `aria-label`.
- Use tabs for sections of a page, not for site navigation. For a filter or view switch, use a [ToggleGroup](toggle-group.md).
- Left and Right arrow keys move between tabs.

## Style

- Shares the segmented well and sliding key with a single-choice ToggleGroup. The group has no visible border; the selected key uses a `text-secondary` border; keyboard focus retains the strong item border. In forced colors the selected key has a text-colored border.
- Tabs are sized to their labels and wrap when space is narrow; the well and key grow to fit. On touch screens each tab is at least 44px tall and wide. The key re-measures when a label changes width.
- Selected and hovered labels `text`, others `text-secondary`. Weight never changes, so labels don't shift.
