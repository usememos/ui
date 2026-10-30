import '@usememos/ui/tokens.css';
import '@usememos/ui/styles.css';
import './playground.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import type { Size } from '@usememos/ui';
import { Foundations } from './foundations';
import { sections } from './sections';

type Theme = 'light' | 'dark' | 'contrast';

const themes: Theme[] = ['light', 'dark', 'contrast'];
const sizes: Size[] = ['sm', 'md'];

/** ?theme=dark&size=sm: the tests open the page this way. */
function readParam<T extends string>(name: string, allowed: T[], fallback: T): T {
  const value = new URLSearchParams(location.search).get(name);
  return allowed.includes(value as T) ? (value as T) : fallback;
}

const theme = readParam('theme', themes, 'light');
const size = readParam('size', sizes, 'md');
document.documentElement.dataset.theme = theme;

/** Every component section, then the foundations. */
function App() {
  return (
    <main className="pg-main">
      {sections.map(({ name, title, Section }) => (
        <section className="pg-section" id={name} key={name}>
          <h2 className="mu-heading">{title}</h2>
          <Section size={size} />
        </section>
      ))}
      <Foundations />
    </main>
  );
}

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
