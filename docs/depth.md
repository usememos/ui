# Depth

The default taste is "Light, tactile": restrained depth where depth shows behavior. Recessed parts hold a value. Raised parts can be pressed. Popups float. Everything else, including text fields and content, is flat.

## Roles

| Role | Class | Used for | Background | Shadow |
| --- | --- | --- | --- | --- |
| Recessed | `mu-recessed` | Switch, tab, checkbox and radio wells, pressed toggles | `well` with a 1px `edge` | `shadow-track`, a soft inner shadow from the top |
| Key in a well | `mu-key` | The selected tab or segment, switch knobs | `key` with the `key-sheen` gradient | `shadow-key` |
| Raised | `mu-raised` | Buttons, select triggers, kbd | `key` or `primary` with `key-sheen` | `shadow-raised`; `shadow-pressed` while held |
| Popup | `mu-popup` | Menus, popovers, dialogs, sheets, toasts | `surface` | `shadow-pop` |
| Flat | none | Inputs and textareas, checked boxes and radios, content | `surface` with `edge`, or `primary` | None |

Each depth class applies a whole role in one class. Use them for new parts before writing new shadows.

```css
.mu-recessed { background-color: var(--mu-well); box-shadow: inset 0 0 0 1px var(--mu-edge), var(--mu-shadow-track); }
.mu-raised   { background-color: var(--mu-key); background-image: linear-gradient(180deg, var(--mu-key-sheen), rgba(255,255,255,0) 60%); box-shadow: var(--mu-shadow-raised); }
.mu-key      { background-color: var(--mu-key); background-image: linear-gradient(180deg, var(--mu-key-sheen), rgba(255,255,255,0) 60%); box-shadow: var(--mu-shadow-key); }
.mu-popup    { background: var(--mu-surface); box-shadow: var(--mu-shadow-pop); border-radius: var(--mu-radius-xl); }
```

## Rules

- Light always comes from the top.
- Text entry is flat: an input is `surface` with an `edge`, never a gray well, so it never reads as disabled next to a key.
- A checked box or radio holds a value, so it is a flat `primary` fill, not a raised key. Only things you press are raised.
- **One rule for "selected".** A single choice among peers (tabs, a segmented filter) is a raised key sliding in a well. An on/off state (a toolbar toggle) is pressed into a well. Never mix the two in one row.
- Content areas are flat. There is no card component: group content with spacing, a heading and a `Separator`.
- No textures, no glass or blur behind text, and no neumorphism. Every fill and text pair keeps its contrast, and depth is added on top.
- In High contrast, depth turns into outlines on every well and key, and `shadow-pressed` becomes an inner ring.

## Shadow tokens

| Token | Usage |
| --- | --- |
| `shadow-track` | Recessed parts: wells and the faint top shadow inside inputs. The border comes from `edge` |
| `shadow-key` | Keys inside a well: the switch knob, the selected tab or segment |
| `shadow-raised` | Free-standing keys on canvas or surface: buttons, select triggers, kbd |
| `shadow-pressed` | A key while held |
| `shadow-pop` | Menus, selects, popovers, dialogs, sheets and toasts: the floating layer |

### Light

```css
--mu-shadow-track: inset 0 1px 2px rgba(0,0,0,0.10);
--mu-shadow-key: 0 1px 2px rgba(0,0,0,0.16), 0 2px 6px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9), inset 0 -1px 0 rgba(0,0,0,0.05);
--mu-shadow-raised: inset 0 1px 0 rgba(255,255,255,0.25), inset 0 -1px 0 rgba(0,0,0,0.10), 0 0 0 0.5px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.12);
--mu-shadow-pressed: inset 0 1px 3px rgba(0,0,0,0.22), 0 0 0 0.5px rgba(0,0,0,0.12);
--mu-shadow-pop: 0 8px 24px rgba(0,0,0,0.10), 0 1px 3px rgba(0,0,0,0.08), 0 0 0 0.5px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8);
```

### Dark

```css
--mu-shadow-track: inset 0 1px 2px rgba(0,0,0,0.55), inset 0 -0.5px 0 rgba(255,255,255,0.06);
--mu-shadow-key: 0 1px 2px rgba(0,0,0,0.6), 0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.10);
--mu-shadow-raised: inset 0 1px 0 rgba(255,255,255,0.10), inset 0 -1px 0 rgba(0,0,0,0.25), 0 0 0 0.5px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.5);
--mu-shadow-pressed: inset 0 1px 3px rgba(0,0,0,0.6), 0 0 0 0.5px rgba(0,0,0,0.6);
--mu-shadow-pop: 0 8px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.06);
```

### High contrast

```css
--mu-shadow-track: 0 0 0 0 rgba(0,0,0,0);
--mu-shadow-key: 0 0 0 1px #6b6b6b;
--mu-shadow-raised: 0 0 0 1px #000000;
--mu-shadow-pressed: inset 0 0 0 2px #000000;
--mu-shadow-pop: 0 0 0 1px #000000;
```
