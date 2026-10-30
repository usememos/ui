import { Toast as BaseToast } from '@base-ui/react/toast';
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from 'lucide-react';
import { forwardRef } from 'react';
import { cx, withClass } from '../../internal/class-name';
import type { Tone } from '../../types';
import { Button, buttonClasses } from '../button';

export type ProviderProps = BaseToast.Provider.Props;

/** Holds the toasts. Wrap the app in it once. `timeout` (default 5000ms) and `limit` (default 3) apply to every toast. */
export const Provider = BaseToast.Provider;

/**
 * Adds, updates and closes toasts: `add({ title, description, type, actionProps, timeout })`.
 * `type` is the tone: "success", "warning", "danger", or none for neutral.
 */
export const useToastManager = BaseToast.useToastManager;

/** A manager for code outside React. Pass it to `Provider` as `toastManager`. */
export const createToastManager = BaseToast.createToastManager;

export interface ViewportProps extends BaseToast.Viewport.Props {
  /** Where the toasts are portaled to. Default `document.body`. */
  container?: BaseToast.Portal.Props['container'];
  /** The accessible name of each toast's X button. Default "Close". */
  closeLabel?: string;
}

/** Shows the toasts: bottom-right, or bottom-center below `breakpoint-sm`. Render it once, inside Provider. */
export const Viewport = forwardRef<HTMLDivElement, ViewportProps>(function ToastViewport({ container, closeLabel = 'Close', className, ...props }, ref) {
  return (
    <BaseToast.Portal container={container}>
      <BaseToast.Viewport ref={ref} {...props} className={withClass('mu-toast-viewport', className)}>
        <ToastList closeLabel={closeLabel} />
      </BaseToast.Viewport>
    </BaseToast.Portal>
  );
});

const icons = { neutral: Info, success: CircleCheck, warning: TriangleAlert, danger: CircleAlert };

const toneOf = (type: string | undefined): Tone => (type === 'success' || type === 'warning' || type === 'danger' ? type : 'neutral');

function ToastList({ closeLabel }: { closeLabel: string }) {
  const { toasts } = BaseToast.useToastManager();
  return toasts.map((toast) => {
    const tone = toneOf(toast.type);
    const Icon = icons[tone];
    return (
      <BaseToast.Root key={toast.id} toast={toast} className={cx('mu-toast mu-popup mu-base mu-s-md', `mu-toast-${tone}`)}>
        <BaseToast.Content className="mu-toast-content">
          <Icon className="mu-toast-icon" aria-hidden />
          <div className="mu-toast-text">
            <BaseToast.Title className="mu-toast-title mu-label" />
            <BaseToast.Description className="mu-toast-description mu-caption" />
          </div>
          <BaseToast.Action className={cx('mu-toast-action', buttonClasses({ variant: 'neutral', size: 'sm' }))} />
          <BaseToast.Close className="mu-toast-close" render={<Button variant="ghost" size="sm" icon={<X />} aria-label={closeLabel} />} />
        </BaseToast.Content>
      </BaseToast.Root>
    );
  });
}
