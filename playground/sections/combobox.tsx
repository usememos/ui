import { Button, Combobox, Field, Popover } from '@usememos/ui';
import { Bookmark, Camera, Coffee, Heart, Leaf, Music, Plane, Star, Sun } from 'lucide-react';
import { useState, type ReactElement } from 'react';
import type { RowSize, SectionProps } from '.';

const tags = ['book', 'cooking', 'design', 'finance', 'garden', 'health', 'ideas', 'journal', 'music', 'reading', 'travel', 'work'];

const icons: { value: string; label: string; icon: ReactElement }[] = [
  { value: 'bookmark', label: 'Bookmark', icon: <Bookmark /> },
  { value: 'camera', label: 'Camera', icon: <Camera /> },
  { value: 'coffee', label: 'Coffee', icon: <Coffee /> },
  { value: 'heart', label: 'Heart', icon: <Heart /> },
  { value: 'leaf', label: 'Leaf', icon: <Leaf /> },
  { value: 'music', label: 'Music', icon: <Music /> },
  { value: 'plane', label: 'Plane', icon: <Plane /> },
  { value: 'star', label: 'Star', icon: <Star /> },
  { value: 'sun', label: 'Sun', icon: <Sun /> },
];

/** Splits items into rows of `count`, for a grid. */
const rows = <T,>(items: T[], count: number) => Array.from({ length: Math.ceil(items.length / count) }, (_, index) => items.slice(index * count, index * count + count));

export function ComboboxSection({ size }: SectionProps<RowSize>) {
  const [query, setQuery] = useState('');
  const { contains } = Combobox.useFilter();
  const found = icons.filter((item) => contains(item.label, query));
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
      <Popover.Root>
        <Popover.Trigger render={<Button size={size} icon={<Heart />}>Choose icon</Button>} />
        <Popover.Popup align="start" aria-label="Choose icon">
          <Combobox.Root size={size} items={icons} inline grid defaultValue={icons[3]} inputValue={query} onInputValueChange={setQuery} itemToStringLabel={(item) => item.label}>
            <Combobox.Input placeholder="Find an icon" aria-label="Find an icon" />
            <Combobox.Empty>No icons found</Combobox.Empty>
            <Combobox.List aria-label="Icons">
              {rows(found, 5).map((row, index) => (
                <Combobox.Row key={index}>
                  {row.map((item) => (
                    <Combobox.Item key={item.value} value={item} aria-label={item.label}>
                      {item.icon}
                    </Combobox.Item>
                  ))}
                </Combobox.Row>
              ))}
            </Combobox.List>
          </Combobox.Root>
        </Popover.Popup>
      </Popover.Root>
    </div>
  );
}
