import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { ArrowUpRight } from 'lucide-react';
import { forwardRef } from 'react';

export interface LinkProps extends useRender.ComponentProps<'a'> {
  /** For navigation that shouldn't draw the eye: ink-muted, ink on hover. */
  muted?: boolean;
  /** Opens in a new tab and shows an arrow. */
  external?: boolean;
  /** `always` inside running text, so the link isn't told apart by color alone. Default `hover`. */
  underline?: 'hover' | 'always';
}

/** Goes somewhere. Accent text that underlines on hover and focus. */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link({ muted = false, external = false, underline = 'hover', render, children, ...props }, ref) {
  return useRender({
    defaultTagName: 'a',
    render,
    ref,
    props: mergeProps<'a'>(
      {
        className: `mu-link${muted ? ' mu-link-muted' : ''}${underline === 'always' ? ' mu-link-underline' : ''} mu-focus`,
        ...(external ? { target: '_blank', rel: 'noopener noreferrer' } : null),
        children: (
          <>
            {children}
            {external ? <ArrowUpRight className="mu-icon" aria-hidden /> : null}
          </>
        ),
      },
      props,
    ),
  });
});
