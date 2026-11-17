# Component verification

The playground is a component test fixture. It is not a mock product. Organize cases around the public API exported from `packages/ui/src/index.ts`, including namespace parts and supported prop values.

## Coverage contract

For each component, verify:

| Input | Required evidence |
| --- | --- |
| Package-owned prop | An explicit case in its component unit suite, asserting the observable result |
| Literal variant, size or orientation | Default/omitted behavior and every supported value; include inherited size and explicit override where the component participates in size context |
| Optional content | Present and absent; include icon-only and both icon slots where supported |
| Stateful API | Controlled value plus callback and parent update; uncontrolled default plus internal update; disabled/loading must prevent activation as documented |
| Composition hooks | Ref target, native/ARIA/data attributes, caller class/style, and `render` where supported. Input-like wrappers distinguish box hooks from control hooks |
| Folded overlay | Default and custom portal targets, positioning-prop routing, close label, variant and open/close behavior |
| Public namespace part | A direct render case with its parent context; verify its association, structure or behavior |
| Meaningful prop combination | A regression case at the seam, such as disabled + selected + description, or icon-only + loading + custom render |

`packages/ui/test/prop-coverage.test.ts` derives package-owned props and public parts from the actual TypeScript exports. It fails if a component suite omits an exported part or never explicitly supplies one of those props. This is an inventory guard; it does not judge assertion quality or replace the behavior checks above. Do not satisfy it with an unused fixture or a prop that is supplied but never checked.

Base UI and native props are inherited APIs. Verify that our wrappers preserve controlled state, callbacks, refs, `render`, attributes and positioning. Do not copy the upstream suite or build the Cartesian product of unrelated options. Exhaust the package's documented values, then test combinations that can interfere with each other.

## Where cases live

- **Unit:** `packages/ui/test/components/<component>.test.tsx`. All props for one component live together, including features added later. Shared size boundaries live in `composition.test.tsx`; class-function parity and token/CSS constraints remain shared suites.
- **Browser:** `e2e/` verifies real interaction and layout: keyboard paths, focus restoration, label/error associations, sizing, text roles, forced colors, reduced motion and size parity across input devices. Shared contracts stay in `consistency`, `icons`, `surfaces`, `touch` and `interop` suites instead of being duplicated in every component.
- **Visual fixture:** `playground/sections/<component>.tsx` shows supported appearances and relevant states. Small reusable fixtures in `playground/fixtures/` belong to the components that render them. No settings-page, timeline or empty-page mockups.
- **Visual baseline:** `e2e/visual.spec.ts` captures each component section in Light/Dark and every supported size, and on a coarse pointer. It also captures the overlay cases defined in that file. Generated baselines come from Linux CI only.

One fixture may support multiple assertions when it exercises the same props. Keep focused composed fixtures when they test a real seam, such as a list Popover containing a Menu, controls inside a panel, or a reaction picker. Remove a fixture only after migrating any unique assertion it supports.

Size/tone fixtures show the supported API, not a recommendation for every use of that content. Keep usage examples separate when a component's recommended size depends on its text role. Badge's composition fixtures put 13px metadata, xs and default sm Badges, and an xs action together, with localized and long labels and multi-digit counts. Check alignment, wrapping and truncation as well as each part's computed size. The full-playground axe checks run in Light and Dark at xs, sm and md, so compact-only appearances are included.

For Menu's [fixed density](components/menu.md), verify that xs, sm and md triggers and surrounding size contexts all open the same 28px rows with 13 / 18px text, 14px icons and 4px row corners. Cover root menus, submenus, `menuClasses()` popups and `menuClasses().item` rows inside list Popovers, including `mu-compact` ancestors. Description rows grow to fit content. Keep Select and Combobox size assertions separate; they still support sm and md.

For [Menu layers](depth.md#menu-layers), measure the 2px overlap on both sides, after collision flipping and in RTL, and retain first-row alignment (last-row alignment when opening upward). At 1x and 2x display density, check the real edge width, 6px outer inset and separator bleed. Verify pointer travel into a submenu, keyboard focus return, root versus nested depth, unchanged flat surfaces in other families, and the forced-colors 1px edge with no shadow. Menu screenshots include 32px of surrounding page where the viewport permits, so the shadow and composed seam are visible; do not crop them to the popup's border box.

## Changing the API or fixtures

1. Read the public prop type and its component guide. Add the case beside that component's existing cases, with an assertion about the caller-visible result.
2. Exercise defaults, supported values, and relevant combinations. Keep type restrictions checked by TypeScript, not runtime fallbacks.
3. Update the component section when appearance changes. Add an overlay capture when a new appearance is otherwise invisible in its closed section.
4. Run typecheck, unit and Chromium tests. The inventory guard must remain strict; do not exclude a new prop or public part just to pass it.
5. Generate and inspect Linux screenshots. Remove baselines for deleted fixtures, retain unrelated baselines, then run CI against the final source and images.

Use the shared render helper so every React root and portal unmounts after a unit test. Tests must not depend on DOM, timers, open widgets or refs left by an earlier case. Follow [Closing a rule change](consistency.md#closing-a-rule-change) when the API work changes a visual contract.

For an overlay's close behavior, assert that it becomes hidden and focus returns as documented. Do not require its DOM to disappear: Base UI may retain hidden content, and supported `keepMounted` APIs deliberately do so. Unit-test cleanup still unmounts every root between cases.
