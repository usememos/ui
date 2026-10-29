import { Separator } from '@usememos/ui';

export function SeparatorSection() {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <p className="mu-body" style={{ margin: 0 }}>
        Above the line
      </p>
      <Separator />
      <div className="pg-row mu-body" style={{ height: 24 }}>
        <span>Left</span>
        <Separator orientation="vertical" />
        <span>Right</span>
      </div>
    </div>
  );
}
