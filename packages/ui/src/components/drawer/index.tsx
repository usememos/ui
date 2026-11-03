import { useDirection } from '@base-ui/react/direction-provider';
import { Drawer as BaseDrawer } from '@base-ui/react/drawer';
import { X } from 'lucide-react';
import { createContext, forwardRef, useContext } from 'react';
import { cx, withClass } from '../../internal/class-name';
import { SizeContext } from '../../internal/size';
import { Button } from '../button';

/** The edge a drawer slides from. `start` and `end` follow the text direction. */
export type DrawerSide = 'start' | 'end' | 'bottom';

type Edge = 'left' | 'right' | 'bottom';

const EdgeContext = createContext<Edge>('right');

export interface RootProps extends Omit<BaseDrawer.Root.Props, 'swipeDirection' | 'snapPoints' | 'defaultSnapPoint' | 'snapPoint' | 'onSnapPointChange' | 'snapToSequentialPoints'> {
  /** The edge it slides from, and swipes back to. `start` is the left edge in a left-to-right page. Default `end`. */
  side?: DrawerSide;
}

/** Groups a trigger and its drawer. Controlled with `open` and `onOpenChange`. */
export function Root({ side = 'end', ...props }: RootProps) {
  const direction = useDirection();
  const edge: Edge = side === 'bottom' ? 'bottom' : (side === 'start') === (direction === 'rtl') ? 'right' : 'left';
  const swipeDirection = edge === 'bottom' ? 'down' : edge;
  return (
    <EdgeContext.Provider value={edge}>
      <BaseDrawer.Root {...props} swipeDirection={swipeDirection} />
    </EdgeContext.Provider>
  );
}

export interface TriggerProps extends BaseDrawer.Trigger.Props {}

/** Opens the drawer. Usually `render={<Button />}`. */
export const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(function DrawerTrigger({ className, ...props }, ref) {
  return <BaseDrawer.Trigger ref={ref} {...props} className={withClass('mu-drawer-trigger', className)} />;
});

export interface PopupProps extends BaseDrawer.Popup.Props {
  /** Where the drawer is portaled to. Default `document.body`. */
  container?: BaseDrawer.Portal.Props['container'];
  /**
   * `panel` (default) pads the content `space-5`, stacks it `space-4` apart
   * and adds the X. `bare` has no padding, gap or X, for content that lays
   * itself out, such as an app's navigation sidebar: its content is exactly
   * the drawer's height, so the app's own region scrolls, and its Close is
   * for screen readers only.
   */
  variant?: 'panel' | 'bare';
  /** The accessible name of the X, or of the screen-reader Close in `bare`. Default "Close". */
  closeLabel?: string;
}

/**
 * The panel against one edge of the screen, over a dimmed backdrop, full
 * height (or full width from the bottom). Swipe it back to its edge to close.
 */
export const Popup = forwardRef<HTMLDivElement, PopupProps>(function DrawerPopup(
  { container, variant = 'panel', closeLabel = 'Close', className, children, ...props },
  ref,
) {
  const edge = useContext(EdgeContext);
  const bare = variant === 'bare';
  return (
    <BaseDrawer.Portal container={container}>
      <BaseDrawer.Backdrop className="mu-drawer-backdrop" />
      <BaseDrawer.Viewport className={`mu-drawer-viewport mu-drawer-${edge}`}>
        <BaseDrawer.Popup ref={ref} {...props} className={withClass(cx('mu-drawer-popup', bare && 'mu-drawer-bare', 'mu-base mu-s-md'), className)}>
          {/* Content keeps text selectable with a mouse instead of starting a swipe. */}
          <BaseDrawer.Content className="mu-drawer-content">
            {/* A drawer is md wherever it is declared, as a Dialog is. */}
            <SizeContext.Provider value="md">{children}</SizeContext.Provider>
          </BaseDrawer.Content>
          {bare ? (
            /* No X on screen, but screen reader users on touch screens, who can't press Escape or swipe, still find a Close. Out of the tab order: keyboards have Escape. */
            <BaseDrawer.Close className="mu-drawer-sr-close mu-visually-hidden" tabIndex={-1}>
              {closeLabel}
            </BaseDrawer.Close>
          ) : (
            <BaseDrawer.Close className="mu-drawer-x" render={<Button variant="ghost" size="sm" icon={<X />} aria-label={closeLabel} />} />
          )}
        </BaseDrawer.Popup>
      </BaseDrawer.Viewport>
    </BaseDrawer.Portal>
  );
});

export interface TitleProps extends BaseDrawer.Title.Props {}

/** The drawer's heading, an `<h2>`. Names it for screen readers; hide it with `mu-visually-hidden` when the content names itself. */
export const Title = forwardRef<HTMLHeadingElement, TitleProps>(function DrawerTitle({ className, ...props }, ref) {
  return <BaseDrawer.Title ref={ref} {...props} className={withClass('mu-drawer-title mu-title', className)} />;
});

export interface DescriptionProps extends BaseDrawer.Description.Props {}

/** A `<p>` under the title. */
export const Description = forwardRef<HTMLParagraphElement, DescriptionProps>(function DrawerDescription({ className, ...props }, ref) {
  return <BaseDrawer.Description ref={ref} {...props} className={withClass('mu-drawer-description mu-body', className)} />;
});

export interface CloseProps extends BaseDrawer.Close.Props {}

/** Closes the drawer, such as a link in a navigation drawer. Usually `render={<Button />}`. */
export const Close = forwardRef<HTMLButtonElement, CloseProps>(function DrawerClose({ className, ...props }, ref) {
  return <BaseDrawer.Close ref={ref} {...props} className={withClass('mu-drawer-close', className)} />;
});
