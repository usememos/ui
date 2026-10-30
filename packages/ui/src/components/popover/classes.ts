/** The classes of each part of a Popover. */
export interface PopoverClasses {
  /** The panel: a surface with `shadow-pop`, `popover-width` wide. */
  popup: string;
  /** The panel's heading. */
  title: string;
  /** One line under the title. */
  description: string;
}

/**
 * The classes that make an app's own floating panel look like a Popover, such
 * as an emoji picker. See docs/custom-components.md.
 */
export function popoverClasses(): PopoverClasses {
  return {
    popup: 'mu-popover-popup mu-popup mu-popup-motion mu-base mu-s-md',
    title: 'mu-popover-title mu-label',
    description: 'mu-popover-description mu-caption',
  };
}
