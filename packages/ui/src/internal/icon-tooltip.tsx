import { useCallback, useState, type ReactElement } from 'react';
import * as Tooltip from '../components/tooltip';

export function IconTooltip({ label, container, children }: { label: string; container?: Tooltip.PopupProps['container']; children: ReactElement }) {
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);
  const triggerRef = useCallback((element: HTMLElement | null) => {
    const root = element?.getRootNode();
    setShadowRoot(root?.nodeType === 11 ? root as ShadowRoot : null);
  }, []);
  return (
    <Tooltip.Root>
      <Tooltip.Trigger ref={triggerRef} render={children} />
      <Tooltip.Popup container={container === undefined ? shadowRoot ?? undefined : container}>{label}</Tooltip.Popup>
    </Tooltip.Root>
  );
}
