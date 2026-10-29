/** Joins class names, skipping empty ones. */
export function cx(...names: (string | false | null | undefined)[]) {
  return names.filter(Boolean).join(' ');
}

/**
 * Puts our classes before the app's `className`, which Base UI lets be a
 * function of the part's state.
 */
export function withClass<State>(ours: string, theirs: string | ((state: State) => string | undefined) | undefined) {
  if (typeof theirs === 'function') return (state: State) => cx(ours, theirs(state));
  return cx(ours, theirs);
}
