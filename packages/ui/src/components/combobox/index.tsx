import { Combobox as BaseCombobox } from '@base-ui/react/combobox';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { forwardRef, type CSSProperties, type ReactNode } from 'react';
import { cx, withClass } from '../../internal/class-name';
import { splitPositioner } from '../../internal/popup';
import { SizeContext, useSize } from '../../internal/size';
import type { IconElement, Size } from '../../types';

/** Renders the items of one group from grouped `items`, inside a Group. Base UI's part, unstyled. */
export const Collection = BaseCombobox.Collection;

/** Base UI's matcher for `filter`, with locale-aware `contains`, `startsWith` and `endsWith`. */
export const useFilter = BaseCombobox.useFilter;

export type RootProps<Value, Multiple extends boolean | undefined = false, Item = Value> = BaseCombobox.Root.Props<Value, Multiple, Item> & {
  size?: Size;
};

/**
 * Groups the input and the list, and holds the value. Pass `items` so the
 * list filters as people type and `Empty` knows when nothing matches.
 */
export function Root<Value, Multiple extends boolean | undefined = false, Item = Value>({ size, ...props }: RootProps<Value, Multiple, Item>) {
  const resolved = useSize(size);
  return (
    <SizeContext.Provider value={resolved}>
      <BaseCombobox.Root {...props} />
    </SizeContext.Provider>
  );
}

export interface InputProps extends Omit<BaseCombobox.Input.Props, 'size' | 'className' | 'style'> {
  /** A Lucide element at the start. Default a search icon; `null` drops it. */
  icon?: IconElement | null;
  /** The accessible name of the chevron that opens the list. Default "Show options". */
  triggerLabel?: string;
  /** Classes for the visible box around the input. */
  className?: string;
  /** Styles for the visible box around the input. */
  style?: CSSProperties;
}

/**
 * The text box people type in: an Input with a search icon and a chevron that
 * opens the list. The ref and every other prop go to the `<input>`;
 * `className` and `style` go to the box around it.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function ComboboxInput(
  { icon = <Search />, triggerLabel = 'Show options', className, style, ...props },
  ref,
) {
  const size = useSize();
  return (
    <BaseCombobox.InputGroup className={cx('mu-input-root mu-combobox-input-root mu-base', `mu-s-${size}`, className)} style={style}>
      {icon !== null ? <span className="mu-input-prefix">{icon}</span> : null}
      <BaseCombobox.Input ref={ref} {...props} className="mu-input" />
      <span className="mu-input-suffix">
        <BaseCombobox.Trigger className="mu-combobox-trigger mu-focus" aria-label={triggerLabel}>
          <ChevronsUpDown aria-hidden />
        </BaseCombobox.Trigger>
      </span>
    </BaseCombobox.InputGroup>
  );
});

type PositionerProps = Pick<
  BaseCombobox.Positioner.Props,
  | 'side'
  | 'align'
  | 'collisionAvoidance'
  | 'collisionBoundary'
  | 'sticky'
  | 'anchor'
  | 'positionMethod'
  | 'disableAnchorTracking'
>;

export interface PopupProps extends BaseCombobox.Popup.Props, PositionerProps {
  /** Where the list is portaled to. Default `document.body`. */
  container?: BaseCombobox.Portal.Props['container'];
}

/** The floating panel under the input. Holds `Empty` and `List`. */
export const Popup = forwardRef<HTMLDivElement, PopupProps>(function ComboboxPopup({ container, className, ...props }, ref) {
  const size = useSize();
  const [positioner, rest] = splitPositioner(props);
  return (
    <BaseCombobox.Portal container={container}>
      <BaseCombobox.Positioner sideOffset={4} align="start" {...positioner} className="mu-positioner">
        <BaseCombobox.Popup ref={ref} {...rest} className={withClass(`mu-combobox-popup mu-popup mu-popup-motion mu-base mu-s-${size}`, className)} />
      </BaseCombobox.Positioner>
    </BaseCombobox.Portal>
  );
});

export interface ListProps extends BaseCombobox.List.Props {}

/** The items. Pass a function child to render each of the root's filtered `items`. */
export const List = forwardRef<HTMLDivElement, ListProps>(function ComboboxList({ className, ...props }, ref) {
  return <BaseCombobox.List ref={ref} {...props} className={withClass('mu-combobox-list', className)} />;
});

export interface ItemProps extends BaseCombobox.Item.Props {
  /** A Lucide element before the label. */
  icon?: IconElement;
  children?: ReactNode;
}

/** One option, with a check at the end when chosen. */
export const Item = forwardRef<HTMLDivElement, ItemProps>(function ComboboxItem({ icon, className, children, ...props }, ref) {
  return (
    <BaseCombobox.Item ref={ref} {...props} className={withClass('mu-combobox-item', className)}>
      {icon}
      <span className="mu-combobox-item-text">{children}</span>
      <span className="mu-combobox-indicator">
        {/* The empty children replace Base UI's default "✔️" text inside the svg. */}
        <BaseCombobox.ItemIndicator render={<Check aria-hidden />}>{null}</BaseCombobox.ItemIndicator>
      </span>
    </BaseCombobox.Item>
  );
});

export interface EmptyProps extends BaseCombobox.Empty.Props {}

/** What shows when nothing matches, such as "No tags found". Always mounted, so screen readers hear it. */
export const Empty = forwardRef<HTMLDivElement, EmptyProps>(function ComboboxEmpty({ className, ...props }, ref) {
  return <BaseCombobox.Empty ref={ref} {...props} className={withClass('mu-combobox-empty mu-body', className)} />;
});

export interface GroupProps extends BaseCombobox.Group.Props {}

/** A labeled set of items. With grouped `items`, render its items with `Collection`. */
export const Group = forwardRef<HTMLDivElement, GroupProps>(function ComboboxGroup({ className, ...props }, ref) {
  return <BaseCombobox.Group ref={ref} {...props} className={withClass('mu-combobox-group', className)} />;
});

export interface GroupLabelProps extends BaseCombobox.GroupLabel.Props {}

/** The name of a Group. */
export const GroupLabel = forwardRef<HTMLDivElement, GroupLabelProps>(function ComboboxGroupLabel({ className, ...props }, ref) {
  return <BaseCombobox.GroupLabel ref={ref} {...props} className={withClass('mu-combobox-group-label mu-label-sm', className)} />;
});

export interface SeparatorProps extends BaseCombobox.Separator.Props {}

/** A line between groups of items. */
export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function ComboboxSeparator({ className, ...props }, ref) {
  return <BaseCombobox.Separator ref={ref} {...props} className={withClass('mu-combobox-separator', className)} />;
});
