import { Button as BaseButton } from '@base-ui/react/button';
import { forwardRef, useEffect, useState, type ReactNode } from 'react';
import { cx, withClass } from '../../internal/class-name';
import { useSize } from '../../internal/size';
import type { ControlShape, IconElement, Size } from '../../types';

export type ButtonVariant = 'primary' | 'neutral' | 'ghost' | 'danger';

export interface ButtonProps extends BaseButton.Props {
  /** `primary` for the one action a view exists for, `neutral` for the rest, `ghost` in toolbars, `danger` to confirm a destructive action. */
  variant?: ButtonVariant;
  size?: Size;
  shape?: ControlShape;
  /** A Lucide element, before the label. With no children the button is square and needs `aria-label`. */
  icon?: IconElement;
  /** A Lucide element after the label, such as a chevron or an arrow that says where the action leads. */
  iconEnd?: IconElement;
  /** Ignores presses immediately; after 300ms, shows a Spinner in place of an icon, or before a label that has no icon. */
  loading?: boolean;
  /** Accessible loading feedback, such as "Saving": a description for text buttons, or a name for icon-only buttons. */
  loadingLabel?: string;
  children?: ReactNode;
}

export interface ButtonClassesOptions {
  variant?: ButtonVariant;
  size?: Size;
  shape?: ControlShape;
  /** A square button with only an icon. */
  iconOnly?: boolean;
}

/**
 * The classes that make an element look like a Button. Use them on a link
 * that should look like an action: `<a className={buttonClasses({ variant: 'primary' })} href="/start">`.
 */
export function buttonClasses({ variant = 'neutral', size = 'md', shape = 'default', iconOnly = false }: ButtonClassesOptions = {}) {
  return cx('mu-button', `mu-button-${variant}`, shape === 'pill' && 'mu-button-pill', iconOnly && 'mu-button-icon', 'mu-base', `mu-s-${size}`, 'mu-focus');
}

/** Starts an action. A flat control with shared pressed feedback. */
export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  { variant = 'neutral', size, shape, icon, iconEnd, loading, loadingLabel, disabled, focusableWhenDisabled, className, children, ...props },
  ref,
) {
  const resolved = useSize(size);
  const [showSpinner, setShowSpinner] = useState(false);
  useEffect(() => {
    if (!loading) {
      setShowSpinner(false);
      return;
    }
    const timer = setTimeout(() => setShowSpinner(true), 300);
    return () => clearTimeout(timer);
  }, [loading]);
  const loadingVisible = loading && showSpinner;
  const noLabel = children === undefined || children === null || children === false;
  const iconOnly = noLabel && (icon !== undefined || iconEnd !== undefined);
  // A text-only button has no icon to swap, so its Spinner goes before the label.
  const leadingSpinner = loadingVisible && (icon !== undefined || (iconEnd === undefined && !noLabel));
  const spinner = <span className="mu-spinner" aria-hidden />;
  return (
    <BaseButton
      ref={ref}
      {...props}
      {...(loading && loadingLabel ? (iconOnly ? { 'aria-label': loadingLabel } : { 'aria-description': loadingLabel }) : null)}
      disabled={disabled || loading}
      focusableWhenDisabled={loading || focusableWhenDisabled}
      aria-busy={loading || undefined}
      data-loading={loading ? '' : undefined}
      data-loading-visible={loadingVisible ? '' : undefined}
      className={withClass(buttonClasses({ variant, size: resolved, shape, iconOnly }), className)}
    >
      {leadingSpinner ? spinner : icon}
      {iconOnly ? null : <span className="mu-button-label">{children}</span>}
      {iconOnly && icon !== undefined ? null : loadingVisible && iconEnd !== undefined && icon === undefined ? spinner : iconEnd}
    </BaseButton>
  );
});
