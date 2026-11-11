import { Form as BaseForm } from '@base-ui/react/form';
import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';
import { createContext, forwardRef, useContext, useId, useLayoutEffect, useState, type ComponentPropsWithoutRef } from 'react';
import { cx, withClass } from '../../internal/class-name';
import { SizeContext } from '../../internal/size';

/** The id of the form's Title, so the Root can be named by it. */
const TitleIdContext = createContext<((id: string | undefined) => void) | null>(null);

export interface RootProps extends BaseForm.Props {
  /**
   * Draws the form in a box, as a List: a `line` edge, `radius-lg` corners and
   * a `surface` fill, with the Footer as a `canvas` bar under a `line`. For a
   * small form among Lists on a settings page.
   */
  bordered?: boolean;
}

/**
 * A `<form>` on Base UI's Form, which shows each Field's errors. Its children
 * stack `space-4` apart. A Title inside names it.
 */
export const Root = forwardRef<HTMLFormElement, RootProps>(function FormRoot({ bordered = false, className, ...props }, ref) {
  const [titleId, setTitleId] = useState<string | undefined>(undefined);
  return (
    <TitleIdContext.Provider value={setTitleId}>
      {/* A form is md wherever it is declared, as a Dialog is. */}
      <SizeContext.Provider value="md">
        <BaseForm
          ref={ref}
          aria-labelledby={props['aria-label'] ? undefined : titleId}
          {...props}
          className={withClass(cx('mu-form mu-base mu-body mu-s-md', bordered && 'mu-form-bordered'), className)}
        />
      </SizeContext.Provider>
    </TitleIdContext.Provider>
  );
});

export interface TitleProps extends useRender.ComponentProps<'h2'> {}

/** The form's heading, an `<h2>` in `label` style that names the form. Use `render` for another level. */
export const Title = forwardRef<HTMLHeadingElement, TitleProps>(function FormTitle({ render, id: ownId, ...props }, ref) {
  const generated = useId();
  const id = ownId ?? generated;
  const register = useContext(TitleIdContext);
  useLayoutEffect(() => {
    register?.(id);
    return () => register?.(undefined);
  }, [register, id]);
  return useRender({
    defaultTagName: 'h2',
    render,
    ref,
    props: mergeProps<'h2'>({ id, className: 'mu-form-title mu-label' }, props),
  });
});

export interface DescriptionProps extends ComponentPropsWithoutRef<'p'> {}

/** One line under the title, in `caption` and `text-secondary`. */
export const Description = forwardRef<HTMLParagraphElement, DescriptionProps>(function FormDescription({ className, ...props }, ref) {
  return <p ref={ref} {...props} className={cx('mu-form-description mu-caption', className)} />;
});

export interface FooterProps extends ComponentPropsWithoutRef<'div'> {}

/** The form's buttons, right-aligned: a ghost Cancel, then the primary. In a bordered form, a `canvas` bar along the bottom. */
export const Footer = forwardRef<HTMLDivElement, FooterProps>(function FormFooter({ className, ...props }, ref) {
  return <div ref={ref} {...props} className={cx('mu-form-footer', className)} />;
});
