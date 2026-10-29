import './interop.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Menu } from '@usememos/ui';

/** ?theme=paper puts the app theme on the root, as an app would. */
const theme = new URLSearchParams(location.search).get('theme');
if (theme) document.documentElement.dataset.theme = theme;

function App() {
  return (
    <main className="app">
      <Button id="primary" variant="primary">
        Save
      </Button>
      <div style={{ width: 400 }}>
        <Button id="utility" className="w-full px-8">
          Full width
        </Button>
      </div>
      <Button id="unlayered" className="app-tall">
        Tall
      </Button>
      <Menu.Root>
        <Menu.Trigger render={<Button id="menu-trigger">Options</Button>} />
        <Menu.Popup>
          <Menu.Item>Pin</Menu.Item>
        </Menu.Popup>
      </Menu.Root>
    </main>
  );
}

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
