import { Tabs as BaseTabs } from '@base-ui/react/tabs';
import { forwardRef, type ReactNode } from 'react';
import { withClass } from '../../internal/class-name';
import { SizeContext, useRowSize } from '../../internal/size';
import type { IconElement, Size } from '../../types';

export interface RootProps extends BaseTabs.Root.Props {
  size?: Exclude<Size, 'xs'>;
}

/** Switches between sections of the same page. Holds a List and one Panel per tab. */
export const Root = forwardRef<HTMLDivElement, RootProps>(function TabsRoot({ size, className, ...props }, ref) {
  const resolved = useRowSize(size);
  return (
    <SizeContext.Provider value={resolved}>
      <BaseTabs.Root ref={ref} {...props} className={withClass('mu-tabs-root', className)} />
    </SizeContext.Provider>
  );
});

export interface ListProps extends BaseTabs.List.Props {}

/** The well that holds the tabs, with the sliding key built in. */
export const List = forwardRef<HTMLDivElement, ListProps>(function TabsList({ className, children, ...props }, ref) {
  const size = useRowSize();
  return (
    <BaseTabs.List ref={ref} {...props} className={withClass(`mu-tabs-list mu-segmented mu-base mu-s-${size}`, className)}>
      <BaseTabs.Indicator className="mu-tabs-indicator mu-segmented-key" />
      {children}
    </BaseTabs.List>
  );
});

export interface TabProps extends BaseTabs.Tab.Props {
  icon?: IconElement;
  children?: ReactNode;
}

/** One tab. Its `value` matches a Panel's. */
export const Tab = forwardRef<HTMLElement, TabProps>(function TabsTab({ icon, className, children, ...props }, ref) {
  return (
    <BaseTabs.Tab ref={ref} {...props} className={withClass('mu-tabs-tab mu-segmented-item mu-focus', className)}>
      {icon}
      {children}
    </BaseTabs.Tab>
  );
});

export interface PanelProps extends BaseTabs.Panel.Props {}

/** The content of one tab. */
export const Panel = forwardRef<HTMLDivElement, PanelProps>(function TabsPanel({ className, ...props }, ref) {
  return <BaseTabs.Panel ref={ref} {...props} className={withClass('mu-tabs-panel mu-focus', className)} />;
});
