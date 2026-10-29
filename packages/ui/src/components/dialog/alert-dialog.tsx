import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import type { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import { createDialogParts, type PopupProps as SharedPopupProps } from './parts';

export type { CloseProps, DescriptionProps, FooterProps, RootProps, TitleProps, TriggerProps } from './parts';
export type PopupProps = SharedPopupProps;

// AlertDialog has Dialog's anatomy; it only stays open on a backdrop click.
const parts = createDialogParts(BaseAlertDialog as unknown as typeof BaseDialog, 'alert-dialog', false);

/** Groups a trigger and a confirmation. Closes only through its buttons. */
export const Root = parts.Root;
/** Opens the confirmation. Usually `render={<Button />}`. */
export const Trigger = parts.Trigger;
/** The panel over a dimmed backdrop, without an X. A sheet from the bottom below `breakpoint-sm`. */
export const Popup = parts.Popup as ForwardRefExoticComponent<PopupProps & RefAttributes<HTMLDivElement>>;
/** The question, an `<h2>`: "Delete this note?". */
export const Title = parts.Title;
/** What will happen, a `<p>` under the title. */
export const Description = parts.Description;
/** Closes the confirmation: the Cancel button. */
export const Close = parts.Close;
/** Right-aligns Cancel and the action. Stacks them full width in a sheet. */
export const Footer = parts.Footer;
