// @vitest-environment happy-dom
import { ChevronDown, Pin } from 'lucide-react';
import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button, buttonClasses, type ButtonVariant } from '../../src';
import { SizeContext } from '../../src/internal/size';
import { click, render } from '../render';
afterEach(() => vi.useRealTimers());

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
      <Button variant="primary" size="sm" className="app">
        Save
      </Button>,
    );
    const classes = container.querySelector('button')!.className.split(' ');
    expect(classes).toContain('mu-button-primary');
    expect(classes).toContain('mu-s-sm');
    expect(classes.at(-1)).toBe('app');
  });

  it('takes its size from the nearest Root', () => {
    const { container } = render(
      <SizeContext.Provider value="sm">
        <Button>Inherited</Button>
        <Button size="sm">Own</Button>
      </SizeContext.Provider>,
    );
    const [inherited, own] = container.querySelectorAll('button');
    expect(inherited!.className).toContain('mu-s-sm');
    expect(own!.className).toContain('mu-s-sm');
  });

  it('is square with only an icon', () => {
    const { container } = render(<Button icon={<Pin />} aria-label="Pin" />);
    const button = container.querySelector('button')!;
    expect(button.className).toContain('mu-button-icon');
    expect(button.querySelector('.mu-button-label')).toBeNull();
    expect(button.getAttribute('aria-label')).toBe('Pin');
  });

  it('shares pill classes with custom actions without forwarding shape to the DOM', () => {
    const { container } = render(<Button shape="pill" size="sm" icon={<Pin />} aria-label="Pin" />);
    const button = container.querySelector('button')!;
    expect(button.className).toBe(buttonClasses({ shape: 'pill', size: 'sm', iconOnly: true }));
    expect(button.className).toContain('mu-button-pill');
    expect(button.hasAttribute('shape')).toBe(false);
    expect(buttonClasses({ shape: 'default' })).toBe(buttonClasses());
  });

  it('ignores presses while loading, stays focusable and names the wait', () => {
    let clicks = 0;
    const { container, unmount } = render(
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
    expect(button.getAttribute('aria-label')).toBeNull();
    expect(button.getAttribute('aria-description')).toBe('Saving');
    expect(button.querySelector('.mu-spinner')).toBeNull();
    unmount();
  });

  it('builds the classes for a link that looks like a button', () => {
    expect(buttonClasses({ variant: 'ghost', size: 'sm', iconOnly: true }).split(' ')).toEqual(
      expect.arrayContaining(['mu-button', 'mu-button-ghost', 'mu-button-icon', 'mu-s-sm']),
    );
  });
});

describe('Button iconEnd', () => {
  it('puts the end icon after the label', () => {
    const { container } = render(<Button iconEnd={<ChevronDown />}>Show more</Button>);
    const button = container.querySelector('button')!;
    expect([...button.children].map((child) => child.tagName.toLowerCase())).toEqual(['span', 'svg']);
    expect(button.querySelector('.mu-button-label')!.textContent).toBe('Show more');
    expect(button.className).not.toContain('mu-button-icon');
  });

  it('is square with only an end icon', () => {
    const { container } = render(<Button iconEnd={<ChevronDown />} aria-label="Expand" />);
    const button = container.querySelector('button')!;
    expect(button.className).toContain('mu-button-icon');
    expect(button.querySelector('.mu-button-label')).toBeNull();
    expect(button.querySelectorAll('svg')).toHaveLength(1);
  });
});

describe('Button loading feedback', () => {
  it('blocks presses immediately, then shows a spinner beside the original label after 300ms', () => {
    vi.useFakeTimers();
    let presses = 0;
    const { container, rerender, unmount } = render(<Button loading loadingLabel="Saving" onClick={() => presses++}>Save</Button>);
    try {
      const button = container.querySelector('button')!;
      const label = button.querySelector('.mu-button-label');
      button.click();
      expect(presses).toBe(0);
      expect(button.getAttribute('aria-busy')).toBe('true');
      expect(button.querySelector('.mu-spinner')).toBeNull();
      act(() => vi.advanceTimersByTime(299));
      expect(button.hasAttribute('data-loading-visible')).toBe(false);
      act(() => vi.advanceTimersByTime(1));
      expect(button.hasAttribute('data-loading-visible')).toBe(true);
      expect(button.querySelector('.mu-spinner')?.getAttribute('aria-hidden')).toBe('true');
      expect(button.querySelector('.mu-button-label')).toBe(label);
      expect(label?.textContent).toBe('Save');
      rerender(<Button loading={false}>Save</Button>);
      expect(button.hasAttribute('aria-busy')).toBe(false);
      expect(button.querySelector('.mu-spinner')).toBeNull();
      expect(button.textContent).toBe('Save');
    } finally {
      unmount();
    }
  });

  it('renders an idle text-only async action like a plain button', () => {
    const plain = render(<Button>Save</Button>);
    const idle = render(<Button loading={false}>Save</Button>);
    const button = idle.container.querySelector('button')!;
    expect(button.innerHTML).toBe(plain.container.querySelector('button')!.innerHTML);
    expect(button.hasAttribute('data-loading')).toBe(false);
  });

  it('puts the spinner before the label of a text-only button', () => {
    vi.useFakeTimers();
    const { container, unmount } = render(<Button loading>Save</Button>);
    try {
      act(() => vi.advanceTimersByTime(300));
      const button = container.querySelector('button')!;
      expect(button.firstElementChild?.className).toBe('mu-spinner');
      expect(button.lastElementChild?.className).toBe('mu-button-label');
    } finally {
      unmount();
    }
  });

  it.each(['leading', 'trailing', 'both', 'icon', 'icon-end'] as const)('replaces and restores the %s icon without removing the label', (placement) => {
    vi.useFakeTimers();
    const icon = placement === 'trailing' || placement === 'icon-end' ? undefined : <Pin />;
    const iconEnd = placement === 'leading' || placement === 'icon' ? undefined : <ChevronDown />;
    const children = placement === 'icon' || placement === 'icon-end' ? undefined : 'Save';
    const view = (loading: boolean) => <Button icon={icon} iconEnd={iconEnd} loading={loading} loadingLabel="Saving" aria-label={children ? undefined : 'Save'}>{children}</Button>;
    const { container, rerender, unmount } = render(view(false));
    try {
      const button = container.querySelector('button')!;
      const originalIcons = button.querySelectorAll('svg').length;
      const label = button.querySelector('.mu-button-label');
      rerender(view(true));
      act(() => vi.advanceTimersByTime(300));
      expect(button.querySelectorAll('.mu-spinner')).toHaveLength(1);
      expect(button.querySelectorAll('svg')).toHaveLength(originalIcons - 1);
      expect(button.querySelector('.mu-button-label')).toBe(label);
      expect(button.textContent).toBe(children ?? '');
      expect(button.getAttribute('aria-label')).toBe(children ? null : 'Saving');
      expect(button.getAttribute('aria-description')).toBe(children ? 'Saving' : null);
      rerender(view(false));
      expect(button.querySelector('.mu-spinner')).toBeNull();
      expect(button.querySelectorAll('svg')).toHaveLength(originalIcons);
      expect(button.getAttribute('aria-description')).toBeNull();
      expect(button.getAttribute('aria-label')).toBe(children ? null : 'Save');
    } finally {
      unmount();
    }
  });

  it('cancels short waits and starts a new delay for the next action', () => {
    vi.useFakeTimers();
    const { container, rerender, unmount } = render(<Button loading>Save</Button>);
    try {
      const button = container.querySelector('button')!;
      act(() => vi.advanceTimersByTime(150));
      rerender(<Button>Save</Button>);
      act(() => vi.advanceTimersByTime(300));
      expect(button.querySelector('.mu-spinner')).toBeNull();
      rerender(<Button loading>Save</Button>);
      act(() => vi.advanceTimersByTime(299));
      expect(button.querySelector('.mu-spinner')).toBeNull();
      act(() => vi.advanceTimersByTime(1));
      expect(button.querySelector('.mu-spinner')).not.toBeNull();
    } finally {
      unmount();
    }
  });
});

const variants = { primary: 'mu-button-primary', neutral: 'mu-button-neutral', ghost: 'mu-button-ghost', danger: 'mu-button-danger' } satisfies Record<ButtonVariant, string>;
it.each(Object.entries(variants))('variant=%s supports every shape and both icon slots', (variant, className) => {
  for (const shape of ['default', 'pill'] as const) {
    const view = render(<Button variant={variant as ButtonVariant} shape={shape} icon={<Pin />} iconEnd={<Pin />}>Save</Button>);
    const button = view.container.querySelector('button')!;
    expect(button.classList.contains(className)).toBe(true);
    expect(button.classList.contains('mu-button-pill')).toBe(shape === 'pill');
    expect(button.querySelectorAll('svg')).toHaveLength(2);
    expect(button.querySelector('.mu-button-label')!.textContent).toBe('Save');
    view.unmount();
  }
});
it('render and className callbacks preserve refs, events, children and disabled state', () => {
  const press = vi.fn();
  const ref = { current: null as HTMLElement | null };
  const element = <Button ref={ref} onClick={press} icon={<Pin />} className={(state) => state.disabled ? 'blocked' : 'available'} render={(props, state) => <button {...props} data-state={String(state.disabled)} />}>Save</Button>;
  const { container, rerender } = render(element);
  const button = container.querySelector('button')!;
  expect(ref.current).toBe(button);
  expect(button.classList.contains('available')).toBe(true);
  click(button);
  expect(press).toHaveBeenCalledOnce();
  rerender(<Button ref={ref} disabled onClick={press} className={(state) => state.disabled ? 'blocked' : 'available'} render={(props, state) => <button {...props} data-state={String(state.disabled)} />}>Save</Button>);
  expect(button.getAttribute('data-state')).toBe('true');
  expect(button.classList.contains('blocked')).toBe(true);
  click(button);
  expect(press).toHaveBeenCalledOnce();
});
