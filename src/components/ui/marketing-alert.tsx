import type { ReactNode } from 'react';

type AlertVariant = 'success' | 'error' | 'info';

const styles: Record<AlertVariant, { bg: string; border: string; icon: string; title: string }> = {
  success: { bg: '#eaf6e0', border: '#4a9c2d', icon: '#4a9c2d', title: '#2f6b1c' },
  error: { bg: '#fdecec', border: '#d64545', icon: '#c23232', title: '#a12727' },
  info: { bg: '#e6eef6', border: '#184878', icon: '#184878', title: '#0d2c4d' },
};

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function ErrorIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  );
}

export function MarketingAlert({
  variant,
  title,
  children,
}: {
  variant: AlertVariant;
  title: string;
  children: ReactNode;
}) {
  const s = styles[variant];
  return (
    <div
      className="flex gap-3.5 rounded-[2px] border-l-4 px-[18px] py-4"
      style={{ background: s.bg, borderColor: s.border }}
      role={variant === 'error' ? 'alert' : 'status'}
    >
      <span className="shrink-0" style={{ color: s.icon }}>
        {variant === 'success' ? <CheckIcon /> : variant === 'error' ? <ErrorIcon /> : null}
      </span>
      <div>
        <div className="text-[15px] font-bold" style={{ color: s.title }}>
          {title}
        </div>
        <div className="text-sm leading-snug" style={{ color: '#2b3138' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className ?? 'h-4 w-4'}`} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
