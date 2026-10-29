import { Button, Input } from '@usememos/ui';
import { Copy, Search } from 'lucide-react';
import type { SectionProps } from '.';

export function InputSection({ size }: SectionProps) {
  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 400 }}>
      <Input size={size} placeholder="Title" aria-label="Title" />
      <Input size={size} prefix={<Search aria-hidden />} placeholder="Search notes" aria-label="Search notes" />
      <Input
        size={size}
        defaultValue="https://memos.example.com/m/42"
        aria-label="Share link"
        readOnly
        suffix={<Button variant="ghost" size="sm" icon={<Copy />} aria-label="Copy link" />}
      />
      <Input size={size} defaultValue="14" suffix="px" aria-label="Font size" type="number" />
      <Input size={size} placeholder="Disabled" aria-label="Disabled" disabled />
    </div>
  );
}
