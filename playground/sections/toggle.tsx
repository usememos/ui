import { Toggle } from '@usememos/ui';
import { Bold, Pin } from 'lucide-react';
import type { SectionProps } from '.';

export function ToggleSection({ size }: SectionProps) {
  return (
    <>
      <div className="pg-row" data-variant="ghost">
        <Toggle size={size}>Has tasks</Toggle>
        <Toggle size={size} defaultPressed icon={<Pin />}>
          Pinned
        </Toggle>
        <Toggle size={size} icon={<Bold />} aria-label="Bold" />
        <Toggle size={size} icon={<Bold />} aria-label="Bold, on" defaultPressed />
        <Toggle size={size} disabled>
          Disabled
        </Toggle>
        <Toggle size={size} disabled defaultPressed>
          Disabled, on
        </Toggle>
      </div>
      <div className="pg-row" data-variant="soft">
        <Toggle variant="soft" shape="pill" size={size}>Has tasks</Toggle>
        <Toggle variant="soft" shape="pill" size={size} defaultPressed icon={<Pin />}>Pinned</Toggle>
        <Toggle variant="soft" shape="pill" size={size} icon={<Bold />} aria-label="Bold" />
        <Toggle variant="soft" shape="pill" size={size} icon={<Bold />} aria-label="Bold, on" defaultPressed />
        <Toggle variant="soft" shape="pill" size={size} disabled>Disabled</Toggle>
        <Toggle variant="soft" shape="pill" size={size} disabled defaultPressed>Disabled, on</Toggle>
      </div>
    </>
  );
}
