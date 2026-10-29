import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import { createDialogParts, type PopupProps as SharedPopupProps } from './parts';

export type { CloseProps, DescriptionProps, FooterProps, RootProps, TitleProps, TriggerProps } from './parts';

export interface PopupProps extends SharedPopupProps {
  /** The accessible name of the X button at the top right. Default "Close". */
  closeLabel?: string;
}

const parts = createDialogParts(BaseDialog, 'dialog', true);

/** Groups a trigger and its dialog. Controlled with `open` and `onOpenChange`. */
export const Root = parts.Root;
/** Opens the dialog. Usually `render={<Button />}`. */
export const Trigger = parts.Trigger;
/** The panel over a dimmed backdrop, with an X at the top right. A sheet from the bottom below `breakpoint-sm`. */
export const Popup = parts.Popup as ForwardRefExoticComponent<PopupProps & RefAttributes<HTMLDivElement>>;
/** The dialog's heading, an `<h2>`: a question or a task. */
export const Title = parts.Title;
/** What will happen, a `<p>` under the title. */
export const Description = parts.Description;
/** Closes the dialog. Usually `render={<Button variant="ghost" />}` for Cancel. */
export const Close = parts.Close;
/** Right-aligns the buttons at the end of the dialog: Cancel, then the action. Stacks them full width in a sheet. */
export const Footer = parts.Footer;
