// @vitest-environment happy-dom
import { Pin } from 'lucide-react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { Badge, badgeClasses, type BadgeProps, type Tone } from '../../src';
import { click, render } from '../render';

describe('Badge', () => {
  it('Badge sets its tone and puts the icon first', () => {
    const { container } = render(
      <Badge tone="success" icon={<Pin />}>
        Synced
      </Badge>,
    );
    const badge = container.querySelector('.mu-badge')!;
    expect(badge.className).toContain('mu-badge-success');
    expect(badge.firstElementChild?.tagName.toLowerCase()).toBe('svg');
    expect(badge.textContent).toBe('Synced');
  });
});

describe('Badge primary', () => {
  it('uses the primary tone class', () => {
    const { container } = render(<Badge tone="primary">New</Badge>);
    expect(container.querySelector('span')!.className).toBe(badgeClasses({ tone: 'primary' }));
    expect(badgeClasses({ tone: 'primary' })).toContain('mu-badge-primary');
  });
});

describe('Badge color', () => {
  it('allows custom colors only on neutral tags in its public props', () => {
    expectTypeOf<{ color: string; }>().toMatchTypeOf<BadgeProps>();
    expectTypeOf<{ tone: 'neutral'; color: string; }>().toMatchTypeOf<BadgeProps>();
    expectTypeOf<BadgeProps['tone']>().toEqualTypeOf<Tone | 'outline' | 'primary' | undefined>();
    type NonNeutralBadge = Extract<BadgeProps, { tone: Exclude<NonNullable<BadgeProps['tone']>, 'neutral'>; }>;
    expectTypeOf<NonNeutralBadge['color']>().toEqualTypeOf<undefined>();
  });

  it('sets --mu-badge-color from color and keeps the caller style', () => {
    const { container } = render(
      <Badge color="#e5484d" style={{ marginInlineStart: 4 }}>
        work
      </Badge>,
    );
    const badge = container.querySelector('span')!;
    expect(badge.style.getPropertyValue('--mu-badge-color')).toBe('#e5484d');
    expect(badge.style.marginInlineStart).toBe('4px');
    expect(badge.hasAttribute('color')).toBe(false);
  });

  it('sets no style without a color', () => {
    const { container } = render(<Badge>reading</Badge>);
    expect(container.querySelector('span')!.getAttribute('style')).toBeNull();
  });
});

const tones = { neutral: true, primary: true, outline: true, success: true, warning: true, danger: true } satisfies Record<NonNullable<BadgeProps['tone']>, boolean>;
it.each(Object.keys(tones))('tone=%s keeps content and forwarded attributes', (tone) => {
  const { container } = render(<Badge tone={tone as NonNullable<BadgeProps['tone']>} icon={<Pin />} data-tag="status" className="app">Status</Badge>);
  const badge = container.firstElementChild!;
  expect(badge.classList.contains(`mu-badge-${tone}`)).toBe(true);
  expect(badge.getAttribute('data-tag')).toBe('status');
  expect(badge.querySelector('.lucide-pin')).not.toBeNull();
});
it('render, refs, layout styles and events compose with a custom tag', () => {
  const press = vi.fn(); const ref = { current: null as HTMLSpanElement | null };
  const { container } = render(<Badge ref={ref} render={<a href="/tags/work" />} style={{ maxWidth: 160 }} onClick={press}>work</Badge>);
  const link = container.querySelector('a')!;
  expect(ref.current).toBe(link);
  expect(link.style.maxWidth).toBe('160px');
  click(link); expect(press).toHaveBeenCalledOnce();
});
