import { Menu as BaseMenu } from '@base-ui/react/menu';
import { Check, ChevronRight } from 'lucide-react';
import { createContext, forwardRef, useCallback, useContext, useId, useRef, type ReactNode } from 'react';
import { cx, withClass } from '../../internal/class-name';
import { splitPositioner } from '../../internal/popup';
import { SizeContext, useRowSize } from '../../internal/size';
import type { IconElement, Size } from '../../types';
import { menuClasses } from './classes';

const classes = /* @__PURE__ */ menuClasses();

export interface RootProps extends BaseMenu.Root.Props {
  /** Row height of every item: 24, 32 or 40px. */
  size?: Exclude<Size, 'xs'>;
}

/** True inside a SubmenuRoot, so its Popup lines up with the trigger row. */
const SubmenuContext = /* @__PURE__ */ createContext(false);

/** Groups a trigger and its menu. */
export function Root({ size, ...props }: RootProps) {
  const resolved = useRowSize(size);
  return (
    <SizeContext.Provider value={resolved}>
      <SubmenuContext.Provider value={false}>
        <BaseMenu.Root {...props} />
      </SubmenuContext.Provider>
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

/**
 * The list of items. Also the popup of a submenu, inside `SubmenuRoot`: there
 * it moves along the trigger by its own top padding (read when it is placed,
 * so it follows `space-1`), which lines its first row up with the trigger row,
 * or its last row when it opens upward.
 */
export const Popup = forwardRef<HTMLDivElement, PopupProps>(function MenuPopup({ container, className, ...props }, ref) {
  const size = useRowSize();
  const submenu = useContext(SubmenuContext);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      popupRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );
  // Base UI reverses the sign when the submenu aligns to the trigger's end, so one value serves both.
  const alignOffset = useCallback(() => {
    const popup = popupRef.current;
    return popup ? -parseFloat(getComputedStyle(popup).paddingTop) || 0 : 0;
  }, []);
  const [positioner, rest] = splitPositioner(props);
  return (
    <BaseMenu.Portal container={container}>
      <BaseMenu.Positioner sideOffset={4} alignOffset={submenu ? alignOffset : 0} {...positioner} className="mu-positioner">
        <BaseMenu.Popup ref={setRef} {...rest} className={withClass(menuClasses({ size }).popup, className)} />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
});

interface RowProps {
  /** A Lucide element before the label. */
  icon?: IconElement;
  /** A keyboard shortcut at the end of the row, such as "⌘ D". */
  shortcut?: ReactNode;
  /** A line of `ink-muted` text under the label, which makes the row two lines tall. Screen readers read it as the item's description. */
  description?: ReactNode;
  children?: ReactNode;
}

/**
 * The shared inside of every row: icon, label, shortcut. With a description,
 * the label and description stack, and the item is named by the label and
 * described by the description.
 */
function useRow({ icon, shortcut, description, children }: RowProps) {
  const id = useId();
  const hasDescription = description !== undefined && description !== null && description !== false;
  const label = <span className={classes.label} id={hasDescription ? `${id}-label` : undefined}>{children}</span>;
  const content = (
    <>
      {icon}
      {hasDescription ? (
        <span className={classes.text}>
          {label}
          <span className={classes.description} id={`${id}-description`}>{description}</span>
        </span>
      ) : (
        label
      )}
      {shortcut !== undefined ? <span className={classes.shortcut}>{shortcut}</span> : null}
    </>
  );
  const aria = hasDescription ? { 'aria-labelledby': `${id}-label`, 'aria-describedby': `${id}-description` } : null;
  return [content, aria] as const;
}

export interface ItemProps extends BaseMenu.Item.Props, RowProps {
  /** A destructive action: red text. Put it last, after a Separator. */
  danger?: boolean;
}

/** One action. */
export const Item = forwardRef<HTMLDivElement, ItemProps>(function MenuItem({ icon, shortcut, description, danger = false, className, children, ...props }, ref) {
  const [row, aria] = useRow({ icon, shortcut, description, children });
  return (
    <BaseMenu.Item ref={ref} {...aria} {...props} className={withClass(danger ? classes.dangerItem : classes.item, className)}>
      {row}
    </BaseMenu.Item>
  );
});

export interface CheckboxItemProps extends BaseMenu.CheckboxItem.Props, RowProps {}

/** An option that turns on or off, with a check at the end. Stays open on click. */
export const CheckboxItem = forwardRef<HTMLDivElement, CheckboxItemProps>(function MenuCheckboxItem({ icon, shortcut, description, className, children, ...props }, ref) {
  const [row, aria] = useRow({ icon, shortcut, description, children });
  return (
    <BaseMenu.CheckboxItem ref={ref} {...aria} {...props} className={withClass(cx(classes.item, 'mu-menu-checkbox-item'), className)}>
      {row}
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
export const RadioItem = forwardRef<HTMLDivElement, RadioItemProps>(function MenuRadioItem({ icon, shortcut, description, className, children, ...props }, ref) {
  const [row, aria] = useRow({ icon, shortcut, description, children });
  return (
    <BaseMenu.RadioItem ref={ref} {...aria} {...props} className={withClass(cx(classes.item, 'mu-menu-radio-item'), className)}>
      {row}
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
  return <BaseMenu.GroupLabel ref={ref} {...props} className={withClass(classes.groupLabel, className)} />;
});

export interface SeparatorProps extends BaseMenu.Separator.Props {}

/** A line between groups of items. */
export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function MenuSeparator({ className, ...props }, ref) {
  return <BaseMenu.Separator ref={ref} {...props} className={withClass(classes.separator, className)} />;
});

export type SubmenuRootProps = BaseMenu.SubmenuRoot.Props;

/** Holds a SubmenuTrigger and its own Popup. */
export function SubmenuRoot(props: SubmenuRootProps) {
  return (
    <SubmenuContext.Provider value={true}>
      <BaseMenu.SubmenuRoot {...props} />
    </SubmenuContext.Provider>
  );
}

export interface SubmenuTriggerProps extends BaseMenu.SubmenuTrigger.Props {
  icon?: IconElement;
  children?: ReactNode;
}

/** The row that opens a submenu, with a chevron at the end. */
export const SubmenuTrigger = forwardRef<HTMLDivElement, SubmenuTriggerProps>(function MenuSubmenuTrigger({ icon, className, children, ...props }, ref) {
  const [row] = useRow({ icon, children });
  return (
    <BaseMenu.SubmenuTrigger ref={ref} {...props} className={withClass(cx(classes.item, 'mu-menu-submenu-trigger'), className)}>
      {row}
      <ChevronRight className="mu-menu-chevron" aria-hidden />
    </BaseMenu.SubmenuTrigger>
  );
});
