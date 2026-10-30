import { Fieldset as BaseFieldset } from '@base-ui/react/fieldset';
import { forwardRef } from 'react';
import { withClass } from '../../internal/class-name';
import { SizeContext, useRowSize } from '../../internal/size';
import type { Size } from '../../types';

export interface RootProps extends BaseFieldset.Root.Props {
  size?: Exclude<Size, 'xs'>;
}

/** A group of checkboxes, radios or switches with one legend. */
export const Root = forwardRef<HTMLFieldSetElement, RootProps>(function FieldsetRoot({ size, className, ...props }, ref) {
  const resolved = useRowSize(size);
  return (
    <SizeContext.Provider value={resolved}>
      <BaseFieldset.Root ref={ref} {...props} className={withClass('mu-fieldset-root', className)} />
    </SizeContext.Provider>
  );
});

export interface LegendProps extends BaseFieldset.Legend.Props {}

/** The group's name. */
export const Legend = forwardRef<HTMLDivElement, LegendProps>(function FieldsetLegend({ className, ...props }, ref) {
  return <BaseFieldset.Legend ref={ref} {...props} className={withClass('mu-fieldset-legend mu-label', className)} />;
});
