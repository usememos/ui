import type { ComponentType } from 'react';
import type { Size } from '@usememos/ui';
import { AvatarSection } from './avatar';
import { BadgeSection } from './badge';
import { ButtonSection } from './button';
import { CheckboxSection } from './checkbox';
import { DialogSection } from './dialog';
import { FieldSection } from './field';
import { InputSection } from './input';
import { KbdSection } from './kbd';
import { LinkSection } from './link';
import { MenuSection } from './menu';
import { PopoverSection } from './popover';
import { RadioGroupSection } from './radio-group';
import { SelectSection } from './select';
import { SeparatorSection } from './separator';
import { SkeletonSection } from './skeleton';
import { SpinnerSection } from './spinner';
import { SwitchSection } from './switch';
import { TabsSection } from './tabs';
import { TextareaSection } from './textarea';
import { ToastSection } from './toast';
import { ToggleSection } from './toggle';
import { ToggleGroupSection } from './toggle-group';
import { TooltipSection } from './tooltip';

/** Props every playground section gets: the size from `?size=`. */
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
  { name: 'toggle', title: 'Toggle', Section: ToggleSection },
  { name: 'toggle-group', title: 'ToggleGroup', Section: ToggleGroupSection },
  { name: 'menu', title: 'Menu', Section: MenuSection },
  { name: 'link', title: 'Link', Section: LinkSection },
  { name: 'field', title: 'Field and Fieldset', Section: FieldSection },
  { name: 'input', title: 'Input', Section: InputSection },
  { name: 'textarea', title: 'Textarea', Section: TextareaSection },
  { name: 'checkbox', title: 'Checkbox', Section: CheckboxSection },
  { name: 'switch', title: 'Switch', Section: SwitchSection },
  { name: 'select', title: 'Select', Section: SelectSection },
  { name: 'radio-group', title: 'RadioGroup', Section: RadioGroupSection },
  { name: 'tabs', title: 'Tabs', Section: TabsSection },
  { name: 'dialog', title: 'Dialog and AlertDialog', Section: DialogSection },
  { name: 'popover', title: 'Popover', Section: PopoverSection },
  { name: 'tooltip', title: 'Tooltip', Section: TooltipSection },
  { name: 'toast', title: 'Toast', Section: ToastSection },
  { name: 'avatar', title: 'Avatar', Section: AvatarSection },
  { name: 'badge', title: 'Badge', Section: BadgeSection },
  { name: 'kbd', title: 'Kbd', Section: KbdSection },
  { name: 'separator', title: 'Separator', Section: SeparatorSection },
  { name: 'spinner', title: 'Spinner', Section: SpinnerSection },
  { name: 'skeleton', title: 'Skeleton', Section: SkeletonSection },
];
