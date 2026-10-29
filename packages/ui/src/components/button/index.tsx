import { Button as BaseButton } from '@base-ui/react/button';
import { forwardRef, type ReactNode } from 'react';
import { cx, withClass } from '../../internal/class-name';
import { useSize } from '../../internal/size';
import type { IconElement, Size } from '../../types';

export type ButtonVariant = 'primary' | 'neutral' | 'ghost' | 'danger';

export interface ButtonProps extends BaseButton.Props {
  /** `primary` for the one action a view exists for, `neutral` for the rest, `ghost` in toolbars, `danger` to confirm a destructive action. */
  variant?: ButtonVariant;
  size?: Size;
  /** A Lucide element, before the label. With no children the button is square and needs `aria-label`. */
  icon?: IconElement;
  /** Keeps the width, shows a Spinner and ignores presses. */
  loading?: boolean;
  /** The accessible name while loading, such as "Saving". */
  loadingLabel?: string;
  children?: ReactNode;
}

export interface ButtonClassesOptions {
  variant?: ButtonVariant;
  size?: Size;
  /** A square button with only an icon. */
  iconOnly?: boolean;
}

/**
 * The classes that make an element look like a Button. Use them on a link
 * that should look like an action: `<a className={buttonClasses({ variant: 'primary' })} href="/start">`.
 */
export function buttonClasses({ variant = 'neutral', size = 'md', iconOnly = false }: ButtonClassesOptions = {}) {
  return cx('mu-button', `mu-button-${variant}`, iconOnly && 'mu-button-icon', 'mu-base', `mu-s-${size}`, 'mu-focus', 'mu-hit');
}

/** Starts an action. A raised key that sinks while pressed. */
export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  { variant = 'neutral', size, icon, loading = false, loadingLabel, disabled, focusableWhenDisabled, className, children, ...props },
  ref,
) {
  const resolved = useSize(size);
  const iconOnly = icon !== undefined && (children === undefined || children === null || children === false);
  return (
    <BaseButton
      ref={ref}
      {...props}
      {...(loading && loadingLabel ? { 'aria-label': loadingLabel } : null)}
      disabled={disabled || loading}
      focusableWhenDisabled={loading || focusableWhenDisabled}
      aria-busy={loading || undefined}
      data-loading={loading ? '' : undefined}
      className={withClass(buttonClasses({ variant, size: resolved, iconOnly }), className)}
    >
      {icon}
      {iconOnly ? null : <span className="mu-button-label">{children}</span>}
      {loading ? <span className="mu-spinner" aria-hidden /> : null}
    </BaseButton>
  );
});
