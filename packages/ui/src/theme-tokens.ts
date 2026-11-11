/**
 * The custom properties an app theme sets: the 28 color tokens in
 * docs/color.md. A token a theme leaves out keeps its Light value, so an app's tests can check its theme
 * against this list. See docs/color.md#app-themes.
 */
export const themeTokens = [
  '--mu-canvas',
  '--mu-surface',
  '--mu-well',
  '--mu-hover',
  '--mu-key',
  '--mu-key-hover',
  '--mu-edge',
  '--mu-control-edge',
  '--mu-line',
  '--mu-overlay',
  '--mu-text',
  '--mu-text-secondary',
  '--mu-text-disabled',
  '--mu-primary',
  '--mu-primary-hover',
  '--mu-on-primary',
  '--mu-accent',
  '--mu-selection',
  '--mu-focus',
  '--mu-focus-edge',
  '--mu-success',
  '--mu-success-soft',
  '--mu-warning',
  '--mu-warning-soft',
  '--mu-danger',
  '--mu-danger-key',
  '--mu-danger-soft',
  '--mu-on-danger',
] as const;
