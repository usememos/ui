import { Avatar } from '@usememos/ui';
import type { SectionProps } from '.';

// A drawn photo, so the playground needs no network.
const photo = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#c9b8a6"/><circle cx="20" cy="16" r="7" fill="#7a5c48"/><rect x="8" y="26" width="24" height="16" rx="8" fill="#5b6f86"/></svg>',
)}`;

export function AvatarSection({ size }: SectionProps) {
  return (
    <div className="pg-row">
      {(['sm', 'md'] as const).map((each) => (
        <Avatar.Root size={each} key={each}>
          <Avatar.Fallback>JD</Avatar.Fallback>
        </Avatar.Root>
      ))}
      <Avatar.Root size={size}>
        <Avatar.Image src={photo} alt="Jordan Diaz" />
        <Avatar.Fallback>JD</Avatar.Fallback>
      </Avatar.Root>
      <Avatar.Root size={size}>
        <Avatar.Image src="/missing.png" alt="Sam Lee" />
        <Avatar.Fallback>SL</Avatar.Fallback>
      </Avatar.Root>
    </div>
  );
}
