import { Toggle } from '@usememos/ui';
import { Bold, Pin } from 'lucide-react';
import type { SectionProps } from '.';

export function ToggleSection({ size }: SectionProps) {
  return (
    <div className="pg-row">
      <Toggle size={size}>Has tasks</Toggle>
      <Toggle size={size} defaultPressed icon={<Pin />}>
        Pinned
      </Toggle>
      <Toggle size={size} icon={<Bold />} aria-label="Bold" />
      <Toggle size={size} icon={<Bold />} aria-label="Bold, on" defaultPressed />
      <Toggle size={size} disabled>
        Disabled
      </Toggle>
    </div>
  );
}
