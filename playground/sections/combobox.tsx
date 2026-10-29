import { Combobox, Field } from '@usememos/ui';
import type { SectionProps } from '.';

const tags = ['book', 'cooking', 'design', 'finance', 'garden', 'health', 'ideas', 'journal', 'music', 'reading', 'travel', 'work'];

export function ComboboxSection({ size }: SectionProps) {
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 240 }}>
      <Field.Root>
        <Field.Label>Tag</Field.Label>
        <Combobox.Root size={size} items={tags}>
          <Combobox.Input placeholder="Find a tag" />
          <Combobox.Popup>
            <Combobox.Empty>No tags found</Combobox.Empty>
            <Combobox.List>
              {(tag: string) => (
                <Combobox.Item key={tag} value={tag}>
                  {tag}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Root>
      </Field.Root>
      <Field.Root>
        <Field.Label>Chosen tag</Field.Label>
        <Combobox.Root size={size} items={tags} defaultValue="design">
          <Combobox.Input icon={null} />
          <Combobox.Popup>
            <Combobox.Empty>No tags found</Combobox.Empty>
            <Combobox.List>
              {(tag: string) => (
                <Combobox.Item key={tag} value={tag}>
                  {tag}
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Root>
      </Field.Root>
      <Field.Root disabled>
        <Field.Label>Owner</Field.Label>
        <Combobox.Root size={size} items={['steven']} defaultValue="steven" disabled>
          <Combobox.Input />
        </Combobox.Root>
      </Field.Root>
    </div>
  );
}
