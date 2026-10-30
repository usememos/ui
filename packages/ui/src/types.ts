import type { ReactElement } from 'react';

/** Control size. One value sets height, padding, text, icon size and radius together. */
export type Size = 'sm' | 'md';

/** Status tone for components that report a status, such as Badge and toasts. */
export type Tone = 'neutral' | 'success' | 'warning' | 'danger';

/** A Lucide icon element, such as `<Pin />` from lucide-react. Size and stroke come from the component. */
export type IconElement = ReactElement;
