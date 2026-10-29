# Tabs

Tabs switch between sections of the same page. The tab list is a recessed well, and the selected tab is a raised key that slides to the one you pick.

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
| `Tabs.Panel` | `Tabs.Panel` | The content of one tab, a `<div role="tabpanel">` |

## Props

```ts
interface Tabs.RootProps extends BaseTabs.Root.Props {
  size?: Size;
}
interface Tabs.TabProps extends BaseTabs.Tab.Props {
  icon?: IconElement; // before the label
}
// Tabs.List and Tabs.Panel take Base UI's props.
```

Base UI's props (`value`, `defaultValue`, `onValueChange` on the root; `activateOnFocus`, `loopFocus` on the list; `value`, `disabled` on each tab; `keepMounted` on each panel) pass through.

## Guidelines

- Tabs and a single-choice [ToggleGroup](toggle-group.md) share one segmented well, so "one of these" always looks the same.
- Tabs are sized to their labels, not split equally. The key re-measures when a label changes width.
- Selected and hovered labels are `ink`; others are `ink-muted`. The weight never changes, so labels don't shift.
- Left and Right arrow keys move between tabs. Give the list an `aria-label`.
- Use tabs for sections of a page, not for site navigation.
