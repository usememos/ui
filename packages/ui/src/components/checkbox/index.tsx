import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { Check, Minus } from 'lucide-react';
import { forwardRef } from 'react';
import { withClass } from '../../internal/class-name';
import { useSize } from '../../internal/size';
import type { Size } from '../../types';

export interface CheckboxProps extends BaseCheckbox.Root.Props {
  /** Box: 16, 18 or 20px. */
  size?: Size;
}

/**
 * Includes or excludes one item, saved with a form. Name it with a
 * `Field.Label` around it, or `aria-label`.
 */
export const Checkbox = forwardRef<HTMLElement, CheckboxProps>(function Checkbox({ size, className, ...props }, ref) {
  const resolved = useSize(size);
  return (
    <BaseCheckbox.Root ref={ref} {...props} className={withClass(`mu-checkbox mu-s-${resolved} mu-focus mu-hit`, className)}>
      <BaseCheckbox.Indicator
        className="mu-checkbox-indicator"
        render={(indicatorProps, state) => (
          <span {...indicatorProps}>{state.indeterminate ? <Minus aria-hidden /> : <Check aria-hidden />}</span>
        )}
      />
    </BaseCheckbox.Root>
  );
});
