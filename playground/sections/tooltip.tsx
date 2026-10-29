import { Button, Tooltip } from '@usememos/ui';
import { Archive, Pin, Share } from 'lucide-react';
import type { SectionProps } from '.';

export function TooltipSection({ size }: SectionProps) {
  return (
    <Tooltip.Provider>
      <div className="pg-row">
        <Tooltip.Root>
          <Tooltip.Trigger render={<Button variant="ghost" size={size} icon={<Pin />} aria-label="Pin" />} />
          <Tooltip.Popup shortcut="P">Pin</Tooltip.Popup>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger render={<Button variant="ghost" size={size} icon={<Archive />} aria-label="Archive" />} />
          <Tooltip.Popup shortcut="⌘ E">Archive</Tooltip.Popup>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger render={<Button variant="ghost" size={size} icon={<Share />} aria-label="Share" />} />
          <Tooltip.Popup side="bottom">Share</Tooltip.Popup>
        </Tooltip.Root>
      </div>
    </Tooltip.Provider>
  );
}
