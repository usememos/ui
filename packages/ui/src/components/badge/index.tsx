import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { forwardRef } from 'react';
import type { IconElement, Tone } from '../../types';

export interface BadgeProps extends useRender.ComponentProps<'span'> {
  /** A status tone, or `outline` for a quiet label such as visibility. */
  tone?: Tone | 'outline';
  /** A Lucide element before the text, drawn at 12px. */
  icon?: IconElement;
}

/** A tag or status label: one or two words. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge({ tone = 'neutral', icon, render, children, ...props }, ref) {
  return useRender({
    defaultTagName: 'span',
    render,
    ref,
    props: mergeProps<'span'>({ className: `mu-badge mu-badge-${tone} mu-base mu-s-xs`, children: (
          <>
            {icon}
            {children}
          </>
        ) }, props),
  });
});
