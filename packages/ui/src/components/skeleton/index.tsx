import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { forwardRef } from 'react';
import { useSize } from '../../internal/size';
import type { Size } from '../../types';

export interface SkeletonProps extends useRender.ComponentProps<'div'> {
  /** Defaults to the full width. */
  width?: number | string;
  /** Defaults to one line of text at `size`. */
  height?: number | string;
  /** A circle, for an avatar. Its width defaults to its height. */
  round?: boolean;
  size?: Size;
}

/** Holds the place of content that is still loading. Hidden from screen readers. */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton({ width, height, round = false, size, render, ...props }, ref) {
  const resolved = useSize(size);
  return useRender({
    defaultTagName: 'div',
    render,
    ref,
    props: mergeProps<'div'>(
      {
        className: `mu-skeleton${round ? ' mu-skeleton-round' : ''} mu-s-${resolved}`,
        'aria-hidden': true,
        style: { width: width ?? (round ? height : undefined), height },
      },
      props,
    ),
  });
});
