# Principles and voice

## Principles

1. **Content first.** The interface stays gray, so people's words, tags and images are the color on the page.
2. **Ink is the emphasis.** The primary action, a checked box and a switch that is on use `primary` (near-black in Light, near-white in Dark). There is no brand hue in controls.
3. **Depth means behavior.** Recessed parts hold a state (wells, tracks). Raised parts can be pressed (buttons, keys, knobs). Flat parts are content, including text fields. Never add depth for decoration. See [Depth](depth.md).
4. **Calm by default.** Hierarchy comes from text color and lightness steps, not from weight, size or extra color.
5. **Dense, not cramped.** Controls are 32px tall by default, and every gap comes from the 4px scale. See [Size, spacing and layout](layout.md).
6. **One system, many products.** Components are generic. A product's screens are built from them and from the [patterns](patterns.md); nothing in the package knows what a note or a memo is.

## Voice and interface text

- Sentence case everywhere: "Save note", not "Save Note".
- Control labels are one or two words. Buttons start with a verb.
- Address the reader as "you". Say what happened: "Note archived", not "Success!".
- Destructive confirmations name the object and the outcome: "Delete this note?" and "This can't be undone."
- Name an action with its verb, never "OK".
- Errors say how to fix the problem, not only what went wrong.
- No emoji in the interface. Numbers use digits ("3 notes").

## What to avoid

- A brand hue on controls, or blue anywhere at rest except links.
- Cards and boxes around content. Group with spacing, a heading and a `Separator`.
- Textures, glass or blur behind text, and neumorphism.
- Pills for buttons, inputs or badges.
- Color as the only signal. Status colors always come with a word or an icon.
- Illustrations in empty states.
