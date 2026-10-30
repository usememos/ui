import { Field as BaseField } from '@base-ui/react/field';
import { CircleAlert } from 'lucide-react';
import { forwardRef } from 'react';
import { withClass } from '../../internal/class-name';
import { SizeContext, useRowSize } from '../../internal/size';
import type { Size } from '../../types';

export interface RootProps extends BaseField.Root.Props {
  /** The size of the control inside, passed on to it. */
  size?: Exclude<Size, 'xs'>;
}

/** One control with its label, description and error, wired for screen readers. */
export const Root = forwardRef<HTMLDivElement, RootProps>(function FieldRoot({ size, className, ...props }, ref) {
  const resolved = useRowSize(size);
  return (
    <SizeContext.Provider value={resolved}>
      <BaseField.Root ref={ref} {...props} className={withClass('mu-field-root', className)} />
    </SizeContext.Provider>
  );
});

export interface LabelProps extends BaseField.Label.Props {}

/** The label above a text control, or beside a Checkbox, Switch or Radio placed inside it. */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(function FieldLabel({ className, ...props }, ref) {
  return <BaseField.Label ref={ref} {...props} className={withClass('mu-field-label mu-label', className)} />;
});

export interface ItemProps extends BaseField.Item.Props {}

/** One option of a checkbox or radio group inside a Field: holds a Field.Label around the control. */
export const Item = forwardRef<HTMLDivElement, ItemProps>(function FieldItem({ className, ...props }, ref) {
  return <BaseField.Item ref={ref} {...props} className={withClass('mu-field-item', className)} />;
});

export interface DescriptionProps extends BaseField.Description.Props {}

/** One line of help under the control. Hidden while the field shows an error. */
export const Description = forwardRef<HTMLParagraphElement, DescriptionProps>(function FieldDescription({ className, ...props }, ref) {
  return <BaseField.Description ref={ref} {...props} className={withClass('mu-field-description mu-caption', className)} />;
});

export interface ErrorProps extends BaseField.Error.Props {}

/** What is wrong and how to fix it, after a CircleAlert icon. Shown when the field is invalid. */
export const Error = forwardRef<HTMLDivElement, ErrorProps>(function FieldError({ className, children, ...props }, ref) {
  return (
    <BaseField.Error ref={ref} {...props} className={withClass('mu-field-error mu-caption', className)}>
      <CircleAlert className="mu-icon" aria-hidden />
      <span>{children}</span>
    </BaseField.Error>
  );
});
