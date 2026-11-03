import { Avatar, Button, Field, List, Select, Switch } from '@usememos/ui';
import { ChevronRight } from 'lucide-react';
import type { RowSize, SectionProps } from '.';

/** A boxed list of settings rows, and one of records with an action at the end. */
export function ListSection({ size }: SectionProps<RowSize>) {
  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 480 }}>
      <section style={{ display: 'grid', gap: 8 }}>
        <h3 className="mu-label" id="list-preferences">Preferences</h3>
        <List.Root size={size} aria-labelledby="list-preferences">
          <List.Item>
            <Field.Root orientation="horizontal">
              <Field.Label>Compact mode</Field.Label>
              <Field.Description>Show more notes on one screen.</Field.Description>
              <Switch />
            </Field.Root>
          </List.Item>
          <List.Item>
            <Field.Root orientation="horizontal">
              <Field.Label>Show pinned first</Field.Label>
              <Switch defaultChecked />
            </Field.Root>
          </List.Item>
          <List.Item>
            <Field.Root orientation="horizontal">
              <Field.Label>Default visibility</Field.Label>
              <Select.Root items={{ private: 'Private', public: 'Public' }} defaultValue="private">
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Popup>
                  <Select.Item value="private">Private</Select.Item>
                  <Select.Item value="public">Public</Select.Item>
                </Select.Popup>
              </Select.Root>
            </Field.Root>
          </List.Item>
        </List.Root>
      </section>
      <List.Root size={size} aria-label="Spaces" data-item-buttons>
        {['Personal', 'Design team'].map((name) => (
          <List.Item key={name}>
            <List.ItemButton render={<a href="#list" />}>
              <Avatar.Root size="sm">
                <Avatar.Fallback>{name.slice(0, 1)}</Avatar.Fallback>
              </Avatar.Root>
              <span style={{ flex: 1 }}>{name}</span>
              <ChevronRight className="mu-icon-md" aria-hidden />
            </List.ItemButton>
          </List.Item>
        ))}
      </List.Root>
      <List.Root size={size} aria-label="Webhooks">
        {['https://example.com/hooks/memos', 'https://chat.example.com/in/42'].map((url) => (
          <List.Item key={url} className="pg-list-record">
            <span className="pg-list-url">{url}</span>
            <Button size={size}>Edit</Button>
          </List.Item>
        ))}
      </List.Root>
    </div>
  );
}
