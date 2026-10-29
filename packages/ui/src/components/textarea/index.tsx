import { Field as BaseField } from '@base-ui/react/field';
import { forwardRef } from 'react';
import { withClass } from '../../internal/class-name';
import { useSize } from '../../internal/size';
import type { Size } from '../../types';

export interface TextareaProps extends Omit<BaseField.Control.Props, 'size' | 'render'> {
  size?: Size;
  /** Visible lines before it scrolls. Default 3. */
  rows?: number;
}

/** A few lines of plain text. Looks like Input. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ size, rows = 3, className, ...props }, ref) {
  const resolved = useSize(size);
  return (
    <BaseField.Control
      ref={ref as never}
      {...props}
      render={<textarea rows={rows} />}
      className={withClass(`mu-textarea mu-base mu-s-${resolved}`, className)}
    />
  );
});
