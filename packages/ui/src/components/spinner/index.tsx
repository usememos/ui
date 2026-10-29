import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { forwardRef } from 'react';
import { useSize } from '../../internal/size';
import type { Size } from '../../types';

export interface SpinnerProps extends useRender.ComponentProps<'span'> {
  /** 14, 16 or 20px. Defaults to the surrounding component's size, else md. */
  size?: Size;
  /** What is loading, for screen readers. */
  label?: string;
}

/** A ring that turns while something short is in progress. */
export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner({ size, label = 'Loading', render, ...props }, ref) {
  const resolved = useSize(size);
  return useRender({
    defaultTagName: 'span',
    render,
    ref,
    props: mergeProps<'span'>({ className: `mu-spinner mu-s-${resolved}`, role: 'status', 'aria-label': label }, props),
  });
});
