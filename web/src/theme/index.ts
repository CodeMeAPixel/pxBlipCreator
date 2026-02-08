/**
 * Theme constants for pxBlipCreator
 * Consolidates design tokens that Tailwind classes reference
 */

export const theme = {
  /** Main container dimensions */
  container: {
    width: 720,
    height: 520,
  },

  /** Animation durations in ms */
  animation: {
    fast: 100,
    normal: 200,
    slow: 300,
  },
} as const;
