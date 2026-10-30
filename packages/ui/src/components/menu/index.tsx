import { Menu as BaseMenu } from '@base-ui/react/menu';
import { Check, ChevronRight } from 'lucide-react';
import { forwardRef, type ReactNode } from 'react';
import { withClass } from '../../internal/class-name';
import { splitPositioner } from '../../internal/popup';
import { SizeContext, useRowSize } from '../../internal/size';
import type { IconElement, Size } from '../../types';

export interface RootProps extends BaseMenu.Root.Props {
  /** Row height of every item: 24, 32 or 40px. */
  size?: Exclude<Size, 'xs'>;
}

/** Groups a trigger and its menu. */
export function Root({ size, ...props }: RootProps) {
  const resolved = useRowSize(size);
  return (
    <SizeContext.Provider value={resolved}>
      <BaseMenu.Root {...props} />
    </SizeContext.Provider>
  );
}

export interface TriggerProps extends BaseMenu.Trigger.Props {}

/** Opens the menu. Usually `render={<Button variant="ghost" icon={<Ellipsis />} aria-label="More actions" />}`. */
export const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(function MenuTrigger({ className, ...props }, ref) {
  return <BaseMenu.Trigger ref={ref} {...props} className={withClass('mu-menu-trigger', className)} />;
});

type PositionerProps = Pick<
  BaseMenu.Positioner.Props,
  'side' | 'align' | 'collisionAvoidance' | 'collisionBoundary' | 'sticky' | 'anchor' | 'positionMethod' | 'disableAnchorTracking'
>;

export interface PopupProps extends BaseMenu.Popup.Props, PositionerProps {
  /** Where the menu is portaled to. Default `document.body`. */
  container?: BaseMenu.Portal.Props['container'];
}

/** The list of items. Also the popup of a submenu, inside `SubmenuRoot`. */
export const Popup = forwardRef<HTMLDivElement, PopupProps>(function MenuPopup({ container, className, ...props }, ref) {
  const size = useRowSize();
  const [positioner, rest] = splitPositioner(props);
  return (
    <BaseMenu.Portal container={container}>
      <BaseMenu.Positioner sideOffset={4} {...positioner} className="mu-positioner">
        <BaseMenu.Popup ref={ref} {...rest} className={withClass(`mu-menu-popup mu-popup mu-popup-motion mu-base mu-s-${size}`, className)} />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
});

interface RowProps {
  /** A Lucide element before the label. */
  icon?: IconElement;
  /** A keyboard shortcut at the end of the row, such as "⌘ D". */
  shortcut?: ReactNode;
  children?: ReactNode;
}

/** The shared inside of every row: icon, label, shortcut. */
function Row({ icon, shortcut, children }: RowProps) {
  return (
    <>
      {icon}
      <span className="mu-menu-label">{children}</span>
      {shortcut !== undefined ? <span className="mu-menu-shortcut">{shortcut}</span> : null}
    </>
  );
}

export interface ItemProps extends BaseMenu.Item.Props, RowProps {
  /** A destructive action: red text. Put it last, after a Separator. */
  danger?: boolean;
}

/** One action. */
export const Item = forwardRef<HTMLDivElement, ItemProps>(function MenuItem({ icon, shortcut, danger = false, className, children, ...props }, ref) {
  return (
    <BaseMenu.Item ref={ref} {...props} className={withClass(`mu-menu-item${danger ? ' mu-menu-item-danger' : ''}`, className)}>
      <Row icon={icon} shortcut={shortcut}>
        {children}
      </Row>
    </BaseMenu.Item>
  );
});

export interface CheckboxItemProps extends BaseMenu.CheckboxItem.Props, RowProps {}

/** An option that turns on or off, with a check at the end. Stays open on click. */
export const CheckboxItem = forwardRef<HTMLDivElement, CheckboxItemProps>(function MenuCheckboxItem({ icon, shortcut, className, children, ...props }, ref) {
  return (
    <BaseMenu.CheckboxItem ref={ref} {...props} className={withClass('mu-menu-item mu-menu-checkbox-item', className)}>
      <Row icon={icon} shortcut={shortcut}>
        {children}
      </Row>
      <span className="mu-menu-indicator">
        <BaseMenu.CheckboxItemIndicator render={<Check aria-hidden />} />
      </span>
    </BaseMenu.CheckboxItem>
  );
});

export interface RadioGroupProps extends BaseMenu.RadioGroup.Props {}

/** Groups RadioItems: exactly one is chosen. */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function MenuRadioGroup({ className, ...props }, ref) {
  return <BaseMenu.RadioGroup ref={ref} {...props} className={withClass('mu-menu-radio-group', className)} />;
});

export interface RadioItemProps extends BaseMenu.RadioItem.Props, RowProps {}

/** One choice in a RadioGroup, with a check at the end when chosen. Stays open on click. */
export const RadioItem = forwardRef<HTMLDivElement, RadioItemProps>(function MenuRadioItem({ icon, shortcut, className, children, ...props }, ref) {
  return (
    <BaseMenu.RadioItem ref={ref} {...props} className={withClass('mu-menu-item mu-menu-radio-item', className)}>
      <Row icon={icon} shortcut={shortcut}>
        {children}
      </Row>
      <span className="mu-menu-indicator">
        <BaseMenu.RadioItemIndicator render={<Check aria-hidden />} />
      </span>
    </BaseMenu.RadioItem>
  );
});

export interface GroupProps extends BaseMenu.Group.Props {}

/** A labeled set of items. */
export const Group = forwardRef<HTMLDivElement, GroupProps>(function MenuGroup({ className, ...props }, ref) {
  return <BaseMenu.Group ref={ref} {...props} className={withClass('mu-menu-group', className)} />;
});

export interface GroupLabelProps extends BaseMenu.GroupLabel.Props {}

/** The name of a Group or RadioGroup. */
export const GroupLabel = forwardRef<HTMLDivElement, GroupLabelProps>(function MenuGroupLabel({ className, ...props }, ref) {
  return <BaseMenu.GroupLabel ref={ref} {...props} className={withClass('mu-menu-group-label mu-label-sm', className)} />;
});

export interface SeparatorProps extends BaseMenu.Separator.Props {}

/** A line between groups of items. */
export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function MenuSeparator({ className, ...props }, ref) {
  return <BaseMenu.Separator ref={ref} {...props} className={withClass('mu-menu-separator', className)} />;
});

export type SubmenuRootProps = BaseMenu.SubmenuRoot.Props;

/** Holds a SubmenuTrigger and its own Popup. */
export const SubmenuRoot = BaseMenu.SubmenuRoot;

export interface SubmenuTriggerProps extends BaseMenu.SubmenuTrigger.Props {
  icon?: IconElement;
  children?: ReactNode;
}

/** The row that opens a submenu, with a chevron at the end. */
export const SubmenuTrigger = forwardRef<HTMLDivElement, SubmenuTriggerProps>(function MenuSubmenuTrigger({ icon, className, children, ...props }, ref) {
  return (
    <BaseMenu.SubmenuTrigger ref={ref} {...props} className={withClass('mu-menu-item mu-menu-submenu-trigger', className)}>
      <Row icon={icon}>{children}</Row>
      <ChevronRight className="mu-menu-chevron" aria-hidden />
    </BaseMenu.SubmenuTrigger>
  );
});
