import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { forwardRef } from 'react';
import { cx } from '../../internal/class-name';
import type { IconElement, Tone } from '../../types';

export interface BadgeProps extends useRender.ComponentProps<'span'> {
  /** A status tone, or `outline` for a quiet label such as visibility. */
  tone?: Tone | 'outline';
  /** A Lucide element before the text, drawn at 12px. */
  icon?: IconElement;
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
  return cx('mu-badge', `mu-badge-${tone}`, 'mu-base', 'mu-s-xs');
}

/** A tag or status label: one or two words. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge({ tone = 'neutral', icon, render, children, ...props }, ref) {
  return useRender({
    defaultTagName: 'span',
    render,
    ref,
    props: mergeProps<'span'>({ className: badgeClasses({ tone }), children: (
          <>
            {icon}
            {children}
          </>
        ) }, props),
  });
});
