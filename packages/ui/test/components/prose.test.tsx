// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { Prose } from '../../src';
import { render } from '../render';
describe('Prose', () => {
  it('is one class, plus mu-prose-sm at sm', () => {
    const { container, rerender } = render(<Prose dangerouslySetInnerHTML={{ __html: '<p>Hello</p>' }} />);
    expect(container.firstElementChild!.className).toBe('mu-prose');
    expect(container.querySelector('p')!.textContent).toBe('Hello');
    rerender(<Prose size="sm" className="extra" />);
    expect(container.firstElementChild!.className).toBe('mu-prose mu-prose-sm extra');
  });
});
