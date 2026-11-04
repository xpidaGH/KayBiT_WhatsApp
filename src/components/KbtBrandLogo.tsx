import React from 'react';

export type LogoVariant = 'desktop-titlebar' | 'mobile-appbar' | 'web-header' | 'standalone';

interface KbtBrandLogoProps {
  variant?: LogoVariant;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showGlow?: boolean;
  altText?: string;
}

export const KbtBrandLogo: React.FC<KbtBrandLogoProps> = ({
  variant = 'web-header',
  size,
  className = '',
  showGlow = true,
  altText = 'KBT App Logo',
}) => {
  // Sizing mapping based on variant or explicit size
  let containerSize = 'w-10 h-10'; // default web header (40x40)
  let padding = 'p-1';
  let cornerRadius = 'rounded-xl';

  if (size === 'xs' || variant === 'desktop-titlebar') {
    containerSize = 'w-6 h-6';
    padding = 'p-0.5';
    cornerRadius = 'rounded-md';
  } else if (size === 'sm') {
    containerSize = 'w-8 h-8';
    padding = 'p-1';
    cornerRadius = 'rounded-lg';
  } else if (size === 'md' || variant === 'mobile-appbar') {
    containerSize = 'w-9 h-9';
    padding = 'p-1';
    cornerRadius = 'rounded-xl';
  } else if (size === 'lg' || variant === 'web-header') {
    containerSize = 'w-10 h-10';
    padding = 'p-1';
    cornerRadius = 'rounded-xl';
  } else if (size === 'xl') {
    containerSize = 'w-24 h-24';
    padding = 'p-3';
    cornerRadius = 'rounded-3xl';
  }

  const glowStyle = showGlow
    ? 'filter drop-shadow-[0_0_8px_rgba(163,230,53,0.6)] hover:drop-shadow-[0_0_12px_rgba(163,230,53,0.9)]'
    : '';

  return (
    <div
      className={`relative ${containerSize} bg-gradient-to-br from-zinc-950 via-slate-900 to-black mask-squircle flex items-center justify-center border border-yellow-400/25 shrink-0 overflow-hidden shadow-md shadow-emerald-950/40 transition-all ${className}`}
      title="KBT Multiplatform Brand Logo (Green/Yellow Cyber Spider)"
    >
      <img
        src="/assets/kbt-logo.png"
        alt={altText}
        className={`w-full h-full object-cover select-none ${glowStyle} transition-all duration-300`}
        onError={(e) => {
          // Fallback to stylized SVG if image file is not accessible
          const target = e.currentTarget;
          target.style.display = 'none';
          const parent = target.parentElement;
          if (parent) {
            parent.classList.add('bg-gradient-to-tr', 'from-emerald-500', 'to-sky-500');
            parent.innerHTML = '<span class="text-white font-black text-xs">KB</span>';
          }
        }}
      />
    </div>
  );
};
