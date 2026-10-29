import { Field, Switch } from '@usememos/ui';
import type { SectionProps } from '.';

export function SwitchSection({ size }: SectionProps) {
  return (
    <div className="pg-row">
      <Switch size={size} aria-label="Off" />
      <Switch size={size} aria-label="On" defaultChecked />
      <Switch size={size} aria-label="Disabled" disabled />
      <Switch size={size} aria-label="Disabled and on" disabled defaultChecked />
      <Field.Root size={size}>
        <Field.Label>
          <Switch defaultChecked /> Compact mode
        </Field.Label>
      </Field.Root>
    </div>
  );
}
