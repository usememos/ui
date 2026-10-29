import { Spinner } from '@usememos/ui';
import type { SectionProps } from '.';

export function SpinnerSection({ size }: SectionProps) {
  return (
    <div className="pg-row">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <span className="mu-body" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: 'var(--mu-ink-muted)' }}>
        <Spinner size={size} label="Loading notes" /> Loading notes
      </span>
    </div>
  );
}
