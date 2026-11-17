import { Badge, Button } from '@usememos/ui';
import { CircleCheck, CircleX, Globe, Hash, Lock, Sparkles, TriangleAlert } from 'lucide-react';
import type { SectionProps } from '.';

export function BadgeSection({ size: controlSize }: SectionProps) {
  const size = controlSize === 'xs' ? 'xs' : 'sm';
  return (
    <>
      <h3 className="mu-label">Sizes and tones</h3>
      <div className="pg-row" data-badge-props>
        <Badge size={size} icon={<Hash />}>reading</Badge>
        <Badge size={size} tone="outline" icon={<Lock />}>
          Private
        </Badge>
        <Badge size={size} tone="outline" icon={<Globe />}>
          Public
        </Badge>
        <Badge size={size} tone="success" icon={<CircleCheck />}>
          Synced
        </Badge>
        <Badge size={size} tone="warning" icon={<TriangleAlert />}>
          Expiring
        </Badge>
        <Badge size={size} tone="danger">Failed</Badge>
        <Badge size={size} tone="primary">New</Badge>
        <Badge size={size}>3</Badge>
        <span className="pg-row" style={{ gap: "var(--mu-space-2)" }} data-tag-colors>
          <Badge size={size} icon={<Hash />} color="#e5484d">
            work
          </Badge>
          <Badge size={size} icon={<Hash />} color="#f5c400">
            ideas
          </Badge>
          <Badge size={size} icon={<Hash />} color="#3e63dd">
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
          <Badge size={size} icon={<Hash />} title="projects/2026/annual-planning">
            projects/2026/annual-planning
          </Badge>
        </span>
      </div>
      <h3 className="mu-label">With metadata and actions</h3>
      <div className="pg-badge-context" data-badge-context="metadata">
        <span className="mu-caption pg-badge-meta">7 minutes ago</span>
        <Badge size="xs" tone="primary">New</Badge>
        <Badge tone="outline" icon={<Lock />}>Private</Badge>
        <Button size="xs" variant="ghost">Open</Button>
      </div>
      <div className="pg-badge-context" data-badge-context="localized" lang="zh-CN">
        <span className="mu-caption pg-badge-meta">7 分钟前</span>
        <Badge size="xs">新</Badge>
        <Badge size="xs" tone="success">已同步</Badge>
        <Badge icon={<Hash />}>工作</Badge>
        <Badge size="xs"><span style={{ fontVariantNumeric: 'tabular-nums' }} data-badge-count>999</span></Badge>
        <span className="pg-badge-long-label">
          <Badge size="xs" title="同步完成，所有更改已保存至服务器">同步完成，所有更改已保存至服务器</Badge>
        </span>
      </div>
    </>
  );
}
