import type { Size } from '../../types';

export interface MenuClassesOptions {
  /** Row height of every item: 24 or 32px. */
  size?: Exclude<Size, 'xs'>;
}

/** The classes of each part of a Menu. */
export interface MenuClasses {
  /** The floating list. Sets the row size its items read. */
  popup: string;
  /** One row. Highlighted while it has `data-highlighted`; dimmed with `data-disabled`. */
  item: string;
  /** A destructive row: red text. */
  dangerItem: string;
  /** The text of a row, which truncates. */
  label: string;
  /** A keyboard shortcut at the end of a row. */
  shortcut: string;
  /** A line between groups of rows. */
  separator: string;
  /** The name of a group of rows. */
  groupLabel: string;
}

/**
 * The classes that make an app's own floating list look like a Menu, such as
 * an editor's suggestion list. The app sets `data-highlighted` on the active
 * row. See docs/custom-components.md.
 */
export function menuClasses({ size = 'md' }: MenuClassesOptions = {}): MenuClasses {
  return {
    popup: `mu-menu-popup mu-popup mu-popup-motion mu-base mu-s-${size}`,
    item: 'mu-menu-item',
    dangerItem: 'mu-menu-item mu-menu-item-danger',
    label: 'mu-menu-label',
    shortcut: 'mu-menu-shortcut',
    separator: 'mu-menu-separator',
    groupLabel: 'mu-menu-group-label mu-label-sm',
  };
}
