import { Toggle as BaseToggle } from '@base-ui/react/toggle';
import { forwardRef, type ReactNode } from 'react';
import { withClass } from '../../internal/class-name';
import { useSize } from '../../internal/size';
import type { IconElement, Size } from '../../types';

export interface ToggleProps extends BaseToggle.Props {
  size?: Size;
  /** A Lucide element before the label. With no children the toggle is square and needs `aria-label`. */
  icon?: IconElement;
  children?: ReactNode;
}

/** Turns one option on or off and stays pressed while on. Also the item of a ToggleGroup. */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle({ size, icon, className, children, ...props }, ref) {
  const resolved = useSize(size);
  const iconOnly = icon !== undefined && (children === undefined || children === null || children === false);
  return (
    <BaseToggle ref={ref} {...props} className={withClass(`mu-toggle${iconOnly ? ' mu-toggle-icon' : ''} mu-base mu-s-${resolved} mu-focus mu-hit`, className)}>
      {icon}
      {iconOnly ? null : <span className="mu-toggle-label">{children}</span>}
    </BaseToggle>
  );
});
