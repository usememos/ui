import type { ComponentType } from 'react';
import type { Size } from '@usememos/ui';

/** Props every playground section gets: the size picked in the header. */
export interface SectionProps {
  size: Size;
}

/**
 * One entry per component, in inventory order. Each component's file in this
 * folder is named like its folder in packages/ui/src/components and shows
 * every variant and state.
 */
export const sections: { name: string; title: string; Section: ComponentType<SectionProps> }[] = [];
