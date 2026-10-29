import { Skeleton } from '@usememos/ui';
import type { SectionProps } from '.';

export function SkeletonSection({ size }: SectionProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 12, alignItems: 'start', maxWidth: 480 }}>
      <Skeleton round size={size} />
      <div style={{ display: 'grid', gap: 8 }}>
        <Skeleton size={size} width="40%" />
        <Skeleton size={size} />
        <Skeleton size={size} width="80%" />
      </div>
    </div>
  );
}
