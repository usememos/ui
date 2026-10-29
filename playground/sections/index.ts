import type { ComponentType } from 'react';
import type { Size } from '@usememos/ui';
import { AvatarSection } from './avatar';
import { BadgeSection } from './badge';
import { ButtonSection } from './button';
import { KbdSection } from './kbd';
import { LinkSection } from './link';
import { SeparatorSection } from './separator';
import { SkeletonSection } from './skeleton';
import { SpinnerSection } from './spinner';

/** Props every playground section gets: the size picked in the header. */
export interface SectionProps {
  size: Size;
}

/**
 * One entry per component, in inventory order. Each component's file in this
 * folder is named like its folder in packages/ui/src/components and shows
 * every variant and state.
 */
export const sections: { name: string; title: string; Section: ComponentType<SectionProps> }[] = [
  { name: 'button', title: 'Button', Section: ButtonSection },
  { name: 'link', title: 'Link', Section: LinkSection },
  { name: 'avatar', title: 'Avatar', Section: AvatarSection },
  { name: 'badge', title: 'Badge', Section: BadgeSection },
  { name: 'kbd', title: 'Kbd', Section: KbdSection },
  { name: 'separator', title: 'Separator', Section: SeparatorSection },
  { name: 'spinner', title: 'Spinner', Section: SpinnerSection },
  { name: 'skeleton', title: 'Skeleton', Section: SkeletonSection },
];
