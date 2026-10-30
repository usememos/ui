/**
 * The custom properties an app theme sets: the 26 color tokens in
 * docs/color.md and the five shadow tokens in docs/depth.md. A token a theme
 * leaves out keeps its Light value, so an app's tests can check its theme
 * against this list. See docs/color.md#app-themes.
 */
export const themeTokens = [
  '--mu-canvas',
  '--mu-surface',
  '--mu-well',
  '--mu-hover',
  '--mu-key',
  '--mu-key-hover',
  '--mu-key-sheen',
  '--mu-edge',
  '--mu-line',
  '--mu-overlay',
  '--mu-ink',
  '--mu-ink-muted',
  '--mu-primary',
  '--mu-primary-hover',
  '--mu-on-primary',
  '--mu-accent',
  '--mu-selection',
  '--mu-focus',
  '--mu-success',
  '--mu-success-soft',
  '--mu-warning',
  '--mu-warning-soft',
  '--mu-danger',
  '--mu-danger-key',
  '--mu-danger-soft',
  '--mu-on-danger',
  '--mu-shadow-track',
  '--mu-shadow-key',
  '--mu-shadow-raised',
  '--mu-shadow-pressed',
  '--mu-shadow-pop',
] as const;
