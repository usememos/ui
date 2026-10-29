import { Input as BaseInput } from '@base-ui/react/input';
import { forwardRef, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../../internal/class-name';
import { useSize } from '../../internal/size';
import type { Size } from '../../types';

export interface InputProps extends Omit<BaseInput.Props, 'size' | 'prefix' | 'className' | 'style'> {
  size?: Size;
  /** Says what the field is: a search or link icon. */
  prefix?: ReactNode;
  /** One action on the value (copy, clear), or a unit. */
  suffix?: ReactNode;
  /** Classes for the visible box around the input. */
  className?: string;
  /** Styles for the visible box around the input. */
  style?: CSSProperties;
}

/**
 * One line of text: flat `surface` with an `edge`. The ref and every other
 * prop go to the `<input>`; `className` and `style` go to the box around it.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ size, prefix, suffix, className, style, ...props }, ref) {
  const resolved = useSize(size);
  return (
    <span className={cx('mu-input-root mu-base', `mu-s-${resolved}`, className)} style={style}>
      {prefix !== undefined ? <span className="mu-input-prefix">{prefix}</span> : null}
      <BaseInput ref={ref} {...props} className="mu-input" />
      {suffix !== undefined ? <span className="mu-input-suffix">{suffix}</span> : null}
    </span>
  );
});
