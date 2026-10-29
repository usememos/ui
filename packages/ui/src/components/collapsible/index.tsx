import { Collapsible as BaseCollapsible } from '@base-ui/react/collapsible';
import { ChevronDown } from 'lucide-react';
import { forwardRef } from 'react';
import { withClass } from '../../internal/class-name';
import { SizeContext, useSize } from '../../internal/size';
import type { Size } from '../../types';
import { buttonClasses } from '../button';

export interface RootProps extends BaseCollapsible.Root.Props {
  size?: Size;
}

/** Hides content behind one trigger until people ask for it. Holds a Trigger and a Panel. */
export const Root = forwardRef<HTMLDivElement, RootProps>(function CollapsibleRoot({ size, className, ...props }, ref) {
  const resolved = useSize(size);
  return (
    <SizeContext.Provider value={resolved}>
      <BaseCollapsible.Root ref={ref} {...props} className={withClass('mu-collapsible', className)} />
    </SizeContext.Provider>
  );
});

export interface TriggerProps extends BaseCollapsible.Trigger.Props {}

/** A ghost key with a chevron at the end that turns while the panel is open. */
export const Trigger = forwardRef<HTMLButtonElement, TriggerProps>(function CollapsibleTrigger({ className, children, ...props }, ref) {
  const size = useSize();
  return (
    <BaseCollapsible.Trigger ref={ref} {...props} className={withClass(`mu-collapsible-trigger ${buttonClasses({ variant: 'ghost', size })}`, className)}>
      <span className="mu-button-label">{children}</span>
      <ChevronDown className="mu-collapsible-chevron" aria-hidden />
    </BaseCollapsible.Trigger>
  );
});

export interface PanelProps extends BaseCollapsible.Panel.Props {}

/** The hidden content. It fades and rises in; its height does not animate. */
export const Panel = forwardRef<HTMLDivElement, PanelProps>(function CollapsiblePanel({ className, ...props }, ref) {
  return <BaseCollapsible.Panel ref={ref} {...props} className={withClass('mu-collapsible-panel', className)} />;
});
