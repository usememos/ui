import { Separator, Toggle, ToggleGroup } from '@usememos/ui';
import { Bold, Code, Italic, LayoutGrid, List, Strikethrough } from 'lucide-react';
import type { SectionProps } from '.';

export function ToggleGroupSection({ size }: SectionProps) {
  return (
    <div style={{ display: 'grid', gap: 16, justifyItems: 'start' }}>
      <ToggleGroup size={size} multiple defaultValue={['bold']} aria-label="Formatting">
        <Toggle value="bold" icon={<Bold />} aria-label="Bold" />
        <Toggle value="italic" icon={<Italic />} aria-label="Italic" />
        <Toggle value="strike" icon={<Strikethrough />} aria-label="Strikethrough" />
        <Separator orientation="vertical" />
        <Toggle value="code" icon={<Code />} aria-label="Code" />
      </ToggleGroup>
      <ToggleGroup size={size} defaultValue={['all']} aria-label="Show">
        <Toggle value="all">All</Toggle>
        <Toggle value="pinned">Pinned</Toggle>
        <Toggle value="archived">Archived</Toggle>
      </ToggleGroup>
      <ToggleGroup size={size} defaultValue={['list']} aria-label="Layout">
        <Toggle value="list" icon={<List />} aria-label="List" />
        <Toggle value="grid" icon={<LayoutGrid />} aria-label="Grid" />
      </ToggleGroup>
    </div>
  );
}
