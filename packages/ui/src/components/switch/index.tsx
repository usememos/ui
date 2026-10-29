import { Switch as BaseSwitch } from '@base-ui/react/switch';
import { forwardRef } from 'react';
import { withClass } from '../../internal/class-name';
import { useSize } from '../../internal/size';
import type { Size } from '../../types';

export interface SwitchProps extends BaseSwitch.Root.Props {
  /** 18, 20 or 22px tall. */
  size?: Size;
}

/**
 * Turns a setting on or off at once. Name it with a `Field.Label` around it,
 * or `aria-label`.
 */
export const Switch = forwardRef<HTMLElement, SwitchProps>(function Switch({ size, className, ...props }, ref) {
  const resolved = useSize(size);
  return (
    <BaseSwitch.Root ref={ref} {...props} className={withClass(`mu-switch mu-s-${resolved} mu-focus mu-hit`, className)}>
      <BaseSwitch.Thumb className="mu-switch-thumb" />
    </BaseSwitch.Root>
  );
});
