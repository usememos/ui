import { Field, Fieldset, Radio, RadioGroup } from '@usememos/ui';
import type { SectionProps } from '.';

const options = [
  ['private', 'Private'],
  ['workspace', 'Workspace'],
  ['public', 'Public'],
] as const;

export function RadioGroupSection({ size }: SectionProps) {
  return (
    <div className="pg-row" style={{ alignItems: 'flex-start', gap: 48 }}>
      {(['vertical', 'horizontal'] as const).map((orientation) => (
        <Field.Root key={orientation} name={`visibility-${orientation}`} size={size}>
          <Fieldset.Root render={<RadioGroup orientation={orientation} defaultValue="workspace" />}>
            <Fieldset.Legend>Visibility</Fieldset.Legend>
            {options.map(([value, label]) => (
              <Field.Item key={value}>
                <Field.Label>
                  <Radio value={value} disabled={value === 'public' && orientation === 'horizontal'} />
                  {label}
                </Field.Label>
              </Field.Item>
            ))}
          </Fieldset.Root>
        </Field.Root>
      ))}
    </div>
  );
}
