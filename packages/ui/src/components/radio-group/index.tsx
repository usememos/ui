import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseRadioGroup } from '@base-ui/react/radio-group';
import { forwardRef } from 'react';
import { withClass } from '../../internal/class-name';
import { SizeContext, useSize } from '../../internal/size';
import type { Size } from '../../types';

export interface RadioGroupProps extends BaseRadioGroup.Props {
  size?: Size;
  /** How the radios are laid out. Default `vertical`. */
  orientation?: 'vertical' | 'horizontal';
}

/** Exactly one option from a short list that is always visible. Holds Radio items, each inside a Field.Label. */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup({ size, orientation = 'vertical', className, ...props }, ref) {
  const resolved = useSize(size);
  return (
    <SizeContext.Provider value={resolved}>
      <BaseRadioGroup
        ref={ref}
        aria-orientation={orientation}
        {...props}
        data-orientation={orientation}
        className={withClass(`mu-radio-group mu-s-${resolved}`, className)}
      />
    </SizeContext.Provider>
  );
});

export interface RadioProps extends BaseRadio.Root.Props {
  size?: Size;
}

/** One option: a round well that becomes a flat primary circle with a dot. */
export const Radio = forwardRef<HTMLElement, RadioProps>(function Radio({ size, className, ...props }, ref) {
  const resolved = useSize(size);
  return (
    <BaseRadio.Root ref={ref} {...props} className={withClass(`mu-radio mu-s-${resolved} mu-focus mu-hit`, className)}>
      <BaseRadio.Indicator className="mu-radio-indicator" />
    </BaseRadio.Root>
  );
});
