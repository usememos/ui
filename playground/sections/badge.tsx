import { Badge } from '@usememos/ui';
import { CircleCheck, Globe, Hash, Lock, TriangleAlert } from 'lucide-react';

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
    </div>
  );
}
