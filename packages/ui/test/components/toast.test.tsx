// @vitest-environment happy-dom
import { act } from 'react';
import { describe, expect, it } from 'vitest';
import { Toast } from '../../src';
import { render, settle } from '../render';
describe('Toast', () => {
  it('shows each toast with the icon of its tone, and the action', async () => {
    const manager = Toast.createToastManager();
    render(
      <Toast.Provider toastManager={manager}>
        <Toast.Viewport />
      </Toast.Provider>,
    );
    act(() => {
      manager.add({ title: 'Settings saved', type: 'success' });
      manager.add({ title: 'Note archived', actionProps: { children: 'Undo' } });
    });
    await settle();
    const toasts = [...document.querySelectorAll('.mu-toast')];
    const saved = toasts.find((toast) => toast.textContent?.includes('Settings saved'))!;
    const archived = toasts.find((toast) => toast.textContent?.includes('Note archived'))!;
    expect(saved.className).toContain('mu-toast-success');
    expect(saved.querySelector('svg.lucide-circle-check')).not.toBeNull();
    expect(saved.querySelector('.mu-toast-action')).toBeNull();
    expect(archived.className).toContain('mu-toast-neutral');
    expect(archived.querySelector('.mu-toast-action')!.textContent).toBe('Undo');
    expect(archived.querySelector('.mu-toast-close')!.getAttribute('aria-label')).toBe('Close');
  });
});

it('container and closeLabel apply to every tone and preserve manager actions', async () => {
  const host = document.createElement('div');
  document.body.append(host);
  const manager = Toast.createToastManager();
  render(<Toast.Provider toastManager={manager} timeout={0}><Toast.Viewport container={host} closeLabel="Dismiss message" className="app" /></Toast.Provider>);
  act(() => {
    for (const type of ['neutral', 'success', 'warning', 'danger', 'unknown']) manager.add({ title: type, type, description: `${type} details` });
  });
  await settle();
  const toasts = [...host.querySelectorAll('.mu-toast')];
  expect(toasts).toHaveLength(5);
  expect(toasts.map(toast => toast.className.match(/mu-toast-(neutral|success|warning|danger)/)?.[1])).toEqual(['neutral', 'danger', 'warning', 'success', 'neutral']);
  expect([...host.querySelectorAll('.mu-toast-close')].every(button => button.getAttribute('aria-label') === 'Dismiss message')).toBe(true);
  expect(host.querySelector('.mu-toast-description')!.textContent).toContain('details');
});
