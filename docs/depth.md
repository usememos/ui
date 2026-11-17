# Surfaces and boundaries

Controls and content are flat. Fills identify controls and state; borders separate adjacent or overlapping surfaces. Menu surfaces alone use a fine edge and light shadows to distinguish cascading layers. No component uses key sheen, focus rings or visible CSS outlines.

## Roles

| Role | Class | Used for | Treatment |
| --- | --- | --- | --- |
| Well | `mu-well` | Recessed surfaces and parts that hold state | `well` with a quiet 1px `edge`; state markers add their own treatment |
| Key | `mu-key` | Bounded controls, such as neutral buttons | `key` with a quiet 1px `edge` where a boundary is needed |
| Popup | `mu-popup` | Popovers, dialogs and toasts; base of Menu | `surface`, a 1px `edge` and `radius-xl` |
| Menu surface | `menuClasses().popup` | Root menus, submenus and app-built floating action lists | Popup fill and radius, `menu-edge-width` and `menu-depth`; cascading menus use `menu-nested-depth` |
| Content | none | Text fields and content | Fields use `surface` and a quiet `edge`; content has no enclosing box |

Use these classes before writing new surface styles. `mu-key` covers both a control and a selected choice; neither is raised. Dialogs use `radius-2xl`, and Drawers have an edge facing the page.

## Rules

- Only Menu surfaces use `box-shadow`, through the two menu-depth tokens below. Other components never use shadows. No `text-shadow`, sheen gradients, focus rings or visible `outline`. `outline: none` or `0` only suppresses a browser outline when another visible focus treatment exists.
- Text entry keeps its `surface` fill on hover and focus. Enabled fields never use a gray well; disabled fields use `well` with `text-disabled` text.
- Boundary strength follows its job. Resting, hovered and persistently selected surfaces never borrow text or focus colors for their borders. Text entry keeps its quiet 1px `edge` under hover, focus and press. A resting text field does not need the same visual weight as a checkbox or switch's state marker. The quiet field boundary is below 3:1 in the built-in themes; this treatment does not guarantee WCAG 1.4.11 for text entry.
- A checked checkbox or radio uses `primary` with an `on-primary` mark. A switch also moves its knob.
- Neutral buttons, Select triggers and switch tracks keep the quiet `edge` on hover. Button and Select fills provide hover feedback; fields and switches keep their fill. A switch keeps its contrasting `text` knob when off. Checkbox and Radio alone use `control-edge` around their small unchecked marks. Do not reuse that marker color around a toolbar item or a full control.
- A single choice among peers uses a contrasting `key` fill in a quiet well, with `text` for the selected label and icon. The group and selected key have no visible border in normal colors. Hover only increases label and icon contrast; focus reuses `mu-focus`. Borders reserve space, so geometry stays fixed. In forced colors the selected key gains a text-colored border. An independent on/off toggle uses `well` and `text` when on (`selected` and `text` for `variant="soft"`), with a transparent reserved border. Disabled on toggles keep that fill and use `text-disabled`. In forced colors an on toggle gets a system-colored boundary because its fill may disappear.
- Surface classes describe a surface, not an interaction state. `mu-key` keeps its `key` fill and quiet `edge` even with selected or pressed attributes. Use Toggle for a persistent on/off fill, or a key inside a well for one selected choice. Never turn a text token into a persistent border. Non-text focus and invalid fields are the explicit exceptions to quiet control boundaries.
- Floating surfaces have a border so they remain distinct over the same surface color. Modal backdrops still use `overlay`.
- Content is grouped by spacing, headings and separators. The boxed exceptions are List and bordered Table.
- Reserve border space so states never move text or change a control's size. [Measured insets](layout.md#measured-insets) defines which border a documented padding includes.

## Menu layers

The submenu is drawn above its parent and overlaps the parent's outer edge by `inset` (2px), on either side and after collision flipping. Keep both surfaces' full `radius-xl` corners. The stronger submenu shadow identifies the front layer; do not merge outlines, remove corners or add a connector. [Menu](components/menu.md#style) owns the placement behavior; [Layout](layout.md#floating-list-items) owns its measured 6px outer inset and fixed row density.

- The edge uses `edge` and `menu-edge-width`: 1px on standard-density screens, 0.5px at 2dppx and above. Subtract the edge from padding so the outer content inset stays 6px at either density.
- Root menus use `menu-depth`. Nested menus and menus opening beside a list Popover use `menu-nested-depth`. Base UI supplies the nesting and actual-side attributes; app-built cascading lists use the same attributes with `menuClasses().popup`.
- These package-owned tokens define two menu roles, not an elevation scale or app theme options. Both themes use the same neutral black stacks; Dark retains its quiet `edge`, without a white glow. Shadows and edges do not change on hover, press or focus, and do not animate separately.
- A list Popover keeps its flat 1px surface; only its child Menu receives menu depth. Select and Combobox lists, Dialog, Drawer, Tooltip and Toast retain their existing surface treatments. Menu row classes alone do not add a shadow to their container.
- In forced colors, Menu uses a 1px system-rendered edge and no shadow. The popup never gains a focus boundary.

| Token | Value | Role |
| --- | --- | --- |
| `menu-depth` | `0 6px 18px rgba(0,0,0,0.02), 0 3px 9px rgba(0,0,0,0.04), 0 1px 1px rgba(0,0,0,0.04)` | Root menu |
| `menu-nested-depth` | `0 9px 48px rgba(0,0,0,0.08), 0 6px 24px rgba(0,0,0,0.1), 0 1px 1px rgba(0,0,0,0.04)` | Menu above a parent menu or list panel |

## Focus

- `mu-focus` recolors the existing 1px border on `:focus-visible`. The fine edge keeps compact controls calm while contrasting with the fill. It provides the internal `--mu-control-border-width` variable. A custom control reads that variable for its border and subtracts it from its padding, so its text and size stay fixed. Text-only links use an underline instead.
- The edge uses `focus` ink. On primary and checked fills it uses `on-primary`; danger buttons use `on-danger`, so the edge contrasts with the fill.
- Input, Textarea and Combobox input boxes keep their border, surface and geometry under hover, focus and press. The visible caret or text selection indicates typing focus; do not recolor the box or animate it. Invalid fields keep `danger`. In forced colors, focused fields use the shared 2px system `focus-edge`. The caret/selection approach follows the text-field examples in [WCAG Focus Visible](https://www.w3.org/WAI/WCAG22/Understanding/focus-visible.html).
- Invalid non-text controls reuse the shared 1px focus edge. Their error message continues to identify the error; do not add a thicker focus variant for validation.
- Text links use a double underline on keyboard focus, including links already underlined at rest.
- Menu items and options use their highlighted fill. Opening a popup never draws a focus boundary around the popup.
- In forced-colors mode, focused borders use 2px in the system `Highlight` color. Real borders remain visible without a shadow or outline fallback.
