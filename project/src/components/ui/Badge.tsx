interface BadgeProps {
  tone?: 'pending' | 'visited' | 'novelty' | 'neutral' | 'success' | 'alert' | 'warning';
  dot?: boolean;
  children: React.ReactNode;
}

const tones = {
  pending: 'bg-primary-50 text-primary border-primary-100',
  visited: 'bg-success-light text-success-dark border-success/30',
  novelty: 'bg-alert-light text-alert-dark border-alert/30',
  neutral: 'bg-gray-100 text-ink-soft border-gray-200',
  success: 'bg-success-light text-success-dark border-success/30',
  alert: 'bg-alert-light text-alert-dark border-alert/30',
  warning: 'bg-warning-light text-warning-dark border-warning/30',
} as const;

const dotColor = {
  pending: 'bg-primary',
  visited: 'bg-success',
  novelty: 'bg-alert',
  neutral: 'bg-ink-muted',
  success: 'bg-success',
  alert: 'bg-alert',
  warning: 'bg-warning',
} as const;

export function Badge({ tone = 'neutral', dot, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-xs font-semibold border ${tones[tone]}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor[tone]}`} />}
      {children}
    </span>
  );
}
