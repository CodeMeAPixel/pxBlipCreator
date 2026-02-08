/**
 * Shared type definitions for pxBlipCreator
 *
 * This file serves as the single source of truth for all shared types
 * used across the application. Import from here instead of duplicating
 * type definitions across files.
 */

// ─── Window Augmentation ────────────────────────────────────────────────────
// Extends the Window interface to include FiveM NUI-specific globals

declare global {
  interface Window {
    /** FiveM NUI native function — undefined in regular browsers */
    invokeNative: ((...args: unknown[]) => void) | undefined;
    /** Returns the parent resource name in FiveM NUI context */
    GetParentResourceName?: () => string;
  }
}

// ─── Blip Data Types ────────────────────────────────────────────────────────

/** A checkbox/toggle field key on the blip store */
export type CheckboxField = 'tickb' | 'outline' | 'hideb' | 'bflash' | 'sRange' | 'hideUi';

/** Group entry as stored in the form (array of name+grade pairs) */
export interface GroupField {
  name: string | null | undefined;
  grade: number | null | undefined;
}

/** Group entry as stored in the database (object keyed by group name) */
export interface GroupRecord {
  [groupName: string]: number;
}

/** Data shape for creating/submitting a blip via NUI callback */
export interface BlipSubmitData {
  name: string | null;
  ftimer: number | null | undefined;
  scImg: string | null | undefined;
  Sprite: number | null | undefined;
  SpriteImg: string | null | undefined;
  scale: number | null | undefined;
  sColor: number | null | undefined;
  alpha: number | null | undefined;
  items: number | null | undefined;
  colors: number | null | undefined;
  groups: GroupRecord | null;
  hideb: boolean | null;
  tickb: boolean | null;
  hideUi: boolean | null;
  bflash: boolean | null;
  sRange: boolean | null;
  outline: boolean | null;
}

// ─── Color & Sprite Picker Types ────────────────────────────────────────────

/** A selectable color item in the color picker */
export interface ColorItem {
  /** CSS rgb() color string */
  img: string;
  /** FiveM blip color ID */
  id: number;
}

/** A selectable sprite item in the sprite picker */
export interface SpriteItem {
  /** URL to the sprite image */
  img: string;
  /** FiveM blip sprite ID */
  id: number;
}

// ─── NUI Event Types ────────────────────────────────────────────────────────

/** Shape of NUI message events dispatched via window.postMessage */
export interface NuiMessageData<T = unknown> {
  action: string;
  data: T;
}

/** Debug event used in development to simulate NUI messages */
export interface DebugEvent<T = unknown> {
  action: string;
  data: T;
}
