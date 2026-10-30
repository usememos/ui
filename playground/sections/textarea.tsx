import { Textarea } from '@usememos/ui';
import type { RowSize, SectionProps } from '.';

export function TextareaSection({ size }: SectionProps<RowSize>) {
  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 400 }}>
      <Textarea size={size} placeholder="What's on your mind?" aria-label="Note" />
      <Textarea size={size} rows={2} defaultValue="Two lines" aria-label="Short note" disabled />
    </div>
  );
}
