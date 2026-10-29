import '@usememos/ui/tokens.css';
import '@usememos/ui/styles.css';
import './playground.css';
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { Size } from '@usememos/ui';
import { Foundations } from './foundations';
import { sections } from './sections';

type Theme = 'light' | 'dark' | 'contrast';

const themes: Theme[] = ['light', 'dark', 'contrast'];
const sizes: Size[] = ['sm', 'md', 'lg'];

/** ?theme=dark&size=sm: the browser tests open the page this way. */
function readParam<T extends string>(name: string, allowed: T[], fallback: T): T {
  const value = new URLSearchParams(location.search).get(name);
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function App() {
  const [theme, setTheme] = useState(() => readParam('theme', themes, 'light'));
  const [size, setSize] = useState(() => readParam('size', sizes, 'md'));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const params = new URLSearchParams(location.search);
    params.set('theme', theme);
    params.set('size', size);
    history.replaceState(null, '', `?${params}${location.hash}`);
  }, [theme, size]);

  return (
    <>
      <header className="pg-header mu-base mu-s-md">
        <h1 className="mu-title">Memos UI</h1>
        <label>
          Theme
          <select value={theme} onChange={(event) => setTheme(event.target.value as Theme)}>
            {themes.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        <label>
          Size
          <select value={size} onChange={(event) => setSize(event.target.value as Size)}>
            {sizes.map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
      </header>
      <main className="pg-main">
        {sections.map(({ name, title, Section }) => (
          <section className="pg-section" id={name} key={name}>
            <h2 className="mu-heading-3">{title}</h2>
            <Section size={size} />
          </section>
        ))}
        <Foundations />
      </main>
    </>
  );
}

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
