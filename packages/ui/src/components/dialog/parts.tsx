import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import { X } from 'lucide-react';
import { forwardRef, type HTMLAttributes } from 'react';
import { cx, withClass } from '../../internal/class-name';
import { Button } from '../button';

export type RootProps = BaseDialog.Root.Props;
export interface TriggerProps extends BaseDialog.Trigger.Props {}
export interface PopupProps extends BaseDialog.Popup.Props {
  /** Where the dialog is portaled to. Default `document.body`. */
  container?: BaseDialog.Portal.Props['container'];
  /** Below `breakpoint-sm` the dialog becomes a sheet from the bottom. `false` keeps it centered. Default true. */
  sheet?: boolean;
}
export interface TitleProps extends BaseDialog.Title.Props {}
export interface DescriptionProps extends BaseDialog.Description.Props {}
export interface CloseProps extends BaseDialog.Close.Props {}
export interface FooterProps extends HTMLAttributes<HTMLDivElement> {}

/**
 * Builds the styled parts on Base UI's Dialog or AlertDialog, which share
 * their anatomy. `closeButton` adds the X at the top right of the popup.
 */
export function createDialogParts(Base: typeof BaseDialog, name: 'dialog' | 'alert-dialog', closeButton: boolean) {
  const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(function DialogTrigger({ className, ...props }, ref) {
    return <Base.Trigger ref={ref} {...props} className={withClass(`mu-${name}-trigger`, className)} />;
  });

  const Popup = forwardRef<HTMLDivElement, PopupProps & { closeLabel?: string }>(function DialogPopup(
    { container, sheet = true, closeLabel = 'Close', className, children, ...props },
    ref,
  ) {
    return (
      <Base.Portal container={container}>
        <Base.Backdrop className="mu-dialog-backdrop" />
        <Base.Viewport className={cx('mu-dialog-viewport', sheet && 'mu-dialog-sheet')}>
          <Base.Popup ref={ref} {...props} className={withClass(`mu-dialog-popup mu-${name}-popup mu-popup mu-base mu-s-md`, className)}>
            {children}
            {closeButton ? (
              <Base.Close className="mu-dialog-x" render={<Button variant="ghost" size="sm" icon={<X />} aria-label={closeLabel} />} />
            ) : null}
          </Base.Popup>
        </Base.Viewport>
      </Base.Portal>
    );
  });

  const Title = forwardRef<HTMLHeadingElement, TitleProps>(function DialogTitle({ className, ...props }, ref) {
    return <Base.Title ref={ref} {...props} className={withClass('mu-dialog-title mu-title', className)} />;
  });

  const Description = forwardRef<HTMLParagraphElement, DescriptionProps>(function DialogDescription({ className, ...props }, ref) {
    return <Base.Description ref={ref} {...props} className={withClass('mu-dialog-description mu-body', className)} />;
  });

  const Close = forwardRef<HTMLButtonElement, CloseProps>(function DialogClose({ className, ...props }, ref) {
    return <Base.Close ref={ref} {...props} className={withClass(`mu-${name}-close`, className)} />;
  });

  const Footer = forwardRef<HTMLDivElement, FooterProps>(function DialogFooter({ className, ...props }, ref) {
    return <div ref={ref} {...props} className={cx('mu-dialog-footer', className)} />;
  });

  return { Root: Base.Root, Trigger, Popup, Title, Description, Close, Footer };
}
