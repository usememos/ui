import './interop.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Badge, badgeClasses, Button, Input, inputClasses, Menu, menuClasses, Popover, popoverClasses, Textarea, textareaClasses } from '@usememos/ui';

/** ?theme=paper puts the app theme on the root, as an app would. */
const theme = new URLSearchParams(location.search).get('theme');
if (theme) document.documentElement.dataset.theme = theme;

const menu = menuClasses();
const popover = popoverClasses();

/**
 * An app's own parts styled with the class functions, each next to the
 * component it should match (docs/custom-components.md).
 */
function CustomParts() {
  return (
    <section className="app-custom">
      <Badge id="badge">work</Badge>
      <a id="badge-custom" className={badgeClasses()} href="#work">
        work
      </a>
      <Input id="input" aria-label="Tag" />
      <div id="input-custom" className={inputClasses()}>
        <input className="app-bare-input" aria-label="Custom tag" />
      </div>
      <Textarea id="textarea" aria-label="Note" />
      <div id="textarea-custom" className={textareaClasses()} contentEditable suppressContentEditableWarning role="textbox" aria-multiline="true" aria-label="Custom note" />
      <div id="menu-custom" className={menu.popup} role="listbox" aria-label="Suggestions">
        <div id="menu-custom-item" className={menu.item} role="option" aria-selected="false">
          <span className={menu.label}>Pin</span>
        </div>
        <div id="menu-custom-active" className={menu.item} role="option" aria-selected="true" data-highlighted="">
          <span className={menu.label}>Archive</span>
        </div>
      </div>
      <div id="popover-custom" className={popover.popup}>
        <h2 className={popover.title}>Share</h2>
      </div>
      <Popover.Root>
        <Popover.Trigger render={<Button id="popover-trigger">Share</Button>} />
        <Popover.Popup>
          <Popover.Title>Share</Popover.Title>
        </Popover.Popup>
      </Popover.Root>
    </section>
  );
}

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
      <CustomParts />
    </main>
  );
}

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
