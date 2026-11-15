import type { ReactElement } from 'react';

/**
 * Control size. One value sets height, padding, text, icon size and radius
 * together. Only the components listed in docs/layout.md take xs; text entry,
 * menus, tabs and tables take `Exclude<Size, 'xs'>`.
 */
export type Size = 'xs' | 'sm' | 'md';

/** The usual size-row corners, or a pill with equal horizontal padding. */
export type ControlShape = 'default' | 'pill';

/** Status tone for components that report a status, such as Badge and toasts. */
export type Tone = 'neutral' | 'success' | 'warning' | 'danger';

/** An icon element. Controls use Lucide; collection rows also accept decorative emoji or identity marks. */
export type IconElement = ReactElement;
