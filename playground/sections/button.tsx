import { Button, buttonClasses, type ButtonVariant } from '@usememos/ui';
import { ArrowRight, Ellipsis, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { SectionProps } from '.';

const variants: ButtonVariant[] = ['primary', 'neutral', 'ghost', 'danger'];

export function ButtonSection({ size }: SectionProps) {
  const [saving, setSaving] = useState(false);
  return (
    <>
      {variants.map((variant) => (
        <div className="pg-row" key={variant} data-variant={variant}>
          <Button variant={variant} size={size}>
            {variant === 'danger' ? 'Delete' : 'Save'}
          </Button>
          <Button variant={variant} size={size} icon={variant === 'danger' ? <Trash2 /> : <Plus />}>
            {variant === 'danger' ? 'Delete' : 'New note'}
          </Button>
          <Button variant={variant} size={size} icon={<Ellipsis />} aria-label="More actions" />
          <Button variant={variant} size={size} loading>
            Save
          </Button>
          <Button variant={variant} size={size} disabled>
            Save
          </Button>
        </div>
      ))}
      <div className="pg-row">
        <Button
          variant="primary"
          size={size}
          loading={saving}
          loadingLabel="Saving"
          onClick={() => {
            setSaving(true);
            setTimeout(() => setSaving(false), 1500);
          }}
        >
          Save changes
        </Button>
        <a className={buttonClasses({ variant: 'neutral', size })} href="#button">
          Open docs
          <ArrowRight aria-hidden />
        </a>
      </div>
    </>
  );
}
