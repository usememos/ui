import { Collapsible } from '@usememos/ui';
import type { SectionProps } from '.';

export function CollapsibleSection({ size }: SectionProps) {
  return (
    <div style={{ display: 'grid', gap: 8, maxWidth: 360 }}>
      <Collapsible.Root size={size}>
        <Collapsible.Trigger>Advanced settings</Collapsible.Trigger>
        <Collapsible.Panel className="mu-body">Webhooks, storage and the access token for scripts.</Collapsible.Panel>
      </Collapsible.Root>
      <Collapsible.Root size={size} defaultOpen>
        <Collapsible.Trigger>Details</Collapsible.Trigger>
        <Collapsible.Panel className="mu-body">Created on 12 May. Edited 3 times.</Collapsible.Panel>
      </Collapsible.Root>
      <Collapsible.Root size={size} disabled>
        <Collapsible.Trigger>Archived</Collapsible.Trigger>
        <Collapsible.Panel className="mu-body">Nothing here.</Collapsible.Panel>
      </Collapsible.Root>
    </div>
  );
}
