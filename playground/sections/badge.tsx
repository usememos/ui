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
      <Badge>3</Badge>
    </div>
  );
}
