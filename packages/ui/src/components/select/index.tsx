import { Select as BaseSelect } from '@base-ui/react/select';
import { Check, ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react';
import { forwardRef, type ReactNode } from 'react';
import { withClass } from '../../internal/class-name';
import { splitPositioner } from '../../internal/popup';
import { SizeContext, useRowSize } from '../../internal/size';
import type { IconElement, Size } from '../../types';
import { buttonClasses } from '../button';

export type RootProps<Value, Multiple extends boolean | undefined = false> = BaseSelect.Root.Props<Value, Multiple> & {
  size?: Exclude<Size, 'xs'>;
};

/** Groups the trigger and the list, and holds the value. Pass `items` so `Value` shows labels, not raw values. */
export function Root<Value, Multiple extends boolean | undefined = false>({ size, ...props }: RootProps<Value, Multiple>) {
  const resolved = useRowSize(size);
  return (
    <SizeContext.Provider value={resolved}>
      <BaseSelect.Root {...props} />
    </SizeContext.Provider>
  );
}

export interface TriggerProps extends BaseSelect.Trigger.Props {}

/** A neutral key that shows the value, with a chevron at the end. Holds `Value`. */
export const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(function SelectTrigger({ className, children, ...props }, ref) {
  const size = useRowSize();
  return (
    <BaseSelect.Trigger ref={ref} {...props} className={withClass(`mu-select-trigger ${buttonClasses({ variant: 'neutral', size })}`, className)}>
      {children}
      <BaseSelect.Icon className="mu-select-icon">
        <ChevronsUpDown aria-hidden />
      </BaseSelect.Icon>
    </BaseSelect.Trigger>
  );
});

export interface ValueProps extends BaseSelect.Value.Props {}

/** The chosen item's label, or `placeholder` in `ink-muted`. */
export const Value = forwardRef<HTMLSpanElement, ValueProps>(function SelectValue({ className, ...props }, ref) {
  return <BaseSelect.Value ref={ref} {...props} className={withClass('mu-select-value', className)} />;
});

type PositionerProps = Pick<
  BaseSelect.Positioner.Props,
  | 'side'
  | 'align'
  | 'collisionAvoidance'
  | 'collisionBoundary'
  | 'sticky'
  | 'anchor'
  | 'positionMethod'
  | 'disableAnchorTracking'
  | 'alignItemWithTrigger'
>;

export interface PopupProps extends BaseSelect.Popup.Props, PositionerProps {
  /** Where the list is portaled to. Default `document.body`. */
  container?: BaseSelect.Portal.Props['container'];
}

/**
 * The list of items. By default it opens over the trigger with the chosen
 * item on top of the value; `alignItemWithTrigger={false}` opens it below.
 */
export const Popup = forwardRef<HTMLDivElement, PopupProps>(function SelectPopup({ container, className, children, ...props }, ref) {
  const size = useRowSize();
  const [positioner, rest] = splitPositioner(props);
  return (
    <BaseSelect.Portal container={container}>
      <BaseSelect.Positioner sideOffset={4} {...positioner} className="mu-positioner mu-select-positioner">
        <BaseSelect.Popup ref={ref} {...rest} className={withClass(`mu-select-popup mu-popup mu-popup-motion mu-base mu-s-${size}`, className)}>
          <BaseSelect.ScrollUpArrow className="mu-select-scroll-arrow" render={(arrowProps) => <div {...arrowProps}><ChevronUp aria-hidden /></div>} />
          <BaseSelect.List className="mu-select-list">{children}</BaseSelect.List>
          <BaseSelect.ScrollDownArrow className="mu-select-scroll-arrow" render={(arrowProps) => <div {...arrowProps}><ChevronDown aria-hidden /></div>} />
        </BaseSelect.Popup>
      </BaseSelect.Positioner>
    </BaseSelect.Portal>
  );
});

export interface ItemProps extends BaseSelect.Item.Props {
  /** A Lucide element before the label. */
  icon?: IconElement;
  children?: ReactNode;
}

/** One option, with a check at the end when chosen. */
export const Item = forwardRef<HTMLDivElement, ItemProps>(function SelectItem({ icon, className, children, ...props }, ref) {
  return (
    <BaseSelect.Item ref={ref} {...props} className={withClass('mu-select-item', className)}>
      {icon}
      <BaseSelect.ItemText className="mu-select-item-text">{children}</BaseSelect.ItemText>
      <span className="mu-select-indicator">
        {/* The empty children replace Base UI's default "✔️" text inside the svg. */}
        <BaseSelect.ItemIndicator render={<Check aria-hidden />}>{null}</BaseSelect.ItemIndicator>
      </span>
    </BaseSelect.Item>
  );
});

export interface GroupProps extends BaseSelect.Group.Props {}

/** A labeled set of items. */
export const Group = forwardRef<HTMLDivElement, GroupProps>(function SelectGroup({ className, ...props }, ref) {
  return <BaseSelect.Group ref={ref} {...props} className={withClass('mu-select-group', className)} />;
});

export interface GroupLabelProps extends BaseSelect.GroupLabel.Props {}

/** The name of a Group. */
export const GroupLabel = forwardRef<HTMLDivElement, GroupLabelProps>(function SelectGroupLabel({ className, ...props }, ref) {
  return <BaseSelect.GroupLabel ref={ref} {...props} className={withClass('mu-select-group-label mu-label-sm', className)} />;
});

export interface SeparatorProps extends BaseSelect.Separator.Props {}

/** A line between groups of items. */
export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function SelectSeparator({ className, ...props }, ref) {
  return <BaseSelect.Separator ref={ref} {...props} className={withClass('mu-select-separator', className)} />;
});
