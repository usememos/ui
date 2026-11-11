// @vitest-environment happy-dom
import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Button } from '../src';
import { render } from './render';

afterEach(() => vi.useRealTimers());

describe('Button loading feedback', () => {
  it('blocks presses immediately, then replaces the label after 300ms', () => {
    vi.useFakeTimers();
    let presses = 0;
    const { container, rerender, unmount } = render(<Button loading loadingLabel="Saving" onClick={() => presses++}>Save</Button>);
    try {
      const button = container.querySelector('button')!;
      button.click();
      expect(presses).toBe(0);
      expect(button.getAttribute('aria-busy')).toBe('true');
      expect(button.querySelector('.mu-spinner')).toBeNull();
      act(() => vi.advanceTimersByTime(299));
      expect(button.hasAttribute('data-loading-visible')).toBe(false);
      act(() => vi.advanceTimersByTime(1));
      expect(button.hasAttribute('data-loading-visible')).toBe(true);
      expect(button.querySelector('.mu-spinner')?.getAttribute('aria-hidden')).toBe('true');
      rerender(<Button>Save</Button>);
      expect(button.hasAttribute('aria-busy')).toBe(false);
      expect(button.querySelector('.mu-spinner')).toBeNull();
      expect(button.textContent).toBe('Save');
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
