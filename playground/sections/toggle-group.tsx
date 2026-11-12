import { Separator, Toggle, ToggleGroup } from '@usememos/ui';
import { Bold, Code, Columns2, Columns3, Infinity, Italic, LayoutGrid, List, Rows3, Strikethrough } from 'lucide-react';
import type { SectionProps } from '.';

export function ToggleGroupSection({ size }: SectionProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 16, justifyItems: 'start' }}>
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
      <div style={{ width: 320, maxWidth: '100%' }} data-full-width>
        <ToggleGroup size={size} fullWidth defaultValue={['list']} aria-label="View">
          <Toggle value="list" icon={<List />}>List</Toggle>
          <Toggle value="grid" icon={<LayoutGrid />}>Masonry</Toggle>
        </ToggleGroup>
      </div>
      {(['sm', 'md'] as const).map((choiceSize) => (
        <div key={choiceSize} style={{ width: 248, maxWidth: '100%' }} data-layout-choices={choiceSize}>
          <ToggleGroup size={choiceSize} fullWidth defaultValue={['list']} aria-label={`Column layout ${choiceSize}`}>
            <Toggle value="list" icon={<Rows3 />}>List</Toggle>
            <Toggle value="two" icon={<Columns2 />} aria-label="2 columns">2</Toggle>
            <Toggle value="three" icon={<Columns3 />} aria-label="3 columns">3</Toggle>
            <Toggle value="auto" icon={<Infinity />}>Auto</Toggle>
          </ToggleGroup>
        </div>
      ))}
      <div className="mu-popup" style={{ width: 'max-content', padding: 8 }} data-fit-content>
        <ToggleGroup size={size} fullWidth defaultValue={['auto']} aria-label="Ansicht">
          <Toggle value="list">Liste</Toggle>
          <Toggle value="grid">Raster</Toggle>
          <Toggle value="auto">Automatisch</Toggle>
        </ToggleGroup>
      </div>
      <div style={{ width: 200 }} data-narrow>
        <ToggleGroup size={size} defaultValue={['list']} aria-label="Izkārtojums">
          <Toggle value="list" icon={<List />}>Saraksta skats</Toggle>
          <Toggle value="grid" icon={<LayoutGrid />}>Mūra izkārtojums</Toggle>
        </ToggleGroup>
      </div>
    </div>
  );
}
