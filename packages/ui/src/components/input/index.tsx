import { Input as BaseInput } from '@base-ui/react/input';
import { forwardRef, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../../internal/class-name';
import { useRowSize } from '../../internal/size';
import type { Size } from '../../types';

export interface InputProps extends Omit<BaseInput.Props, 'size' | 'prefix' | 'className' | 'style'> {
  size?: Exclude<Size, 'xs'>;
  /** Says what the field is: a search or link icon. */
  prefix?: ReactNode;
  /** One action on the value (copy, clear), or a unit. */
  suffix?: ReactNode;
  /** Classes for the visible box around the input. */
  className?: string;
  /** Styles for the visible box around the input. */
  style?: CSSProperties;
}

export interface InputClassesOptions {
  size?: Exclude<Size, 'xs'>;
}

/**
 * The classes that make an element look like an Input's box. Use them on an
 * app's own one-line field, such as a tag input: focus inside the element
 * shows the ring, and `aria-invalid="true"` or `aria-disabled="true"` on it
 * shows those states. See docs/custom-components.md.
 */
export function inputClasses({ size = 'md' }: InputClassesOptions = {}) {
  return cx('mu-input-root', 'mu-base', `mu-s-${size}`);
}

/**
 * One line of text: flat `surface` with an `edge`. The ref and every other
 * prop go to the `<input>`; `className` and `style` go to the box around it.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ size, prefix, suffix, className, style, ...props }, ref) {
  const resolved = useRowSize(size);
  return (
    <span className={cx(inputClasses({ size: resolved }), className)} style={style}>
      {prefix !== undefined ? <span className="mu-input-prefix">{prefix}</span> : null}
      <BaseInput ref={ref} {...props} className="mu-input" />
      {suffix !== undefined ? <span className="mu-input-suffix">{suffix}</span> : null}
    </span>
  );
});
