# Drawer

A panel that slides in from one edge of the screen over a dimmed backdrop, such as a navigation sidebar on a phone or the details of one item.

## Example

```tsx
import { Button, Drawer } from "@usememos/ui";
import { Menu } from "lucide-react";

<Drawer.Root side="start" open={open} onOpenChange={setOpen}>
  <Drawer.Trigger render={<Button variant="ghost" icon={<Menu />} aria-label="Open navigation" />} />
  <Drawer.Popup variant="bare">
    <Drawer.Title className="mu-visually-hidden">Navigation</Drawer.Title>
    <AppSidebar />
  </Drawer.Popup>
</Drawer.Root>
```

## Parts

| Part | Base UI part | Renders |
| --- | --- | --- |
| `Drawer.Root` | `Drawer.Root` | Nothing. Holds the open state. Takes `side` |
| `Drawer.Trigger` | `Drawer.Trigger` | The control that opens it, usually a Button through `render` |
| `Drawer.Popup` | `Drawer.Portal`, `Backdrop`, `Viewport`, `Popup`, `Content` | The panel against the edge, over a dimmed backdrop, portaled to the body. Adds an X unless `variant="bare"` |
| `Drawer.Title` | `Drawer.Title` | An `<h2>` that names the drawer |
| `Drawer.Description` | `Drawer.Description` | A `<p>` under the title |
| `Drawer.Close` | `Drawer.Close` | A control that closes it, such as each link of a navigation drawer |

## Props

```ts
interface Drawer.RootProps extends BaseDrawer.Root.Props {
  side?: "start" | "end" | "bottom"; // the edge it slides from and swipes back to; default "end". start and end follow the text direction
}
interface Drawer.PopupProps extends BaseDrawer.Popup.Props {
  variant?: "panel" | "bare"; // default "panel"; bare: no padding, gap or X
  closeLabel?: string;        // accessible name of the X, or of bare's screen-reader Close; default "Close"
  container?: HTMLElement | ShadowRoot | React.RefObject<HTMLElement | ShadowRoot | null> | null; // portal target
}
```

Base UI's props pass through: `open`, `defaultOpen`, `onOpenChange`, `onOpenChangeComplete`, `modal`, `disablePointerDismissal` on the root; `initialFocus`, `finalFocus` on the popup. `side` replaces Base UI's `swipeDirection`; snap points are not supported.

## Rules

- Use it for content that belongs beside the page rather than on top of it: the navigation sidebar below `breakpoint-md`, or the details of one item. For a decision or a short form, use [Dialog](dialog.md), which already becomes a sheet from the bottom on phones.
- Name it: a `Drawer.Title`, hidden with `mu-visually-hidden` when the content names itself, or `aria-label` on the popup.
- `variant="bare"` is for content that lays itself out, such as an app's sidebar. Set its width with `className` when the content has its own, such as `sidebar-width`. From the start or end, its content is exactly the drawer's height: give the app's sidebar `height: 100%` and let a region inside it scroll (`flex: 1; min-height: 0; overflow-y: auto`). Don't set `100dvh` or add a Close or an edge yourself: bare has a Close for screen readers (out of the tab order; keyboards use Escape) and the drawer draws its own edge.
- Close it when people pick a destination: wrap each link in `Drawer.Close render={<a … />}`, or close it from the router.
- Escape, a backdrop click and a swipe toward its edge close it. Focus moves in and returns to the trigger.
- The panel is always md, as a Dialog is.

## Style

- `surface` with `shadow-pop`, full height and `drawer-width` (320px) wide from the start or end edge, with a 1px `line` edge on its inner side (the side facing the page), as a fixed sidebar has, at most the screen width minus `space-12`. Square corners; from the bottom it is full width with `radius-2xl` top corners and at most the screen height minus `space-6`.
- `panel`: content `space-5` in, stacked `space-4` apart, as in a Dialog; the X is a small ghost Button at `space-4` from the top end corner. Title: `title`. Description: `body` in `ink-muted`, `space-1` under the title.
- `bare`: no padding, gap or X. A visually hidden `Drawer.Close` named `closeLabel` follows the content, so screen readers on touch screens can close it.
- The backdrop is `overlay`; it fades as the drawer is swiped away.
- Slides in from its edge over `duration-settle` with `ease-settle` and follows the finger while swiped. Under reduced motion it fades instead.
