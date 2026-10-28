import * as React from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import {
  Button,
  Checkbox,
  Dialog,
  DropdownMenu,
  Input,
  Popover,
  RadioGroup,
  Select,
  Separator,
  Switch,
  Tooltip,
} from "@usememos/ui";

type ThemeMode = "light" | "dark";

type NavItem = {
  label: string;
  to: string;
};

type ComponentMeta = {
  name: string;
  href: string;
  summary: string;
  packageImport: string;
};

type DocPage = {
  title: string;
  eyebrow: string;
  intro: string;
  section: string;
  body: React.ReactNode;
};

const primaryNav: NavItem[] = [
  { label: "Docs", to: "/docs/getting-started" },
  { label: "Theming", to: "/docs/theming" },
  { label: "Components", to: "/docs/components" },
];

const components: ComponentMeta[] = [
  {
    name: "Button",
    href: "/docs/components/button",
    summary: "Action primitives with six variants and compact sizing.",
    packageImport: 'import { Button } from "@usememos/ui";',
  },
  {
    name: "Dialog",
    href: "/docs/components/dialog",
    summary: "Compound overlay API with header, footer, title, and description slots.",
    packageImport: 'import { Dialog } from "@usememos/ui";',
  },
  {
    name: "Select",
    href: "/docs/components/select",
    summary: "Base UI powered select surface with labels, groups, and item indicators.",
    packageImport: 'import { Select } from "@usememos/ui";',
  },
  {
    name: "Input",
    href: "/docs/components/input",
    summary: "Native text input styled on the same form control sizing scale.",
    packageImport: 'import { Input } from "@usememos/ui";',
  },
  {
    name: "Checkbox",
    href: "/docs/components/controls",
    summary: "Compact boolean control that shares the same token system as buttons and inputs.",
    packageImport: 'import { Checkbox } from "@usememos/ui";',
  },
  {
    name: "Switch",
    href: "/docs/components/controls",
    summary: "Binary control with a minimal visual language and token-driven state colors.",
    packageImport: 'import { Switch } from "@usememos/ui";',
  },
  {
    name: "Dropdown Menu",
    href: "/docs/components/overlays",
    summary: "Menu primitives for grouped commands, radio items, and nested actions.",
    packageImport: 'import { DropdownMenu } from "@usememos/ui";',
  },
  {
    name: "Popover",
    href: "/docs/components/overlays",
    summary: "Lightweight positioned surface for inline detail and small workflows.",
    packageImport: 'import { Popover } from "@usememos/ui";',
  },
  {
    name: "Tooltip",
    href: "/docs/components/overlays",
    summary: "Quick descriptive overlays with a small API surface.",
    packageImport: 'import { Tooltip } from "@usememos/ui";',
  },
];

const docsPages: Record<string, DocPage> = {
  "getting-started": {
    title: "Getting Started",
    eyebrow: "Install",
    intro:
      "Ship the packaged CSS once, then pull components in as regular React imports. The library keeps theme concerns in CSS variables instead of a runtime theme object.",
    section: "Guide",
    body: (
      <>
        <DocSection title="Install">
          <CodeBlock
            code={`pnpm add @usememos/ui react react-dom`}
            language="bash"
          />
          <CodeBlock
            code={`import "@usememos/ui/theme.css";\nimport { Button, Dialog, Select } from "@usememos/ui";`}
            language="tsx"
          />
        </DocSection>
        <DocSection title="Why this structure">
          <FeatureList
            items={[
              "Theme tokens live in CSS variables, so subtree theming is straightforward.",
              "The public API stays close to Base UI primitives instead of hiding them behind a heavy config layer.",
              "Buttons, controls, overlays, and selection components all read from the same token map.",
            ]}
          />
        </DocSection>
        <DocSection title="Starter composition">
          <ExampleFrame
            title="Small starter"
            description="A minimal page can import the theme once and compose the library directly."
          >
            <div className="docs-stack">
              <Button>Save changes</Button>
              <div style={{ width: "100%", maxWidth: 320 }}>
                <Select.Root defaultValue="react">
                  <Select.Trigger aria-label="Framework">
                    <Select.Value placeholder="Pick one" />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="react">React</Select.Item>
                    <Select.Item value="vue">Vue</Select.Item>
                    <Select.Item value="svelte">Svelte</Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>
            </div>
          </ExampleFrame>
        </DocSection>
      </>
    ),
  },
  theming: {
    title: "Theming",
    eyebrow: "Tokens",
    intro:
      "The theme layer is built on semantic CSS variables. Light and dark modes simply redefine the same token names, so component styles do not need parallel implementations.",
    section: "Guide",
    body: (
      <>
        <DocSection title="Core color tokens">
          <CodeBlock
            code={`:root {\n  --mui-color-background: oklch(0.985 0.0015 260);\n  --mui-color-foreground: oklch(0.205 0.004 260);\n  --mui-color-card: oklch(1 0 0);\n  --mui-color-popover: oklch(1 0 0);\n  --mui-color-primary: oklch(0.245 0.006 260);\n  --mui-color-secondary: oklch(0.952 0.002 260);\n  --mui-color-muted: oklch(0.943 0.002 260);\n  --mui-color-accent: oklch(0.93 0.003 260);\n  --mui-color-border: oklch(0.895 0.003 260);\n  --mui-color-input: oklch(0.84 0.003 260);\n  --mui-color-ring: oklch(0.52 0.085 155);\n}`}
            language="css"
          />
          <FeatureList
            items={[
              "The color model is semantic: background, card, popover, foreground, border, input, primary, secondary, accent, destructive, and ring.",
              "Dark mode uses the same token names and only swaps their values.",
              "Any subtree can opt into a theme with `data-mui-theme`.",
            ]}
          />
        </DocSection>
        <DocSection title="Subtree override">
          <CodeBlock
            code={`<section data-mui-theme="dark">\n  <Button variant="outline">Scoped dark section</Button>\n</section>`}
            language="tsx"
          />
        </DocSection>
        <DocSection title="Site toggle">
          <ExampleFrame
            title="Theme-aware surfaces"
            description="The documentation site itself uses the same token layer, which keeps the product and docs visually aligned."
          >
            <div className="theme-preview">
              <div className="theme-preview__surface">
                <span>Surface</span>
                <Button size="sm">Primary action</Button>
              </div>
              <div className="theme-preview__surface theme-preview__surface--muted">
                <span>Muted layer</span>
                <Button variant="secondary" size="sm">
                  Secondary
                </Button>
              </div>
            </div>
          </ExampleFrame>
        </DocSection>
      </>
    ),
  },
  components: {
    title: "Components",
    eyebrow: "Catalog",
    intro:
      "The library stays intentionally small. Each exported piece maps closely to a Base UI primitive and reads from the shared token layer.",
    section: "Components",
    body: (
      <section className="component-grid">
        {components.map((component) => (
          <Link key={component.name} className="component-card" to={component.href}>
            <span className="component-card__name">{component.name}</span>
            <span className="component-card__summary">{component.summary}</span>
            <code>{component.packageImport}</code>
          </Link>
        ))}
      </section>
    ),
  },
  button: {
    title: "Button",
    eyebrow: "Foundation",
    intro:
      "Buttons cover the common action states without adding extra configuration layers. Variants and sizes map directly to data attributes that the theme CSS styles.",
    section: "Components",
    body: (
      <>
        <DocSection title="Variants">
          <ExampleFrame
            title="Six variants"
            description="Default, secondary, outline, ghost, destructive, and link cover the shared action hierarchy."
          >
            <div className="button-row">
              <Button>Save</Button>
              <Button variant="secondary">Archive</Button>
              <Button variant="outline">Preview</Button>
              <Button variant="ghost">Skip</Button>
              <Button variant="destructive">Delete</Button>
              <Button variant="link">Learn more</Button>
            </div>
          </ExampleFrame>
          <CodeBlock
            code={`<Button>Save</Button>\n<Button variant="secondary">Archive</Button>\n<Button variant="outline">Preview</Button>\n<Button variant="ghost">Skip</Button>\n<Button variant="destructive">Delete</Button>\n<Button variant="link">Learn more</Button>`}
            language="tsx"
          />
        </DocSection>
        <DocSection title="Sizes">
          <ExampleFrame
            title="Shared sizing scale"
            description="The button uses the same spacing and radius tokens as the rest of the library."
          >
            <div className="button-row">
              <Button size="xs">Extra Small</Button>
              <Button size="sm">Small</Button>
              <Button size="md">Base</Button>
              <Button size="lg">Large</Button>
            </div>
          </ExampleFrame>
        </DocSection>
      </>
    ),
  },
  dialog: {
    title: "Dialog",
    eyebrow: "Overlay",
    intro:
      "Dialog is exposed as a compound API so the document structure stays explicit. The wrapper adds a consistent overlay, content surface, and close affordance.",
    section: "Components",
    body: (
      <>
        <DocSection title="Composition">
          <CodeBlock
            code={`<Dialog.Root>\n  <Dialog.Trigger render={<Button />}>Open dialog</Dialog.Trigger>\n  <Dialog.Content>\n    <Dialog.Header>\n      <Dialog.Title>Invite teammate</Dialog.Title>\n      <Dialog.Description>Share access with a collaborator.</Dialog.Description>\n    </Dialog.Header>\n  </Dialog.Content>\n</Dialog.Root>`}
            language="tsx"
          />
        </DocSection>
        <DocSection title="Live demo">
          <DialogPreview />
        </DocSection>
      </>
    ),
  },
  select: {
    title: "Select",
    eyebrow: "Selection",
    intro:
      "Select wraps the Base UI primitive into a compact API that already carries trigger sizing, item indicators, labels, and separators.",
    section: "Components",
    body: (
      <>
        <DocSection title="Live demo">
          <SelectPreview />
        </DocSection>
        <DocSection title="Import">
          <CodeBlock
            code={`import { Select } from "@usememos/ui";`}
            language="tsx"
          />
        </DocSection>
      </>
    ),
  },
  input: {
    title: "Input",
    eyebrow: "Foundation",
    intro:
      "Input keeps the native element surface and maps sizing to the same data attributes used by the rest of the form controls.",
    section: "Components",
    body: (
      <>
        <DocSection title="Live demo">
          <InputPreview />
        </DocSection>
        <DocSection title="Import">
          <CodeBlock
            code={`import { Input } from "@usememos/ui";\n\n<Input aria-label="Project name" placeholder="Project name" />\n<Input size="sm" aria-label="Slug" placeholder="memo-ui" />`}
            language="tsx"
          />
        </DocSection>
      </>
    ),
  },
  controls: {
    title: "Controls",
    eyebrow: "Foundation",
    intro:
      "Checkbox, switch, radio group, and separator intentionally stay minimal. They exist to expose accessible primitives with the same visual language as the rest of the kit.",
    section: "Components",
    body: <ControlsPreview />,
  },
  overlays: {
    title: "Lightweight Overlays",
    eyebrow: "Overlay",
    intro:
      "Popover, tooltip, and dropdown menu cover quick context without introducing another styling system. They share the same surface, border, and shadow tokens as dialog and select.",
    section: "Components",
    body: <OverlayPreview />,
  },
};

const sidebarGroups = [
  {
    label: "Guide",
    items: [
      { title: "Getting Started", href: "/docs/getting-started" },
      { title: "Theming", href: "/docs/theming" },
    ],
  },
  {
    label: "Components",
    items: [
      { title: "Catalog", href: "/docs/components" },
      { title: "Button", href: "/docs/components/button" },
      { title: "Dialog", href: "/docs/components/dialog" },
      { title: "Select", href: "/docs/components/select" },
      { title: "Input", href: "/docs/components/input" },
      { title: "Controls", href: "/docs/components/controls" },
      { title: "Lightweight Overlays", href: "/docs/components/overlays" },
    ],
  },
];

export function App() {
  const [theme, setTheme] = React.useState<ThemeMode>("light");

  React.useEffect(() => {
    document.documentElement.dataset.muiTheme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  return (
    <BrowserRouter>
      <div className="docs-app" data-mui-theme={theme}>
        <SiteHeader
          theme={theme}
          onThemeToggle={() =>
            setTheme((current) => (current === "light" ? "dark" : "light"))
          }
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/docs/:slug" element={<DocsPage />} />
          <Route path="/docs/components/:slug" element={<DocsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

function SiteHeader({
  theme,
  onThemeToggle,
}: {
  theme: ThemeMode;
  onThemeToggle: () => void;
}) {
  const location = useLocation();

  return (
    <header className="site-header">
      <Link className="site-logo" to="/">
        <span>usememos</span>
        <strong>/ui</strong>
      </Link>
      <nav className="site-nav" aria-label="Primary">
        {primaryNav.map((item) => {
          const active =
            location.pathname === item.to ||
            location.pathname.startsWith(`${item.to}/`);

          return (
            <NavLink
              key={item.to}
              className={`site-nav__link${active ? " site-nav__link--active" : ""}`}
              to={item.to}
            >
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      <div className="site-actions">
        <a
          className="site-link"
          href="https://github.com/usememos/ui"
          rel="noreferrer"
          target="_blank"
        >
          GitHub
        </a>
        <button className="theme-toggle" onClick={onThemeToggle} type="button">
          {theme === "light" ? "Dark" : "Light"} mode
        </button>
      </div>
    </header>
  );
}

function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="hero__backdrop" />
        <div className="hero__content">
          <p className="hero__eyebrow">React UI library</p>
          <h1>
            Token-first components with a cleaner surface than a giant theme object.
          </h1>
          <p className="hero__copy">
            usememos/ui wraps Base UI primitives with a shared CSS token layer,
            a compact compound API, and a visual system that stays easy to override.
          </p>
          <div className="hero__actions">
            <Link className="hero__primary" to="/docs/getting-started">
              Start with the docs
            </Link>
            <Link className="hero__secondary" to="/docs/components">
              Browse components
            </Link>
          </div>
        </div>
        <ComponentStage />
      </section>
      <section className="home-band">
        <div>
          <p className="home-band__label">Why it feels familiar</p>
          <h2>Built the way current component libraries are actually shipped.</h2>
        </div>
        <div className="home-band__copy">
          <p>
            Semantic CSS variables for theming, compound React APIs for overlays
            and selections, and a docs surface that reads more like a product site
            than a component laboratory.
          </p>
        </div>
      </section>
      <section className="home-section">
        <div className="section-heading">
          <p>System</p>
          <h2>Three layers, one visual language.</h2>
        </div>
        <div className="layer-list">
          <article>
            <span>01</span>
            <h3>Base UI primitives</h3>
            <p>Accessibility and positioning come from headless primitives, not custom reinvention.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Theme tokens</h3>
            <p>Light and dark modes only swap semantic variables such as `card`, `accent`, and `ring`.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Opinionated wrappers</h3>
            <p>Components expose the right defaults without locking you into a heavy runtime theme API.</p>
          </article>
        </div>
      </section>
      <section className="home-section">
        <div className="section-heading">
          <p>Catalog</p>
          <h2>Focused primitives instead of a sprawling surface area.</h2>
        </div>
        <div className="component-grid">
          {components.map((component) => (
            <Link key={component.name} className="component-card" to={component.href}>
              <span className="component-card__name">{component.name}</span>
              <span className="component-card__summary">{component.summary}</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="home-section home-section--cta">
        <div className="section-heading">
          <p>Start</p>
          <h2>Import the CSS once, then compose the pieces you need.</h2>
        </div>
        <CodeBlock
          code={`pnpm add @usememos/ui react react-dom\n\nimport "@usememos/ui/theme.css";\nimport { Button, Dialog } from "@usememos/ui";`}
          language="bash"
        />
      </section>
    </main>
  );
}

function DocsPage() {
  const location = useLocation();
  const slug = location.pathname
    .replace(/^\/docs\//, "")
    .replace(/^components\//, "");
  const page = docsPages[slug];

  if (!page) {
    return (
      <main className="docs-layout">
        <DocsSidebar />
        <section className="docs-content">
          <p className="doc-eyebrow">Missing</p>
          <h1>Page not found</h1>
          <p className="doc-intro">
            The requested documentation page does not exist yet.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="docs-layout">
      <DocsSidebar />
      <section className="docs-content">
        <p className="doc-eyebrow">{page.eyebrow}</p>
        <div className="doc-heading">
          <div>
            <h1>{page.title}</h1>
            <p className="doc-intro">{page.intro}</p>
          </div>
          <span className="doc-chip">{page.section}</span>
        </div>
        {page.body}
      </section>
    </main>
  );
}

function DocsSidebar() {
  return (
    <aside className="docs-sidebar">
      {sidebarGroups.map((group) => (
        <section key={group.label} className="docs-sidebar__group">
          <p>{group.label}</p>
          {group.items.map((item) => (
            <NavLink
              key={item.href}
              className={({ isActive }) =>
                `docs-sidebar__link${isActive ? " docs-sidebar__link--active" : ""}`
              }
              to={item.href}
            >
              {item.title}
            </NavLink>
          ))}
        </section>
      ))}
    </aside>
  );
}

function ComponentStage() {
  const [notifications, setNotifications] = React.useState(true);
  const [density, setDensity] = React.useState("comfortable");

  return (
    <div className="stage">
      <div className="stage__rail">
        <span>Base UI wrappers</span>
        <span>Shared CSS tokens</span>
        <span>Compound APIs</span>
      </div>
      <div className="stage__surface">
        <div className="stage__topline">
          <span>Release command</span>
          <Separator />
          <span>v0.1.0</span>
        </div>
        <div className="stage__row">
          <h3>Ship new tokens without rewriting components.</h3>
          <Button size="sm">Publish</Button>
        </div>
        <div className="stage__controls">
          <label className="stage__field">
            <span>Density</span>
            <Select.Root
              defaultValue={density}
              onValueChange={(value) => setDensity(String(value))}
            >
              <Select.Trigger aria-label="Density">
                <Select.Value placeholder="Choose density" />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="comfortable">Comfortable</Select.Item>
                <Select.Item value="compact">Compact</Select.Item>
                <Select.Item value="spacious">Spacious</Select.Item>
              </Select.Content>
            </Select.Root>
          </label>
          <label className="stage__switch">
            <span>Notifications</span>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </label>
        </div>
        <div className="stage__footer">
          <Button variant="outline" size="sm">
            Preview
          </Button>
          <Button variant="ghost" size="sm">
            Inspect tokens
          </Button>
        </div>
      </div>
    </div>
  );
}

function DialogPreview() {
  return (
    <ExampleFrame
      title="Invite flow"
      description="A compact dialog composition with explicit header, description, and footer slots."
    >
      <Dialog.Root>
        <Dialog.Trigger render={<Button />}>Open dialog</Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Invite teammate</Dialog.Title>
            <Dialog.Description>
              Share access with a collaborator and keep the wrapper markup explicit.
            </Dialog.Description>
          </Dialog.Header>
          <div className="docs-stack">
            <Button>Send invite</Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </ExampleFrame>
  );
}

function SelectPreview() {
  return (
    <ExampleFrame
      title="Grouped options"
      description="Select provides grouped labels, separators, and item indicators out of the box."
    >
      <div style={{ width: "100%", maxWidth: 320 }}>
        <Select.Root defaultValue="react">
          <Select.Trigger aria-label="Framework">
            <Select.Value placeholder="Choose a framework" />
          </Select.Trigger>
          <Select.Content>
            <Select.Group>
              <Select.Label>Frontend</Select.Label>
              <Select.Item value="react">React</Select.Item>
              <Select.Item value="vue">Vue</Select.Item>
              <Select.Item value="svelte">Svelte</Select.Item>
            </Select.Group>
            <Select.Separator />
            <Select.Group>
              <Select.Label>Backend</Select.Label>
              <Select.Item value="node">Node.js</Select.Item>
              <Select.Item value="go">Go</Select.Item>
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
    </ExampleFrame>
  );
}

function InputPreview() {
  const controlSizes = ["xs", "sm", "md", "lg"] as const;

  return (
    <ExampleFrame
      title="Shared field sizing"
      description="The native input receives the same size tokens and focus treatment as select and boolean controls."
    >
      <div className="input-demo">
        {controlSizes.map((size) => (
          <label className="input-demo__row" key={size}>
            <span>{size.toUpperCase()}</span>
            <Input
              aria-label={`${size} input`}
              placeholder={size === "xs" ? "Short label" : "Project name"}
              size={size}
            />
          </label>
        ))}
      </div>
    </ExampleFrame>
  );
}

function ControlsPreview() {
  const [notifications, setNotifications] = React.useState(true);
  const [selectedChannel, setSelectedChannel] = React.useState("stable");
  const controlSizes = ["xs", "sm", "md", "lg"] as const;

  return (
    <>
      <DocSection title="Live preview">
        <ExampleFrame
          title="Boolean and choice controls"
          description="These primitives stay visually restrained so they can sit next to heavier surfaces without competing for attention."
        >
          <div className="controls-demo">
            <div className="control-size-grid">
              {controlSizes.map((size) => (
                <div className="control-size-grid__row" key={size}>
                  <span>{size.toUpperCase()}</span>
                  <Select.Root defaultValue="comfortable">
                    <Select.Trigger aria-label={`${size} density`} size={size}>
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value="comfortable">Comfortable</Select.Item>
                      <Select.Item value="compact">Compact</Select.Item>
                    </Select.Content>
                  </Select.Root>
                  <Checkbox defaultChecked size={size} />
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                    size={size}
                  />
                  <RadioGroup.Root defaultValue="stable">
                    <RadioGroup.Item aria-label={`${size} radio`} size={size} value="stable" />
                  </RadioGroup.Root>
                </div>
              ))}
            </div>
            <label className="control-row">
              <Checkbox defaultChecked />
              <span>Enable release notes</span>
            </label>
            <label className="control-row control-row--split">
              <span>Send notifications</span>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </label>
            <div className="radio-demo">
              <span>Release channel</span>
              <RadioGroup.Root
                onValueChange={(value) => setSelectedChannel(String(value))}
                value={selectedChannel}
              >
                <label className="control-row">
                  <RadioGroup.Item value="stable" aria-label="Stable" />
                  <span>Stable</span>
                </label>
                <label className="control-row">
                  <RadioGroup.Item value="canary" aria-label="Canary" />
                  <span>Canary</span>
                </label>
              </RadioGroup.Root>
            </div>
          </div>
        </ExampleFrame>
      </DocSection>
      <DocSection title="Separator">
        <CodeBlock
          code={`<Separator />`}
          language="tsx"
        />
      </DocSection>
    </>
  );
}

function OverlayPreview() {
  const [align, setAlign] = React.useState("start");

  return (
    <>
      <DocSection title="Live preview">
        <ExampleFrame
          title="Popover, tooltip, and menu"
          description="Lighter overlays share the same border, surface, and shadow tokens as dialog and select."
        >
          <div className="overlay-demo">
            <Popover.Root>
              <Popover.Trigger render={<Button variant="outline" />}>
                View details
              </Popover.Trigger>
              <Popover.Content sideOffset={10}>
                <div className="docs-stack" style={{ minWidth: 220 }}>
                  <strong>Popover</strong>
                  <span>Small contextual surfaces can stay close to the trigger.</span>
                </div>
              </Popover.Content>
            </Popover.Root>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger render={<Button variant="outline" />}>
                Commands
              </DropdownMenu.Trigger>
              <DropdownMenu.Content sideOffset={10}>
                <DropdownMenu.Label>Align</DropdownMenu.Label>
                <DropdownMenu.RadioGroup
                  onValueChange={(value) => setAlign(String(value))}
                  value={align}
                >
                  <DropdownMenu.RadioItem value="start">
                    Start
                  </DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value="center">
                    Center
                  </DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value="end">End</DropdownMenu.RadioItem>
                </DropdownMenu.RadioGroup>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger render={<Button variant="ghost" />}>
                  Hover target
                </Tooltip.Trigger>
                <Tooltip.Content sideOffset={8}>
                  Token-driven help text.
                </Tooltip.Content>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        </ExampleFrame>
      </DocSection>
      <DocSection title="Import">
        <CodeBlock
          code={`import { DropdownMenu, Popover, Tooltip } from "@usememos/ui";`}
          language="tsx"
        />
      </DocSection>
    </>
  );
}

function DocSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="doc-section">
      <div className="doc-section__header">
        <h2>{title}</h2>
      </div>
      <div className="doc-section__body">{children}</div>
    </section>
  );
}

function ExampleFrame({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="example-frame">
      <div className="example-frame__header">
        <div>
          <strong>{title}</strong>
          <p>{description}</p>
        </div>
      </div>
      <div className="example-frame__canvas">{children}</div>
    </div>
  );
}

function CodeBlock({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  return (
    <pre className="code-block">
      <span>{language}</span>
      <code>{code}</code>
    </pre>
  );
}

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="feature-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
