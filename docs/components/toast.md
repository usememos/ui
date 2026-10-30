# Toast

Confirms that something happened, or that it failed, without blocking the page.

## Example

```tsx
import { Toast } from "@usememos/ui";

// Once, around the app:
<Toast.Provider>
  <App />
  <Toast.Viewport />
</Toast.Provider>

// Anywhere inside:
const toast = Toast.useToastManager();
toast.add({ title: "Note archived", actionProps: { children: "Undo", onClick: unarchive } });
toast.add({ title: "Settings saved", type: "success" });
toast.add({ title: "Couldn't sync", description: "Check your connection.", type: "danger", timeout: 0 });
```

## Parts

| Part | Base UI part | Renders |
| --- | --- | --- |
| `Toast.Provider` | `Toast.Provider` | Nothing. Holds the toasts |
| `Toast.Viewport` | `Toast.Portal`, `Viewport`, and each toast's `Root`, `Content`, `Title`, `Description`, `Action`, `Close` | The stack of toasts, portaled to the body |
| `Toast.useToastManager` | `Toast.useToastManager` | A hook: `add`, `update`, `close`, `promise`, `toasts` |
| `Toast.createToastManager` | `Toast.createToastManager` | A manager for code outside React; pass it to the Provider as `toastManager` |

## Props

```ts
interface Toast.ViewportProps extends BaseToast.Viewport.Props {
  closeLabel?: string; // accessible name of each X; default "Close"
  container?: HTMLElement | ShadowRoot | React.RefObject<HTMLElement | ShadowRoot | null> | null; // portal target
}
// toast.add() options (Base UI): title, description, type, timeout, priority, actionProps, onClose, data.
// type sets the tone: "success", "warning", "danger", or none for neutral.
```

Base UI's props pass through: `timeout` (default 5000ms) and `limit` (default 3) on the Provider.

## Rules

- Title: what happened, past tense ("Note archived"). Add a description only when it helps.
- At most one action, such as "Undo", through `actionProps`.
- Errors stay until dismissed: pass `timeout: 0` with `type: "danger"`, and `priority: "high"` when people must hear it at once.
- Color only marks the icon; the words carry the meaning.
- Render one Viewport per app. F6 moves focus into the toasts.

## Style

- `mu-popup`, `toast-width` wide, bottom-right at `space-6` from the edges; below `breakpoint-sm`, full width at `space-4`.
- A tone icon (`Info`, `CircleCheck`, `TriangleAlert`, `CircleAlert`) in `ink-muted`, `success`, `warning` or `danger`; title in `label`; description in `caption` `ink-muted`; the action as a small neutral Button; the X as a small ghost Button.
- Newest in front; the ones behind peek out `space-2` above and shrink. Hover or focus fans them out `space-3` apart. Toasts slide in from below and can be swiped away. Under reduced motion they only fade.
