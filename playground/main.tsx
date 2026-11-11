import '@usememos/ui/tokens.css';
import '@usememos/ui/styles.css';
import './playground.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { Size } from '@usememos/ui';
import { Foundations } from './foundations';
import { Screens } from './screens';
import { rowSize, sections } from './sections';

type Theme = 'light' | 'dark';

const themes: Theme[] = ['light', 'dark'];
const sizes: Size[] = ['xs', 'sm', 'md'];

/** ?theme=dark&size=sm: the tests open the page this way. At xs, sections without xs render at sm. */
function readParam<T extends string>(name: string, allowed: T[], fallback: T): T {
  const value = new URLSearchParams(location.search).get(name);
  return allowed.includes(value as T) ? (value as T) : fallback;
}

const theme = readParam('theme', themes, 'light');
const size = readParam('size', sizes, 'md');
document.documentElement.dataset.theme = theme;

/** Every component section, then the foundations and the reference screens. */
function App() {
  return (
    <main className="pg-main">
      {sections.map((entry) => (
        <section className="pg-section" id={entry.name} key={entry.name} data-xs={entry.xs ? '' : undefined}>
          <h2 className="mu-heading">{entry.title}</h2>
          {entry.xs ? <entry.Section size={size} /> : <entry.Section size={rowSize(size)} />}
        </section>
      ))}
      <Foundations />
      <Screens />
    </main>
  );
}

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
