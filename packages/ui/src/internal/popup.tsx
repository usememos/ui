/** Base UI's Positioner props that every folded `Popup` part accepts. */
const positionerKeys = [
  'side',
  'align',
  'collisionAvoidance',
  'collisionBoundary',
  'sticky',
  'anchor',
  'positionMethod',
  'disableAnchorTracking',
  'alignItemWithTrigger',
] as const;

type PositionerKey = (typeof positionerKeys)[number];

/**
 * Splits a folded Popup's props into the ones for Base UI's Positioner and
 * the rest, for its Popup.
 */
export function splitPositioner<Props extends object>(props: Props) {
  const positioner: Record<string, unknown> = {};
  const rest: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(props)) {
    if ((positionerKeys as readonly string[]).includes(key)) {
      if (value !== undefined) positioner[key] = value;
    } else {
      rest[key] = value;
    }
  }
  return [positioner, rest as Omit<Props, PositionerKey>] as const;
}
