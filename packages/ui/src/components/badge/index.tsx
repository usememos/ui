import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { forwardRef, type CSSProperties } from 'react';
import { cx } from '../../internal/class-name';
import type { IconElement, Tone } from '../../types';

export interface BadgeProps extends useRender.ComponentProps<'span'> {
  /** A status tone, `outline` for a quiet label such as visibility, or `primary` (ink) for the one label that should stand out, such as New. */
  tone?: Tone | 'outline' | 'primary';
  /** A Lucide element before the text, drawn at 12px. */
  icon?: IconElement;
  /**
   * A color the user gave this tag, as any CSS color. It tints the fill;
   * the text and icon stay ink. `neutral` tone only. Sets `--mu-badge-color`.
   */
  color?: string;
}

export interface BadgeClassesOptions {
  tone?: BadgeProps['tone'];
}

/**
 * The classes that make an element look like a Badge. Use them on an app's
 * own label, such as a tag that is also a link:
 * `<a className={badgeClasses()} href="/tags/work">work</a>`.
 */
export function badgeClasses({ tone = 'neutral' }: BadgeClassesOptions = {}) {
  return cx('mu-badge', `mu-badge-${tone}`, 'mu-base', 'mu-s-xs', 'mu-caption');
}

/** A tag or status label: one or two words, in a pill. A label wider than its container ends in an ellipsis. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge({ tone = 'neutral', icon, color, render, children, ...props }, ref) {
  const style = color ? ({ '--mu-badge-color': color } as CSSProperties) : undefined;
  return useRender({
    defaultTagName: 'span',
    render,
    ref,
    props: mergeProps<'span'>({ className: badgeClasses({ tone }), style, children: (
          <>
            {icon}
            {children != null && <span className="mu-badge-label">{children}</span>}
          </>
        ) }, props),
  });
});
