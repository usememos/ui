import { Prose } from '@usememos/ui';
import type { SectionProps } from '.';

/** Markdown as a renderer outputs it: plain elements, GFM task lists and tables. */
export function ProseSection({ size }: SectionProps) {
  return (
    <Prose size={size === 'sm' ? 'sm' : 'md'} style={{ maxWidth: 'var(--content-width)' }}>
      <h1>Weekly review</h1>
      <p>
        A short note on what moved this week. The <a href="#prose">sync bug</a> is fixed, and <strong>exports</strong> now keep <em>attachments</em>. Run{' '}
        <code>memos --backup</code> before upgrading. <span className="mu-prose-tag">#review</span>
      </p>
      <h2>Done</h2>
      <ul>
        <li>
          <input type="checkbox" defaultChecked disabled aria-label="Ship the new editor" /> Ship the new editor
        </li>
        <li>
          <input type="checkbox" disabled aria-label="Write the release notes" /> Write the release notes
        </li>
      </ul>
      <h3>Notes</h3>
      <ol>
        <li>Backups run every night.</li>
        <li>
          Tokens expire after 30 days.
          <ul>
            <li>Rotate them from settings.</li>
          </ul>
        </li>
      </ol>
      <blockquote>
        <p>Write it down before you forget it.</p>
      </blockquote>
      <pre>
        <code>{'const memo = await client.memos.create({\n  content: "Hello",\n});'}</code>
      </pre>
      <table>
        <thead>
          <tr>
            <th>Plan</th>
            <th>Storage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Free</td>
            <td>1 GB</td>
          </tr>
          <tr>
            <td>Pro</td>
            <td>100 GB</td>
          </tr>
        </tbody>
      </table>
      <hr />
      <p>
        <del>Old plan</del> replaced on 29 Oct.
      </p>
    </Prose>
  );
}
