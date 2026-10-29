import { Avatar as BaseAvatar } from '@base-ui/react/avatar';
import { forwardRef } from 'react';
import { withClass } from '../../internal/class-name';
import { useSize } from '../../internal/size';
import type { Size } from '../../types';

export interface RootProps extends BaseAvatar.Root.Props {
  /** 24, 32 or 40px. */
  size?: Size;
}

/** The circle. Holds an Image and a Fallback. */
export const Root = forwardRef<HTMLSpanElement, RootProps>(function AvatarRoot({ size, className, ...props }, ref) {
  const resolved = useSize(size);
  return <BaseAvatar.Root ref={ref} {...props} className={withClass(`mu-avatar-root mu-base mu-s-${resolved}`, className)} />;
});

export interface ImageProps extends BaseAvatar.Image.Props {}

/** The photo. Shown once it has loaded. Give it an `alt` with the person's name. */
export const Image = forwardRef<HTMLImageElement, ImageProps>(function AvatarImage({ className, ...props }, ref) {
  return <BaseAvatar.Image ref={ref} {...props} className={withClass('mu-avatar-image', className)} />;
});

export interface FallbackProps extends BaseAvatar.Fallback.Props {}

/** Initials, shown while there is no photo or it fails to load. */
export const Fallback = forwardRef<HTMLSpanElement, FallbackProps>(function AvatarFallback({ className, ...props }, ref) {
  return <BaseAvatar.Fallback ref={ref} {...props} className={withClass('mu-avatar-fallback', className)} />;
});
