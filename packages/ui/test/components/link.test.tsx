// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { Link } from '../../src';
import { render } from '../render';
describe('Link', () => {
  it('Link opens external links in a new tab with an arrow', () => {
    const { container } = render(
      <Link href="https://example.com" external>
        Docs
      </Link>,
    );
    const link = container.querySelector('a')!;
    expect(link.target).toBe('_blank');
    expect(link.rel).toBe('noopener noreferrer');
    expect(link.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
  });
  it('Link renders through render for router links', () => {
    const { container } = render(<Link render={<a data-router="" />} href="/notes" muted>Notes</Link>);
    const link = container.querySelector('a')!;
    expect(link.hasAttribute('data-router')).toBe(true);
    expect(link.className).toContain('mu-link-muted');
  });
});

it.each(['hover', 'always'] as const)('underline=%s preserves navigation, caller attributes and render', (underline) => {
  const ref = { current: null as HTMLAnchorElement | null };
  const { container } = render(<Link ref={ref} underline={underline} external target="_self" rel="nofollow" href="/docs" className="app" render={<a data-router="" />}>Docs</Link>);
  const link = container.querySelector('a')!;
  expect(ref.current).toBe(link);
  expect(link.classList.contains('mu-link-underline')).toBe(underline === 'always');
  expect(link.getAttribute('href')).toBe('/docs');
  expect(link.target).toBe('_self');
  expect(link.rel).toBe('nofollow');
  expect(link.hasAttribute('data-router')).toBe(true);
});
