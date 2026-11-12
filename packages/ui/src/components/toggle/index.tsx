import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import { forwardRef, type ReactNode } from 'react';
import { cx, withClass } from '../../internal/class-name';
import { useSize } from '../../internal/size';
import type { ControlShape, IconElement, Size } from '../../types';

export type ToggleVariant = 'ghost' | 'soft';

export interface ToggleProps extends BaseToggle.Props {
  size?: Size;
  /** `ghost` (default) is flat when off; `soft` keeps a quiet fill and a stronger saved-state fill. */
  variant?: ToggleVariant;
  shape?: ControlShape;
  /** A Lucide element before the label. With no children the toggle is square and needs `aria-label`. */
  icon?: IconElement;
  children?: ReactNode;
}

/** Turns one option on or off and stays pressed while on. Also the item of a ToggleGroup. */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle({ size, variant = 'ghost', shape = 'default', icon, className, children, ...props }, ref) {
  const resolved = useSize(size);
  const iconOnly = icon !== undefined && (children === undefined || children === null || children === false);
  const classes = cx('mu-toggle', variant === 'soft' && 'mu-toggle-soft', shape === 'pill' && 'mu-toggle-pill', iconOnly && 'mu-toggle-icon', 'mu-base', `mu-s-${resolved}`, 'mu-focus', 'mu-hit');
  return (
    <BaseToggle ref={ref} {...props} className={withClass(classes, className)}>
      {icon}
      {iconOnly ? null : <span className="mu-toggle-label">{children}</span>}
    </BaseToggle>
  );
});
