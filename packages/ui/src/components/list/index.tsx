import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from '../../internal/class-name';
import { SizeContext, useRowSize } from '../../internal/size';
import type { Size } from '../../types';

export interface RootProps extends ComponentPropsWithoutRef<'ul'> {
  /** `sm` for dense lists. Sets the rows' padding and the size of the controls inside. */
  size?: Exclude<Size, 'xs'>;
}

/**
 * A boxed list of records or settings rows: a `<ul>` with a `line` edge and
 * `radius-lg`, its rows divided by `line`. Name it with `aria-label` or
 * `aria-labelledby` when a heading above doesn't.
 */
export const Root = forwardRef<HTMLUListElement, RootProps>(function ListRoot({ size, className, ...props }, ref) {
  const resolved = useRowSize(size);
  return (
    <SizeContext.Provider value={resolved}>
      <ul ref={ref} {...props} className={cx('mu-list mu-base mu-body', `mu-s-${resolved}`, className)} />
    </SizeContext.Provider>
  );
});

export interface ItemProps extends ComponentPropsWithoutRef<'li'> {}

/** One row, an `<li>`: a horizontal Field, or a record's text with its actions at the end. */
export const Item = forwardRef<HTMLLIElement, ItemProps>(function ListItem({ className, ...props }, ref) {
  return <li ref={ref} {...props} className={cx('mu-list-item', className)} />;
});
