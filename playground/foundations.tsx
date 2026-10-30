import { Bold, Pin, Search, Trash2 } from 'lucide-react';
import colorDocs from '../docs/color.md?raw';
import type { Size } from '@usememos/ui';

const sizes: Size[] = ['xs', 'sm', 'md'];

/** Color token names, read from the table in docs/color.md. */
const colors = [...colorDocs.matchAll(/^\| `([\w-]+)` \|/gm)].map(([, name = '']) => name);

const typeStyles = ['display', 'heading', 'title', 'label', 'body', 'label-sm', 'caption', 'label-xs'];

/** Tokens, depth roles, type and icons: what every component is built from. */
export function Foundations() {
  return (
    <>
      <section className="pg-section" id="color">
        <h2 className="mu-heading">Color</h2>
        <div className="pg-swatches">
          {colors.map((name) => (
            <div className="pg-swatch" key={name}>
              <span style={{ background: `var(--${name})` }} />
              <span className="mu-caption">{name}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="pg-section" id="depth">
        <h2 className="mu-heading">Depth</h2>
        <div className="pg-row mu-base mu-s-md">
          <div className="pg-box mu-recessed">Recessed</div>
          <div className="pg-well mu-recessed">
            <span className="mu-key">Key</span>
            <span>Off</span>
          </div>
          <div className="pg-box mu-raised">Raised</div>
          <div className="pg-box mu-popup">Popup</div>
        </div>
      </section>

      <section className="pg-section" id="type">
        <h2 className="mu-heading">Type</h2>
        {typeStyles.map((style) => (
          <div className={`mu-${style}`} key={style}>
            {style}: Write it down before it slips away
          </div>
        ))}
      </section>

      <section className="pg-section" id="sizes">
        <h2 className="mu-heading">Sizes and icons</h2>
        {sizes.map((size) => (
          <div className={`pg-row mu-base mu-s-${size}`} key={size}>
            <span className="pg-control mu-raised">
              <Pin aria-hidden />
              {size}
            </span>
            <Search aria-hidden />
            <Bold aria-hidden />
            <Trash2 aria-hidden />
          </div>
        ))}
      </section>
    </>
  );
}
