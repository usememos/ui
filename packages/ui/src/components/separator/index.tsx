import { Separator as BaseSeparator } from '@base-ui/react/separator';
import { forwardRef } from 'react';
import { withClass } from '../../internal/class-name';

export interface SeparatorProps extends BaseSeparator.Props {}

/** A 1px line between groups of content. */
export const Separator = forwardRef<HTMLDivElement, SeparatorProps>(function Separator({ className, ...props }, ref) {
  return <BaseSeparator ref={ref} {...props} className={withClass('mu-separator', className)} />;
});
