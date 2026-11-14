# Keeping the system consistent

Use shared rules for a visual role, then compose components from those rules. A new screen is not a reason for a new padding, text style or state treatment.

## Rule ownership

Each decision has one owner. Component pages describe their API and map parts to these roles; they do not redefine the roles. Summaries and examples link to the owner. If they disagree, fix the summary or example and check the implementation against the owner.

| Decision | Owner |
| --- | --- |
| Product character and interface voice | [Principles](principles.md) |
| Color roles and theme values | [Color](color.md) |
| Text roles, sizes and weights | [Typography](typography.md) |
| Surface and boundary treatments | [Depth](depth.md) |
| Size rows, measured insets, row anatomy and shape | [Layout](layout.md) |
| Combined states and their precedence | [States](states.md#combined-states) |
| Icon boxes, strokes and accessibility | [Icons](icons.md) |
| Transitions and reduced motion | [Motion](motion.md) |
| Screen composition | [Patterns](patterns.md) and [Usage](usage.md) |

Change the owning rule first. An exception belongs beside that rule, with its reason and scope, and a link from the relevant component or pattern. Update affected examples, implementation and verification in the same change. Do not add a second rule to work around the first.

## Styling ownership

`className` and `style` are layout and integration hooks, not permission to invent a component appearance. The CSS cascade permits more than the design contract supports.

| App owns | Package owns |
| --- | --- |
| Placement, external margins, width constraints, flex/grid arrangement and responsive composition | Internal padding and gaps, height/hit boundaries, radius, type, icon geometry, semantic colors and state treatments |
| Choosing documented props and composing parts | The appearance and behavior promised by those props and parts |
| Complete color/font themes through the documented theme tokens | All other token values and every shipped class rule |

Layout hooks must not clip content, shrink hit areas or force a fixed height that prevents documented wrapping. Wrap a component to add layout spacing instead of changing its internal padding. Use the component's size, variant and shape APIs for supported visual choices. A new supported appearance requires a change to the owning rule and API, not a per-instance utility override.

An app-owned part uses Base UI for behavior, class functions or public classes for existing looks, and tokens for its additional structure. It follows the same role, geometry and state contracts; it never restyles a shipped part or changes internal row variables. See [Building your own component](custom-components.md).

```tsx
// Layout belongs to the app; appearance comes from the component.
<Button className="w-full" size="sm">Save</Button>

// Incorrect: a local appearance that bypasses the size and text roles.
<Button className="h-12 px-8 font-light">Save</Button>
```

## Closing a rule change

A visual rule is complete only when its documentation, implementations, compositions and checks agree:

1. Update the owner and every conflicting summary or example. Map the affected parts to the existing roles before adding a token or variant.
2. Apply the rule to every implementation of that role, including class-function consumers. Test behavior through Base UI rather than inventing parallel interaction code.
3. Exercise relevant prop combinations with ordinary and long localized text, missing optional parts and combined states. Reuse the owning component section and its focused fixtures; keep cross-component seams such as a panel containing controls. Follow [Component verification](testing.md), without adding mock product screens.
4. Check computed text roles and actual box coordinates separately from screenshots. Cover Light/Dark, supported sizes, keyboard use, coarse pointers and reduced motion where affected. Assert accessible names and interaction results when structure changes.
5. Generate changed baselines with the Linux Screenshots workflow, inspect the changed images, and keep only intentional changes. Record the user-visible result in the changelog. Passing an image comparison alone does not verify a semantic role.

Typography changes also need visual inspection in a native system-font browser. Linux snapshots remain the reproducible baseline, but platforms can render 400 and 500 differently. Never change a semantic weight merely to make one platform's screenshot look heavier. Report platforms that were not inspected.

The checks have distinct jobs: unit tests cover public props, token tables, class parity and CSS constraints; browser assertions cover roles, geometry and behavior; component and overlay screenshots cover appearance. Keep all three when a change crosses those boundaries. Do not replace one with another or update baselines to hide a failing contract.
