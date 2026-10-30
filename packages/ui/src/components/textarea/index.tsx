import { Field as BaseField } from '@base-ui/react/field';
import { forwardRef } from 'react';
import { cx, withClass } from '../../internal/class-name';
import { useRowSize } from '../../internal/size';
import type { Size } from '../../types';

export interface TextareaProps extends Omit<BaseField.Control.Props, 'size' | 'render'> {
  size?: Exclude<Size, 'xs'>;
  /** Visible lines before it scrolls. Default 3. */
  rows?: number;
}

export interface TextareaClassesOptions {
  size?: Exclude<Size, 'xs'>;
}

/**
 * The classes that make an element look like a Textarea. Use them on an app's
 * own multi-line field, such as a content-editable editor: focus shows the
 * ring, and `aria-invalid="true"` or `aria-disabled="true"` show those states.
 * See docs/custom-components.md.
 */
export function textareaClasses({ size = 'md' }: TextareaClassesOptions = {}) {
  return cx('mu-textarea', 'mu-base', `mu-s-${size}`);
}

/** A few lines of plain text. Looks like Input. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ size, rows = 3, className, ...props }, ref) {
  const resolved = useRowSize(size);
  return (
    <BaseField.Control
      ref={ref as never}
      {...props}
      render={<textarea rows={rows} />}
      className={withClass(textareaClasses({ size: resolved }), className)}
    />
  );
});
