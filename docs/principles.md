# Principles and voice

## Principles

1. **Work first.** Content and editing get attention; supporting navigation and controls recede. Light uses a pale warm-gray canvas with bright surfaces. A control should not become more prominent merely because the pointer crosses it.
2. **Hierarchy before decoration.** Use alignment, spacing, text contrast and surface lightness before adding boundaries or icons. Ink emphasizes the primary action and saved on states. Brand hues do not fill controls.
3. **One shared vocabulary.** Components and public classes carry the same roles across products. Solve visual problems in that contract instead of accumulating local overrides. Our [Linear reference](design-reference.md) explains the evidence and the choices we make from it.
4. **Complete behavior, few visual treatments.** An interaction event is not a visual variant. Text entry stays stable through hover, focus and press; the caret or selection shows typing focus. Actions reuse one highlight, persistent choices retain a selected fill or mark, and errors, unavailable controls and waiting remain understandable.
5. **Immediate feedback, minimal opening and closing.** Hover, press, focus and frequent selection update immediately. Tabs do not animate every navigation step. Keep short shared transitions when popups, dialogs and panels appear or disappear. Motion explains content visibility, useful position changes or progress. No press movement, scaling, brightness filters or decorative event fades. See [Motion](motion.md) for the shared timings and reduced-motion rules.
6. **Dense and predictable.** Use the documented size rows, type scale, spacing ladder and icon system: controls default to 32px, on a 4px spacing scale. Components stay generic; products compose their screens from them and the shared patterns.

## Voice and interface text

- Sentence case everywhere: "Save note", not "Save Note".
- Control labels are one or two words. Buttons start with a verb.
- Address the reader as "you". Say what happened: "Note archived", not "Success!".
- Destructive confirmations name the object and the outcome: "Delete this note?" and "This can't be undone."
- Name an action with its verb, never "OK".
- Errors say how to fix the problem, not only what went wrong.
- No decorative emoji in interface labels. User content and reaction choices may contain emoji; compose those as content, not Lucide icons. Numbers use digits ("3 notes").

## What to avoid

- A brand hue on controls, or blue anywhere at rest except links.
- Cards and boxes around content. Group with spacing, a heading and a `Separator`. The exceptions are settings or records in a [List](components/list.md), a [Table](components/table.md) with `bordered`, or a small [Form](components/form.md) with `bordered` among them.
- Textures, glass or blur behind text, and neumorphism.
- Pills as the default for buttons or inputs. Use the opt-in Button/Toggle `shape="pill"` for compact reaction controls and similar content choices; ordinary actions keep the size-row corners.
- Color as the only signal. Status colors always come with a word or an icon.
- Illustrations in empty states.
