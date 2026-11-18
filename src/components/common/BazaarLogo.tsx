import React from 'react';

interface BazaarLogoProps {
  className?: string;
}

export const BazaarLogo: React.FC<BazaarLogoProps> = ({ className = 'w-full h-full' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-label="Bazaar One Logo"
    >
      <rect width="100" height="100" rx="24" fill="#7A263A" />
      {/* Traditional Arch / Diya Shape with Modern Stylized B and 1 */}
      <path
        d="M50 18C36 18 26 28 26 42C26 58 50 78 50 78C50 78 74 58 74 42C74 28 64 18 50 18Z"
        fill="#F4A340"
        opacity="0.95"
      />
      <circle cx="50" cy="42" r="16" fill="#FFF8EC" />
      <path d="M47 34H53V50H47V34Z" fill="#7A263A" />
      <path d="M42 38L48 34V50H42V38Z" fill="#7A263A" />
      <circle cx="50" cy="24" r="4" fill="#D9A441" />
      {/* Modern sparkles */}
      <circle cx="78" cy="24" r="3" fill="#D9A441" />
      <circle cx="22" cy="68" r="2.5" fill="#276749" />
      <circle cx="76" cy="64" r="3" fill="#F4A340" />
    </svg>
  );
};
