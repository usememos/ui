import { Tooltip as BaseTooltip } from '@base-ui/react/tooltip';
import { forwardRef, type ReactNode } from 'react';
import { withClass } from '../../internal/class-name';
import { splitPositioner } from '../../internal/popup';

export type ProviderProps = BaseTooltip.Provider.Props;

/** Shares the hover delay between tooltips, so moving from one trigger to the next opens at once. */
export const Provider = BaseTooltip.Provider;

export type RootProps = BaseTooltip.Root.Props;

/** Groups a trigger and its tooltip. */
export const Root = BaseTooltip.Root;

export interface TriggerProps extends BaseTooltip.Trigger.Props {
  /** Hover time before the tooltip opens, in ms. Default 400. */
  delay?: number;
}

/** The control the tooltip names. Usually `render={<Button icon={...} aria-label="..." />}`. */
export const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(function TooltipTrigger({ delay = 400, className, ...props }, ref) {
  return <BaseTooltip.Trigger ref={ref} delay={delay} {...props} className={withClass('mu-tooltip-trigger', className)} />;
});

type PositionerProps = Pick<
  BaseTooltip.Positioner.Props,
  'side' | 'align' | 'sideOffset' | 'alignOffset' | 'collisionPadding' | 'collisionAvoidance' | 'collisionBoundary' | 'sticky' | 'anchor' | 'positionMethod' | 'disableAnchorTracking'
>;

export interface PopupProps extends BaseTooltip.Popup.Props, PositionerProps {
  /** A keyboard shortcut shown after the label, such as "⌘ K". */
  shortcut?: ReactNode;
  /** Where the tooltip is portaled to. Default `document.body`. */
  container?: BaseTooltip.Portal.Props['container'];
}

/** The label: two or three words, the same text as the trigger's `aria-label`. */
export const Popup = forwardRef<HTMLDivElement, PopupProps>(function TooltipPopup({ container, shortcut, className, children, ...props }, ref) {
  const [positioner, rest] = splitPositioner(props);
  return (
    <BaseTooltip.Portal container={container}>
      <BaseTooltip.Positioner sideOffset={6} {...positioner} className="mu-positioner">
        <BaseTooltip.Popup ref={ref} {...rest} className={withClass('mu-tooltip-popup mu-popup-motion mu-label-sm', className)}>
          {children}
          {shortcut !== undefined ? <span className="mu-tooltip-shortcut">{shortcut}</span> : null}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  );
});
