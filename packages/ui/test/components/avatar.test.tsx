// @vitest-environment happy-dom
import { act } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Avatar } from '../../src';
import { render } from '../render';
describe('Avatar', () => {
  it('Avatar sets the size on Root and shows the fallback without a photo', () => {
    const { container } = render(
      <Avatar.Root size="sm">
        <Avatar.Fallback>JD</Avatar.Fallback>
      </Avatar.Root>,
    );
    const root = container.querySelector('.mu-avatar-root')!;
    expect(root.className).toContain('mu-s-sm');
    expect(root.querySelector('.mu-avatar-fallback')?.textContent).toBe('JD');
  });
});

it('Image forwards its source, alternate text, loading events and ref while Fallback owns unavailable content', async () => {
  const changed = vi.fn(); const ref = { current: null as HTMLImageElement | null };
  const { container } = render(<Avatar.Root><Avatar.Image ref={ref} keepMounted src="/avatar.png" alt="Jordan Diaz" onLoadingStatusChange={changed} className="photo" /><Avatar.Fallback>JD</Avatar.Fallback></Avatar.Root>);
  const image = container.querySelector('img')!;
  expect(ref.current).toBe(image);
  expect(image.getAttribute('src')).toBe('/avatar.png');
  expect(image.alt).toBe('Jordan Diaz');
  expect(image.classList.contains('mu-avatar-image')).toBe(true);
  expect(container.querySelector('.mu-avatar-fallback')!.textContent).toBe('JD');
  await act(async () => image.dispatchEvent(new Event('load')));
  expect(changed).toHaveBeenCalledWith('loaded');
});
