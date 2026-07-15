import * as React from 'react';
import { cn } from '@/lib/utils';

type ButtonProps = React.ComponentProps<'button'> & {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'icon';
};

export function Button({ className, variant = 'default', size = 'default', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-md text-sm font-medium transition disabled:opacity-50';
  const variants = {
    default: 'bg-neutral-900 text-white hover:bg-neutral-800',
    outline: 'border border-neutral-200 bg-white hover:bg-neutral-50',
    ghost: 'hover:bg-neutral-100',
  };
  const sizes = {
    default: 'h-9 px-4 py-2',
    icon: 'h-9 w-9',
  };
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
