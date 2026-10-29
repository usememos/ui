import { Field, Select } from '@usememos/ui';
import { Globe, Lock, Users } from 'lucide-react';
import type { SectionProps } from '.';

const visibility = { private: 'Private', workspace: 'Workspace', public: 'Public' };
const languages = { en: 'English', de: 'Deutsch', fr: 'Français', ja: '日本語', zh: '中文' };

export function SelectSection({ size }: SectionProps) {
  return (
    <div style={{ display: 'grid', gap: 16, maxWidth: 240 }}>
      <Field.Root>
        <Field.Label>Visibility</Field.Label>
        <Select.Root size={size} items={visibility} defaultValue="workspace">
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Popup>
            <Select.Item value="private" icon={<Lock />}>
              Private
            </Select.Item>
            <Select.Item value="workspace" icon={<Users />}>
              Workspace
            </Select.Item>
            <Select.Item value="public" icon={<Globe />}>
              Public
            </Select.Item>
          </Select.Popup>
        </Select.Root>
      </Field.Root>
      <Field.Root>
        <Field.Label>Language</Field.Label>
        <Select.Root size={size} items={languages}>
          <Select.Trigger>
            <Select.Value placeholder="Choose a language" />
          </Select.Trigger>
          <Select.Popup alignItemWithTrigger={false}>
            <Select.Group>
              <Select.GroupLabel>Europe</Select.GroupLabel>
              <Select.Item value="en">English</Select.Item>
              <Select.Item value="de">Deutsch</Select.Item>
              <Select.Item value="fr">Français</Select.Item>
            </Select.Group>
            <Select.Separator />
            <Select.Group>
              <Select.GroupLabel>Asia</Select.GroupLabel>
              <Select.Item value="ja">日本語</Select.Item>
              <Select.Item value="zh">中文</Select.Item>
            </Select.Group>
          </Select.Popup>
        </Select.Root>
      </Field.Root>
      <Field.Root disabled>
        <Field.Label>Timezone</Field.Label>
        <Select.Root size={size} items={{ utc: 'UTC' }} defaultValue="utc" disabled>
          <Select.Trigger>
            <Select.Value />
          </Select.Trigger>
          <Select.Popup>
            <Select.Item value="utc">UTC</Select.Item>
          </Select.Popup>
        </Select.Root>
      </Field.Root>
    </div>
  );
}
