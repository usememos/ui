import { Link } from '@usememos/ui';

export function LinkSection() {
  return (
    <div className="pg-row mu-body">
      <Link href="#link">View all</Link>
      <Link href="#link" muted>
        Settings
      </Link>
      <Link href="https://www.usememos.com" external>
        usememos.com
      </Link>
      <span>
        Read the{' '}
        <Link href="#link" underline="always">
          release notes
        </Link>{' '}
        before upgrading.
      </span>
    </div>
  );
}
