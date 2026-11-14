import { describe, expect, it } from 'vitest';
import { exercisedProps, publicComponentProps } from './public-api';

const suites = import.meta.glob<string>('./components/*.test.tsx', { query: '?raw', import: 'default', eager: true });
const kebab = (name: string) => name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const inventory = publicComponentProps();

describe('public component prop inventory', () => {
  for (const [component, props] of Object.entries(inventory)) {
    it(`${component} has explicit cases for its package-owned props`, () => {
      const family = component.split('.')[0]!;
      const file = family === 'Radio' ? 'radio-group' : kebab(family);
      const suite = suites[`./components/${file}.test.tsx`];
      expect(suite, `${component}: missing component suite`).toBeDefined();
      const exercised = exercisedProps(suite!);
      expect(exercised.has(`${component}.__rendered`), `${component}: exported part has no explicit render case`).toBe(true);
      expect(props.filter((prop) => !exercised.has(`${component}.${prop}`)), `${component}: props missing explicit cases`).toEqual([]);
    });
  }
});
