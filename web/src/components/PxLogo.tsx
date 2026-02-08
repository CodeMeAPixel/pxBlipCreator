/**
 * pxBlipCreator brand mark — a pixelated "P" on a grid
 * Represents the "Pixel" identity with clean, geometric squares
 */
const PxLogo: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Background grid dots (subtle) */}
    <rect x="2"  y="2"  width="2.5" height="2.5" rx="0.5" fill="currentColor" opacity="0.15" />
    <rect x="7"  y="2"  width="2.5" height="2.5" rx="0.5" fill="currentColor" opacity="0.15" />
    <rect x="17" y="17" width="2.5" height="2.5" rx="0.5" fill="currentColor" opacity="0.15" />
    <rect x="17" y="12" width="2.5" height="2.5" rx="0.5" fill="currentColor" opacity="0.15" />

    {/* Pixel "P" shape */}
    {/* Vertical stem */}
    <rect x="4.5" y="4.5"  width="3" height="3" rx="0.5" fill="currentColor" />
    <rect x="4.5" y="9"    width="3" height="3" rx="0.5" fill="currentColor" />
    <rect x="4.5" y="13.5" width="3" height="3" rx="0.5" fill="currentColor" />
    <rect x="4.5" y="18"   width="3" height="3" rx="0.5" fill="currentColor" />

    {/* Top horizontal */}
    <rect x="9"   y="4.5" width="3" height="3" rx="0.5" fill="currentColor" />
    <rect x="13.5" y="4.5" width="3" height="3" rx="0.5" fill="currentColor" />

    {/* Right side of P bowl */}
    <rect x="16.5" y="7.5" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.85" />

    {/* Middle horizontal */}
    <rect x="9"    y="13.5" width="3" height="3" rx="0.5" fill="currentColor" />
    <rect x="13.5" y="13.5" width="3" height="3" rx="0.5" fill="currentColor" opacity="0.6" />

    {/* Accent pixel */}
    <rect x="19" y="4.5" width="2.5" height="2.5" rx="0.5" fill="currentColor" opacity="0.25" />
  </svg>
);

export default PxLogo;
