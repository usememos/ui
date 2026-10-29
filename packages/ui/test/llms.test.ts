// llms.txt and llms-full.txt cover every docs page, so agents in apps see
// the whole system.
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { buildLlms } from '../scripts/llms.mjs';

const docs = import.meta.glob<string>(['../../../docs/*.md', '../../../docs/components/*.md'], { query: '?raw', import: 'default', eager: true });
const docsPath = (path: string) => path.replace('../../../docs/', '');

describe('llms.txt', () => {
  const { index, full } = buildLlms(join(__dirname, '../../../docs'));

  it('joins every docs page into llms-full.txt, once', () => {
    for (const path of Object.keys(docs)) {
      expect(full.split(`<!-- docs/${docsPath(path)} -->`), path).toHaveLength(2);
    }
  });

  it('lists every guide and component page in llms.txt, with a description', () => {
    for (const path of Object.keys(docs).map(docsPath).filter((path) => path !== 'README.md')) {
      const line = index.split('\n').find((entry) => entry.includes(`/docs/${path})`));
      expect(line, path).toMatch(/\): \S/);
    }
  });
});
