import { Checkbox, Field } from '@usememos/ui';
import { rowSize, type SectionProps } from '.';

export function CheckboxSection({ size }: SectionProps) {
  return (
    <div className="pg-row">
      <Checkbox size={size} aria-label="Unchecked" />
      <Checkbox size={size} aria-label="Checked" defaultChecked />
      <Checkbox size={size} aria-label="Some checked" indeterminate />
      <Checkbox size={size} aria-label="Disabled" disabled />
      <Checkbox size={size} aria-label="Disabled and checked" disabled defaultChecked />
      <Field.Root size={rowSize(size)}>
        <Field.Label>
          <Checkbox /> Remember me
        </Field.Label>
      </Field.Root>
    </div>
  );
}
