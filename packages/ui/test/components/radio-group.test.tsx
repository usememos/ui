// @vitest-environment happy-dom
import { describe, expect, it, vi } from 'vitest';
import { Radio, RadioGroup } from '../../src';
import { click, render } from '../render';
describe('RadioGroup', () => {
  it('passes its size to each radio and sets the orientation', () => {
    const { container } = render(
      <RadioGroup size="sm" orientation="horizontal" defaultValue="a" aria-label="Choice">
        <Radio value="a" aria-label="A" />
        <Radio value="b" aria-label="B" />
      </RadioGroup>,
    );
    const group = container.querySelector('[role="radiogroup"]')!;
    expect(group.getAttribute('data-orientation')).toBe('horizontal');
    expect(group.getAttribute('aria-orientation')).toBe('horizontal');
    const radios = container.querySelectorAll('[role="radio"]');
    expect([...radios].map((radio) => radio.className.includes('mu-s-sm'))).toEqual([true, true]);
    click(radios[1]!);
    expect(radios[1]!.getAttribute('aria-checked')).toBe('true');
    expect(radios[0]!.getAttribute('aria-checked')).toBe('false');
  });
});

it.each(['xs', 'sm', 'md'] as const)('Radio size=%s overrides its group without changing the selected value', (size) => {
  const { container } = render(<RadioGroup size="sm" defaultValue="a" aria-label="Choice"><Radio size={size} value="a" aria-label="A" /></RadioGroup>);
  const radio = container.querySelector('[role="radio"]')!;
  expect(radio.classList.contains(`mu-s-${size}`)).toBe(true);
  expect(radio.getAttribute('aria-checked')).toBe('true');
});

it('controlled value reports a choice and waits for the parent', () => {
  const change = vi.fn();
  const choices = (value: string) => <RadioGroup value={value} onValueChange={change} aria-label="Choice"><Radio value="a" aria-label="A" /><Radio value="b" aria-label="B" /></RadioGroup>;
  const { container, rerender } = render(choices('a'));
  const radios = container.querySelectorAll('[role="radio"]');
  click(radios[1]!);
  expect(change).toHaveBeenCalledWith('b', expect.anything());
  expect(radios[0]!.getAttribute('aria-checked')).toBe('true');
  rerender(choices('b'));
  expect(radios[1]!.getAttribute('aria-checked')).toBe('true');
});
