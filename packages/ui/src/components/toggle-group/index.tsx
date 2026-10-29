import { ToggleGroup as BaseToggleGroup } from '@base-ui/react/toggle-group';
import { forwardRef, useCallback, useLayoutEffect, useRef, type ReactNode } from 'react';
import { withClass } from '../../internal/class-name';
import { SizeContext, useSize } from '../../internal/size';
import type { Size } from '../../types';

export interface ToggleGroupProps extends BaseToggleGroup.Props {
  size?: Size;
  children?: ReactNode;
}

/**
 * A row of Toggles. With `multiple` it is a toolbar of independent on/off
 * toggles. Without it, one choice among peers: a well with one sliding key,
 * the same control as Tabs.
 */
export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(function ToggleGroup({ size, multiple = false, className, children, ...props }, forwardedRef) {
  const resolved = useSize(size);
  const root = useRef<HTMLDivElement | null>(null);
  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      root.current = node;
      if (typeof forwardedRef === 'function') forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef],
  );
  useSlidingKey(root, !multiple);
  return (
    <SizeContext.Provider value={resolved}>
      <BaseToggleGroup
        ref={setRef}
        multiple={multiple}
        {...props}
        className={withClass(multiple ? `mu-toggle-group mu-s-${resolved}` : `mu-toggle-group mu-segmented mu-base mu-s-${resolved}`, className)}
      >
        {multiple ? null : <span className="mu-segmented-key" aria-hidden />}
        {children}
      </BaseToggleGroup>
    </SizeContext.Provider>
  );
});

/** Measures the pressed toggle and moves the key under it, as Base UI's Tabs.Indicator does for tabs. */
function useSlidingKey(root: { current: HTMLDivElement | null }, enabled: boolean) {
  useLayoutEffect(() => {
    const element = root.current;
    if (!enabled || !element) return;
    const place = () => {
      const pressed = element.querySelector<HTMLElement>(':scope > .mu-toggle[data-pressed]');
      if (pressed) {
        element.style.setProperty('--key-left', `${pressed.offsetLeft}px`);
        element.style.setProperty('--key-width', `${pressed.offsetWidth}px`);
        element.dataset.keyed = '';
      } else {
        delete element.dataset.keyed;
      }
    };
    place();
    const mutations = new MutationObserver(place);
    mutations.observe(element, { subtree: true, attributes: true, attributeFilter: ['data-pressed'], childList: true });
    const resizes = new ResizeObserver(place);
    resizes.observe(element);
    for (const child of element.children) resizes.observe(child);
    return () => {
      mutations.disconnect();
      resizes.disconnect();
    };
  }, [root, enabled]);
}
