import { createContext, useContext } from 'react';
import type { Size } from '../types';

/** The size set on a component's Root, read by its parts. */
export const SizeContext = createContext<Size | undefined>(undefined);

/** The size to render at: the component's own prop, else the nearest Root's, else md. */
export function useSize(size?: Size): Size {
  const inherited = useContext(SizeContext);
  return size ?? inherited ?? 'md';
}

/** useSize for components without xs: text entry, menus, tabs and tables. An xs inherited from a parent renders them at sm. */
export function useRowSize(size?: Exclude<Size, 'xs'>): Exclude<Size, 'xs'> {
  const resolved = useSize(size);
  return resolved === 'xs' ? 'sm' : resolved;
}
