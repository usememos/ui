// Builds llms.txt (an index of the docs) and llms-full.txt (every docs page
// joined) from docs/, for coding agents in apps that use the package. Both
// ship in the npm package, so an agent can read
// node_modules/@usememos/ui/llms-full.txt without network access.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const repoDocs = 'https://github.com/usememos/ui/blob/main/docs';

/** `[text](target.md)` links in a Markdown string, in order, without duplicates. */
function links(markdown) {
  const seen = new Map();
  for (const [, text, target] of markdown.matchAll(/\[([^\]]+)\]\(([\w./-]+\.md)\)/g)) {
    if (!seen.has(target)) seen.set(target, text);
  }
  return [...seen].map(([target, text]) => ({ target, text }));
}

/** The first paragraph under a page's `# Title`, with links reduced to their text. */
function purpose(markdown) {
  return (markdown.split('\n\n')[1] ?? '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\s+/g, ' ').trim();
}

/**
 * Reads docs/ in reading order: the docs README, each page in its contents
 * table, and after the components README each component page in inventory
 * order.
 */
function readDocs(docsDir) {
  const read = (path) => readFileSync(join(docsDir, path), 'utf8').trim();
  const overview = read('README.md');
  const contents = overview.slice(overview.indexOf('## Contents'), overview.indexOf('## Decisions'));
  const guides = [];
  const components = [];
  for (const { target } of links(contents)) {
    const text = read(target);
    guides.push({ path: target, text, description: contents.match(new RegExp(`\\(${target.replace(/[./]/g, '\\$&')}\\) \\| ([^|]+) \\|`))?.[1]?.trim() ?? '' });
    if (target === 'components/README.md') {
      // Component pages sit next to the components README; `../icons.md` is a guide, read above.
      for (const { target: page, text: name } of links(text.slice(0, text.indexOf('## Page template'))).filter(({ target }) => !target.startsWith('../'))) {
        const pageText = read(`components/${page}`);
        components.push({ path: `components/${page}`, name, text: pageText, description: purpose(pageText) });
      }
    }
  }
  return { overview, guides, components };
}

export function buildLlms(docsDir) {
  const { overview, guides, components } = readDocs(docsDir);
  const index = [
    '# Memos UI (@usememos/ui)',
    '',
    `> ${purpose(overview)}`,
    '',
    'React components on Base UI, CSS tokens and foundation styles. Load `@usememos/ui/tokens.css`, then `@usememos/ui/styles.css`; set `data-theme` to `light`, `dark` or `contrast` on the root element. Components are compound parts named after Base UI\'s anatomy (`Menu.Root`, `Menu.Trigger`, `Menu.Popup`, `Menu.Item`); icons are Lucide elements. Every docs page is in llms-full.txt next to this file.',
    '',
    '## Docs',
    '',
    ...guides.map(({ path, text, description }) => `- [${text.match(/^# (.+)$/m)?.[1] ?? path}](${repoDocs}/${path}): ${description}`),
    '',
    '## Components',
    '',
    ...components.map(({ path, name, description }) => `- [${name}](${repoDocs}/${path}): ${description}`),
    '',
    '## Optional',
    '',
    '- [llms-full.txt](llms-full.txt): every page above in one file',
    '',
  ].join('\n');
  const pages = [{ path: 'README.md', text: overview }, ...guides.flatMap((guide) => (guide.path === 'components/README.md' ? [guide, ...components] : [guide]))];
  const full = `${pages.map(({ path, text }) => `<!-- docs/${path} -->\n\n${text}\n`).join('\n')}`;
  return { index, full };
}
