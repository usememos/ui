import { Kbd } from '@usememos/ui';

export function KbdSection() {
  return (
    <div className="pg-row mu-body" style={{ color: 'var(--mu-ink-muted)' }}>
      <span>
        Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search
      </span>
      <span>
        <Kbd>Ctrl</Kbd> <Kbd>Enter</Kbd> to save
      </span>
      <Kbd>/</Kbd>
    </div>
  );
}
