import type { ReactElement } from "react";

/** Control size. One value sets height, padding, text, icon size and radius together. */
export type Size = "sm" | "md" | "lg";

/** Status tone for components that report a status, such as Toast and Badge. */
export type Tone = "neutral" | "success" | "warning" | "danger";

/** A Lucide icon element, such as `<Pin />` from lucide-react. Size and stroke come from the component. */
export type IconElement = ReactElement;
