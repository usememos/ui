import { Badge, Button, Field, Form, Input, List, Prose, Select, Switch, Table, Textarea } from '@usememos/ui';
import { Ellipsis, Globe, Hash, Lock, MessageCircle, SmilePlus } from 'lucide-react';

const tokens = [
  { id: 1, name: 'Deploy hook', created: '12 May 2026', uses: 1204 },
  { id: 2, name: 'Alfred', created: '3 Jun 2026', uses: 87 },
  { id: 3, name: 'Widget on iPad', created: '28 Oct 2026', uses: 3 },
];

const entries = [
  {
    who: 'Steven',
    when: '2 hours ago',
    visibility: 'Private',
    body: (
      <>
        <p>
          The sync bug is fixed, and exports now keep attachments. Run <code>memos --backup</code> before upgrading.
        </p>
        <ul>
          <li>Ship the new editor</li>
          <li>Write the release notes</li>
        </ul>
      </>
    ),
    tags: ['review', 'release'],
    comments: 3,
  },
  {
    who: 'Lily',
    when: 'Yesterday',
    visibility: 'Public',
    body: <p>Write it down before you forget it.</p>,
    tags: ['ideas'],
    comments: 0,
  },
];

/**
 * A settings page as docs/patterns.md describes it (Page and Form): a page
 * header, then sections of a label title and a List, a bordered Form or a
 * bordered Table. The page's own gaps are ladder steps only; see
 * docs/layout.md#spacing. Headings start at h3 because the screen sits inside
 * a section of the test page; in an app they are h1 and h2.
 */
function SettingsScreen() {
  return (
    <div className="pg-screen pg-screen-page">
      <header className="pg-screen-head">
        <h3 className="mu-heading">Workspace settings</h3>
        <p className="mu-body">Who can read your notes and how they look.</p>
      </header>
      <section className="pg-screen-section">
        <h4 className="mu-label" id="screen-reading">
          Reading
        </h4>
        <List.Root aria-labelledby="screen-reading">
          <List.Item>
            <Field.Root orientation="horizontal">
              <Field.Label>Wide layout</Field.Label>
              <Field.Description>Use the full width on large screens.</Field.Description>
              <Switch />
            </Field.Root>
          </List.Item>
          <List.Item>
            <Field.Root orientation="horizontal">
              <Field.Label>Open links in a new tab</Field.Label>
              <Switch defaultChecked />
            </Field.Root>
          </List.Item>
          <List.Item>
            <Field.Root orientation="horizontal">
              <Field.Label>New notes are</Field.Label>
              <Select.Root items={{ private: 'Private', public: 'Public' }} defaultValue="private">
                <Select.Trigger>
                  <Select.Value />
                </Select.Trigger>
                <Select.Popup>
                  <Select.Item value="private">Private</Select.Item>
                  <Select.Item value="public">Public</Select.Item>
                </Select.Popup>
              </Select.Root>
            </Field.Root>
          </List.Item>
        </List.Root>
      </section>
      <section className="pg-screen-section">
        <h4 className="mu-label" id="screen-shortcuts">
          Text shortcuts
        </h4>
        <List.Root aria-labelledby="screen-shortcuts">
          {[
            ['td', 'todo'],
            ['rd', 'reading'],
          ].map(([short, tag]) => (
            <List.Item key={short} className="pg-list-record">
              <span className="pg-screen-cluster">
                <Badge icon={<Hash />}>{tag}</Badge>
                <span className="mu-caption pg-screen-muted">Typing ;{short} adds this tag</span>
              </span>
              <Button aria-label={`Change the shortcut for ${tag}`}>Change</Button>
            </List.Item>
          ))}
        </List.Root>
        <Form.Root bordered onSubmit={(event) => event.preventDefault()}>
          {/* One level under the section title; an h3 in an app, where the section title is an h2. */}
          <Form.Title render={<h5 />}>New shortcut</Form.Title>
          <Form.Description>Type a few letters to add a tag.</Form.Description>
          <Field.Root name="shortcut">
            <Field.Label>Letters</Field.Label>
            <Input defaultValue="tr" />
            <Field.Description>Two to four lowercase letters.</Field.Description>
          </Field.Root>
          <Field.Root orientation="horizontal">
            <Field.Label>Works in comments</Field.Label>
            <Switch defaultChecked />
          </Field.Root>
          <Form.Footer>
            <Button variant="ghost">Discard</Button>
            <Button variant="primary" type="submit">
              Add shortcut
            </Button>
          </Form.Footer>
        </Form.Root>
      </section>
      <section className="pg-screen-section">
        <h4 className="mu-label" id="screen-keys">
          API keys
        </h4>
        <Table.Root bordered aria-labelledby="screen-keys">
          <Table.Header>
            <Table.Row>
              <Table.Head>Name</Table.Head>
              <Table.Head>Created</Table.Head>
              <Table.Head num>Uses</Table.Head>
              <Table.Head>
                <span className="mu-visually-hidden">Actions</span>
              </Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {tokens.map((token) => (
              <Table.Row key={token.id}>
                <Table.Cell>{token.name}</Table.Cell>
                <Table.Cell muted>{token.created}</Table.Cell>
                <Table.Cell num>{token.uses.toLocaleString('en')}</Table.Cell>
                <Table.Cell num>
                  <Table.Actions>
                    <Button variant="ghost" icon={<Ellipsis />} aria-label={`Manage the key ${token.name}`} />
                  </Table.Actions>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </section>
    </div>
  );
}

/**
 * A timeline as docs/patterns.md describes an Entry: a composer, then entries
 * of a header line, the text in Prose and a footer line of tags and
 * reactions, separated by space and not by boxes.
 */
function TimelineScreen() {
  return (
    <div className="pg-screen pg-screen-timeline">
      <div className="pg-screen-composer">
        <Textarea placeholder="Any thoughts..." aria-label="Write a note" rows={2} />
        <div className="pg-screen-bar">
          <div className="pg-screen-cluster">
            <Button variant="ghost" icon={<Hash />} aria-label="Insert a tag" />
            <Button variant="ghost" icon={<Lock />} aria-label="Who can read it" />
          </div>
          <Button variant="primary">Post note</Button>
        </div>
      </div>
      {entries.map((entry) => (
        <article className="pg-screen-entry" key={entry.who}>
          <header className="pg-screen-entry-head mu-caption">
            <span>{entry.who}</span>
            <span>{entry.when}</span>
            <Badge tone="outline" icon={entry.visibility === 'Private' ? <Lock /> : <Globe />}>
              {entry.visibility}
            </Badge>
            <span className="pg-screen-spacer" />
            <Button variant="ghost" size="sm" icon={<Ellipsis />} aria-label={`Options for the note by ${entry.who}`} />
          </header>
          <Prose>{entry.body}</Prose>
          <footer className="pg-screen-cluster">
            {entry.tags.map((tag) => (
              <Badge key={tag} icon={<Hash />}>
                {tag}
              </Badge>
            ))}
            <Button variant="ghost" size="xs" icon={<SmilePlus />} aria-label={`React to the note by ${entry.who}`} />
            {entry.comments > 0 ? (
              <Button variant="ghost" size="xs" icon={<MessageCircle />} aria-label={`${entry.comments} comments on the note by ${entry.who}`}>
                {String(entry.comments)}
              </Button>
            ) : null}
          </footer>
        </article>
      ))}
    </div>
  );
}

/**
 * A page with nothing in it yet, as docs/patterns.md describes an Empty
 * state: a title, a body line and one primary Button, centered in the content
 * column. The page header has no action, so the Button is the page's one
 * primary. The title is an h4 here; in an app it is an h2 under the page's h1.
 */
function EmptyScreen() {
  return (
    <div className="pg-screen pg-screen-page">
      <header className="pg-screen-head">
        <h3 className="mu-heading">Shortcuts</h3>
        <p className="mu-body">Saved searches that open from the sidebar.</p>
      </header>
      <div className="pg-screen-empty">
        <div className="pg-screen-head">
          <h4 className="mu-title">No shortcuts yet</h4>
          <p className="mu-body">Save a search to open it again in one click.</p>
        </div>
        <Button variant="primary">Create shortcut</Button>
      </div>
    </div>
  );
}

/**
 * Three whole screens built from the components, with only ladder steps for
 * the page's own layout. Components are checked one at a time above; these
 * check how they sit together. They are md at every `?size=`, as an app's
 * pages are.
 */
export function Screens() {
  return (
    <>
      <section className="pg-section" id="screen-settings" data-screen>
        <h2 className="mu-heading">Screen: settings</h2>
        <SettingsScreen />
      </section>
      <section className="pg-section" id="screen-timeline" data-screen>
        <h2 className="mu-heading">Screen: timeline</h2>
        <TimelineScreen />
      </section>
      <section className="pg-section" id="screen-empty" data-screen>
        <h2 className="mu-heading">Screen: empty state</h2>
        <EmptyScreen />
      </section>
    </>
  );
}
