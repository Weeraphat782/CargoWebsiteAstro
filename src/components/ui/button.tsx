import * as React from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = React.ComponentProps<'button'> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'lg';
};

export function Button({
  className,
  variant = 'primary',
  size = 'default',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold transition disabled:opacity-50 rounded-[var(--radius-sm)] cursor-pointer';
  const variants = {
    primary: 'bg-[var(--green-500)] text-white hover:bg-[var(--green-600)]',
    secondary: 'bg-[var(--navy-700)] text-white hover:bg-[#123c66]',
    ghost: 'bg-transparent text-[var(--navy-700)] hover:bg-[var(--paper-muted)]',
    outline:
      'border border-[var(--navy-700)] text-[var(--navy-700)] bg-white hover:bg-[var(--paper-muted)]',
  };
  const sizes = {
    sm: 'text-[13px] px-3.5 py-1.5',
    default: 'text-[15px] px-6 py-3',
    lg: 'text-base px-7 py-3.5',
  };
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}
