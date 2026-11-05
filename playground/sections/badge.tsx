import { Badge } from '@usememos/ui';
import { CircleCheck, CircleX, Globe, Hash, Lock, Sparkles, TriangleAlert } from 'lucide-react';

export function BadgeSection() {
  return (
    <div className="pg-row">
      <Badge icon={<Hash />}>reading</Badge>
      <Badge tone="outline" icon={<Lock />}>
        Private
      </Badge>
      <Badge tone="outline" icon={<Globe />}>
        Public
      </Badge>
      <Badge tone="success" icon={<CircleCheck />}>
        Synced
      </Badge>
      <Badge tone="warning" icon={<TriangleAlert />}>
        Expiring
      </Badge>
      <Badge tone="danger">Failed</Badge>
      <Badge tone="primary">New</Badge>
      <Badge>3</Badge>
      <span className="pg-row" style={{ gap: "var(--mu-space-2)" }} data-tag-colors>
        <Badge icon={<Hash />} color="#e5484d">
          work
        </Badge>
        <Badge icon={<Hash />} color="#f5c400">
          ideas
        </Badge>
        <Badge icon={<Hash />} color="#3e63dd">
          travel
        </Badge>
      </span>
      <span className="pg-row" style={{ gap: "var(--mu-space-2)" }} data-badge-complements>
        <Badge tone="outline">Archived</Badge>
        <Badge tone="success">Synced</Badge>
        <Badge tone="warning">Expiring</Badge>
        <Badge tone="danger" icon={<CircleX />}>
          Failed
        </Badge>
        <Badge tone="primary" icon={<Sparkles />}>
          New
        </Badge>
        <Badge color="#e5484d">work</Badge>
      </span>
      <span style={{ display: "inline-flex", maxWidth: 120 }} data-badge-truncated>
        <Badge icon={<Hash />} title="projects/2026/annual-planning">
          projects/2026/annual-planning
        </Badge>
      </span>
    </div>
  );
}
