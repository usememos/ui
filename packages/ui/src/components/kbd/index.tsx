import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { forwardRef } from 'react';

export interface KbdProps extends useRender.ComponentProps<'kbd'> {}

/** One keyboard key, such as "⌘", "Enter" or "/", as a tiny raised key. */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd({ render, ...props }, ref) {
  return useRender({ defaultTagName: 'kbd', render, ref, props: mergeProps<'kbd'>({ className: 'mu-kbd mu-label-xs' }, props) });
});
