import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from '../../internal/class-name';

export interface ProseProps extends ComponentPropsWithoutRef<'div'> {
  /** `md` is 15px on a 24px line for reading; `sm` is 14px on 22px, for dense lists. */
  size?: 'sm' | 'md';
}

/**
 * Styles rendered Markdown inside it: headings, paragraphs, lists, task lists,
 * code, quotes, tables, images and links. Put the rendered HTML in it as
 * children. Without React, use the `mu-prose` class.
 */
export const Prose = forwardRef<HTMLDivElement, ProseProps>(function Prose({ size = 'md', className, ...props }, ref) {
  return <div ref={ref} {...props} className={cx('mu-prose', size === 'sm' && 'mu-prose-sm', className)} />;
});
