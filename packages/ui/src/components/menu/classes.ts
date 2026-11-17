/** The classes of each part of a Menu. */
export interface MenuClasses {
  /** The floating list, with Menu's fixed density. */
  popup: string;
  /** One row. Highlighted while it has `data-highlighted`; dimmed with `data-disabled`. */
  item: string;
  /** A destructive row: red text. */
  dangerItem: string;
  /** The fixed leading square for a decorative icon, emoji or identity mark. */
  icon: string;
  /** The text of a row, which truncates. */
  label: string;
  /** Stacks a row's label over its description. */
  text: string;
  /** A line of `text-secondary` text under the label. */
  description: string;
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
export function menuClasses(): MenuClasses {
  const item = 'mu-menu-item mu-s-sm mu-caption';
  return {
    popup: 'mu-menu-popup mu-popup mu-popup-motion mu-base mu-s-sm',
    item,
    dangerItem: `${item} mu-menu-item-danger`,
    icon: 'mu-option-icon',
    label: 'mu-menu-label',
    text: 'mu-menu-text',
    description: 'mu-menu-description mu-caption',
    shortcut: 'mu-menu-shortcut',
    separator: 'mu-menu-separator',
    groupLabel: 'mu-menu-group-label mu-label-sm',
  };
}
