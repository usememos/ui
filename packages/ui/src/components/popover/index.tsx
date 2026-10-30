import { Popover as BasePopover } from '@base-ui/react/popover';
import { forwardRef } from 'react';
import { withClass } from '../../internal/class-name';
import { splitPositioner } from '../../internal/popup';

export type RootProps = BasePopover.Root.Props;

/** Groups a trigger and its popover. */
export const Root = BasePopover.Root;

export interface TriggerProps extends BasePopover.Trigger.Props {}

/** Opens the popover. Usually `render={<Button />}`. */
export const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(function PopoverTrigger({ className, ...props }, ref) {
  return <BasePopover.Trigger ref={ref} {...props} className={withClass('mu-popover-trigger', className)} />;
});

type PositionerProps = Pick<
  BasePopover.Positioner.Props,
  'side' | 'align' | 'collisionAvoidance' | 'collisionBoundary' | 'sticky' | 'anchor' | 'positionMethod' | 'disableAnchorTracking'
>;

export interface PopupProps extends BasePopover.Popup.Props, PositionerProps {
  /** Where the popover is portaled to. Default `document.body`. */
  container?: BasePopover.Portal.Props['container'];
}

/** The panel: a surface with `shadow-pop`, `popover-width` wide. */
export const Popup = forwardRef<HTMLDivElement, PopupProps>(function PopoverPopup({ container, className, ...props }, ref) {
  const [positioner, rest] = splitPositioner(props);
  return (
    <BasePopover.Portal container={container}>
      <BasePopover.Positioner sideOffset={6} {...positioner} className="mu-positioner">
        <BasePopover.Popup ref={ref} {...rest} className={withClass('mu-popover-popup mu-popup mu-popup-motion mu-base mu-s-md', className)} />
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
});

export interface TitleProps extends BasePopover.Title.Props {}

/** The popover's heading, an `<h2>`. Names the popup for screen readers. */
export const Title = forwardRef<HTMLHeadingElement, TitleProps>(function PopoverTitle({ className, ...props }, ref) {
  return <BasePopover.Title ref={ref} {...props} className={withClass('mu-popover-title mu-label', className)} />;
});

export interface DescriptionProps extends BasePopover.Description.Props {}

/** One line under the title, a `<p>`. */
export const Description = forwardRef<HTMLParagraphElement, DescriptionProps>(function PopoverDescription({ className, ...props }, ref) {
  return <BasePopover.Description ref={ref} {...props} className={withClass('mu-popover-description mu-caption', className)} />;
});

export interface CloseProps extends BasePopover.Close.Props {}

/** Closes the popover. Usually `render={<Button />}`. */
export const Close = forwardRef<HTMLButtonElement, CloseProps>(function PopoverClose({ className, ...props }, ref) {
  return <BasePopover.Close ref={ref} {...props} className={withClass('mu-popover-close', className)} />;
});
