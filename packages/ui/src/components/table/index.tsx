import { forwardRef, type ComponentPropsWithoutRef } from 'react';
import { cx } from '../../internal/class-name';
import { SizeContext, useRowSize } from '../../internal/size';
import type { Size } from '../../types';

const bodyText: Record<Exclude<Size, 'xs'>, string> = { sm: 'mu-caption', md: 'mu-body' };

export interface RootProps extends ComponentPropsWithoutRef<'table'> {
  /** `sm` for dense admin lists. Sets row height and cell text. */
  size?: Exclude<Size, 'xs'>;
}

/**
 * A `<table>` with rows separated by `line`. It sits in a box that scrolls
 * sideways when the table is wider than the screen; the ref and every prop go
 * to the `<table>`.
 */
export const Root = forwardRef<HTMLTableElement, RootProps>(function TableRoot({ size, className, ...props }, ref) {
  const resolved = useRowSize(size);
  return (
    <SizeContext.Provider value={resolved}>
      <div className="mu-table-scroll">
        <table ref={ref} {...props} className={cx('mu-table mu-base', `mu-s-${resolved}`, bodyText[resolved], className)} />
      </div>
    </SizeContext.Provider>
  );
});

export interface HeaderProps extends ComponentPropsWithoutRef<'thead'> {}

/** The `<thead>`, holding one Row of Head cells. */
export const Header = forwardRef<HTMLTableSectionElement, HeaderProps>(function TableHeader({ className, ...props }, ref) {
  return <thead ref={ref} {...props} className={cx('mu-table-header', className)} />;
});

export interface BodyProps extends ComponentPropsWithoutRef<'tbody'> {}

/** The `<tbody>`, holding the data Rows. */
export const Body = forwardRef<HTMLTableSectionElement, BodyProps>(function TableBody({ className, ...props }, ref) {
  return <tbody ref={ref} {...props} className={cx('mu-table-body', className)} />;
});

export interface RowProps extends ComponentPropsWithoutRef<'tr'> {}

/** A `<tr>`. Body rows highlight with `hover`. */
export const Row = forwardRef<HTMLTableRowElement, RowProps>(function TableRow({ className, ...props }, ref) {
  return <tr ref={ref} {...props} className={cx('mu-table-row', className)} />;
});

export interface HeadProps extends ComponentPropsWithoutRef<'th'> {
  /** Right-aligns a column of numbers. Set it on the column's Cells too. */
  num?: boolean;
}

/** A column header, `<th scope="col">` in 12px `ink-muted`. */
export const Head = forwardRef<HTMLTableCellElement, HeadProps>(function TableHead({ num = false, scope = 'col', className, ...props }, ref) {
  return <th ref={ref} scope={scope} {...props} className={cx('mu-table-head mu-label-sm', num && 'mu-table-num', className)} />;
});

export interface CellProps extends ComponentPropsWithoutRef<'td'> {
  /** Right-aligns a number. */
  num?: boolean;
  /** Secondary text, such as a date, in `ink-muted`. */
  muted?: boolean;
}

/** A data cell, `<td>`. */
export const Cell = forwardRef<HTMLTableCellElement, CellProps>(function TableCell({ num = false, muted = false, className, ...props }, ref) {
  return <td ref={ref} {...props} className={cx('mu-table-cell', num && 'mu-table-num', muted && 'mu-table-muted', className)} />;
});

export interface CaptionProps extends ComponentPropsWithoutRef<'caption'> {}

/** Names the table, under it in `caption` style. Screen readers read it as the table's name. */
export const Caption = forwardRef<HTMLTableCaptionElement, CaptionProps>(function TableCaption({ className, ...props }, ref) {
  return <caption ref={ref} {...props} className={cx('mu-table-caption mu-caption', className)} />;
});
