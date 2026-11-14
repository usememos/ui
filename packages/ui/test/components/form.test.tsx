// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import { Button, Field, Form, Input, Table } from '../../src';
import { render } from '../render';
describe('Form', () => {
  it('is a form named by its Title, boxed only when bordered, and md inside a sized parent', () => {
    const { container } = render(
      <Table.Root size="sm" aria-label="Rules">
        <caption>
          <Form.Root bordered>
            <Form.Title>Add a tag rule</Form.Title>
            <Form.Description>Tag new notes.</Form.Description>
            <Field.Root name="tag">
              <Field.Label>Tag</Field.Label>
              <Input />
            </Field.Root>
            <Form.Footer>
              <Button type="submit">Add rule</Button>
            </Form.Footer>
          </Form.Root>
        </caption>
      </Table.Root>,
    );
    const form = container.querySelector('form')!;
    const title = form.querySelector('h2')!;
    expect(form.className).toContain('mu-form-bordered');
    expect(form.getAttribute('aria-labelledby')).toBe(title.id);
    expect(title.className).toBe('mu-form-title mu-label');
    expect(form.querySelector('.mu-form-footer > button')!.className).toContain('mu-s-md');
  });

  it('takes aria-label instead of a title, and render for another heading level', () => {
    const { container } = render(
      <>
        <Form.Root aria-label="Search" />
        <Form.Root>
          <Form.Title render={<h3 />}>Profile</Form.Title>
        </Form.Root>
      </>,
    );
    const [search, profile] = [...container.querySelectorAll('form')] as [HTMLFormElement, HTMLFormElement];
    expect(search.className).not.toContain('mu-form-bordered');
    expect(search.hasAttribute('aria-labelledby')).toBe(false);
    expect(search.getAttribute('aria-label')).toBe('Search');
    expect(profile.getAttribute('aria-labelledby')).toBe(profile.querySelector('h3')!.id);
  });
});
