import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'traditional' | 'modern' | 'success' | 'warning' | 'info' | 'verified';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'info',
  size = 'sm',
  className = '',
}) => {
  const variantStyles = {
    traditional: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800',
    modern: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800',
    success: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-950/60 dark:text-green-300 dark:border-green-800',
    warning: 'bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-950/60 dark:text-orange-200 dark:border-orange-800',
    info: 'bg-stone-100 text-stone-800 border-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:border-stone-700',
    verified: 'bg-bazaar-maroon-50 text-bazaar-maroon-700 border-bazaar-maroon-200 font-semibold',
  }[variant];

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 rounded-full font-medium border',
    md: 'text-sm px-3 py-1 rounded-full font-medium border',
  }[size];

  return <span className={`inline-flex items-center gap-1 ${variantStyles} ${sizeStyles} ${className}`}>{children}</span>;
};
