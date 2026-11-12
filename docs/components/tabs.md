# Tabs

Switches between content panels on the same page. Use [ToggleGroup](toggle-group.md) to change a layout, filter or tool state, and [Link](link.md) to navigate to another page.

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
- Each tab activates a corresponding `Tabs.Panel`, such as Account or Notifications. Use Tabs when the choices name content sections.
- List / 2 / 3 / Auto changes how the same content is displayed: use a single-choice [ToggleGroup](toggle-group.md). Do not add empty panels just to use Tabs' appearance for a setting.
- Tabs and single-choice ToggleGroups share one segmented treatment. Pick by what the control changes; do not create separate tokens or visual variants to distinguish them.
- Left and Right arrow keys move between tabs.

## Style

- Shares the quiet well and sliding key with a single-choice ToggleGroup. Normal selection uses a `key` fill without a visible border; hover only changes label and icon contrast. Focus reuses `mu-focus`, independently of selection. In forced colors the selected key retains its text-colored border. Use the standard sm and md size rows and the shared inset and radius tokens.
- Tabs are sized to their labels and wrap when space is narrow; the well and key grow to fit. On touch screens each tab is at least 44px tall and wide. The key re-measures when a label changes width.
- Selected and hovered labels `text`, others `text-secondary`. Weight never changes, so labels don't shift.
