// @vitest-environment happy-dom
// Our behavior on top of Base UI for the Phase 1 components: classes from
// props, size through context, loading, and the accessible names we add.
import { Pin } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { Avatar, Badge, Button, buttonClasses, Kbd, Link, Separator, Skeleton, Spinner } from '../src';
import { SizeContext } from '../src/internal/size';
import { render } from './render';

describe('Button', () => {
  it('is a neutral md button by default', () => {
    const { container } = render(<Button>Save</Button>);
    const button = container.querySelector('button')!;
    expect(button.className).toBe(buttonClasses());
    expect(button.className).toContain('mu-button-neutral');
    expect(button.className).toContain('mu-s-md');
    expect(button.type).toBe('button');
    expect(button.textContent).toBe('Save');
  });

  it('sets the variant and size classes, and keeps the app class last', () => {
    const { container } = render(
      <Button variant="primary" size="lg" className="app">
        Save
      </Button>,
    );
    const classes = container.querySelector('button')!.className.split(' ');
    expect(classes).toContain('mu-button-primary');
    expect(classes).toContain('mu-s-lg');
    expect(classes.at(-1)).toBe('app');
  });

  it('takes its size from the nearest Root', () => {
    const { container } = render(
      <SizeContext.Provider value="sm">
        <Button>Inherited</Button>
        <Button size="lg">Own</Button>
      </SizeContext.Provider>,
    );
    const [inherited, own] = container.querySelectorAll('button');
    expect(inherited!.className).toContain('mu-s-sm');
    expect(own!.className).toContain('mu-s-lg');
  });

  it('is square with only an icon', () => {
    const { container } = render(<Button icon={<Pin />} aria-label="Pin" />);
    const button = container.querySelector('button')!;
    expect(button.className).toContain('mu-button-icon');
    expect(button.querySelector('.mu-button-label')).toBeNull();
    expect(button.getAttribute('aria-label')).toBe('Pin');
  });

  it('ignores presses while loading, stays focusable and names the wait', () => {
    let clicks = 0;
    const { container } = render(
      <Button loading loadingLabel="Saving" onClick={() => clicks++}>
        Save
      </Button>,
    );
    const button = container.querySelector('button')!;
    button.click();
    expect(clicks).toBe(0);
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.disabled).toBe(false);
    expect(button.hasAttribute('data-loading')).toBe(true);
    expect(button.getAttribute('aria-label')).toBe('Saving');
    expect(button.querySelector('.mu-spinner')?.getAttribute('aria-hidden')).toBe('true');
  });

  it('builds the classes for a link that looks like a button', () => {
    expect(buttonClasses({ variant: 'ghost', size: 'sm', iconOnly: true }).split(' ')).toEqual(
      expect.arrayContaining(['mu-button', 'mu-button-ghost', 'mu-button-icon', 'mu-s-sm']),
    );
  });
});

describe('display components', () => {
  it('Spinner is a named status', () => {
    const { container } = render(<Spinner size="lg" label="Loading notes" />);
    const spinner = container.querySelector('.mu-spinner')!;
    expect(spinner.getAttribute('role')).toBe('status');
    expect(spinner.getAttribute('aria-label')).toBe('Loading notes');
    expect(spinner.className).toContain('mu-s-lg');
  });

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

  it('Kbd renders a kbd element', () => {
    const { container } = render(<Kbd>⌘</Kbd>);
    expect(container.querySelector('kbd.mu-kbd')?.textContent).toBe('⌘');
  });

  it('Separator has an orientation', () => {
    const { container } = render(<Separator orientation="vertical" />);
    const separator = container.querySelector('.mu-separator')!;
    expect(separator.getAttribute('role')).toBe('separator');
    expect(separator.getAttribute('aria-orientation')).toBe('vertical');
  });

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

  it('Skeleton is hidden from screen readers and a round one is square', () => {
    const { container } = render(<Skeleton round height={40} />);
    const skeleton = container.querySelector<HTMLElement>('.mu-skeleton')!;
    expect(skeleton.getAttribute('aria-hidden')).toBe('true');
    expect(skeleton.style.width).toBe('40px');
    expect(skeleton.style.height).toBe('40px');
  });

  it('Avatar sets the size on Root and shows the fallback without a photo', () => {
    const { container } = render(
      <Avatar.Root size="lg">
        <Avatar.Fallback>JD</Avatar.Fallback>
      </Avatar.Root>,
    );
    const root = container.querySelector('.mu-avatar-root')!;
    expect(root.className).toContain('mu-s-lg');
    expect(root.querySelector('.mu-avatar-fallback')?.textContent).toBe('JD');
  });
});
