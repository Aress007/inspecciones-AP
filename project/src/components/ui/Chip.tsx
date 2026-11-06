import { type ReactNode } from 'react';

interface ChipProps {
  active?: boolean;
  count?: number;
  color?: 'default' | 'blue' | 'green' | 'red' | 'amber';
  onClick?: () => void;
  children: ReactNode;
}

const palettes = {
  default: 'bg-white border-gray-200 text-ink-soft',
  blue: 'bg-primary text-white border-primary',
  green: 'bg-success-light border-success/30 text-success-dark',
  red: 'bg-alert-light border-alert/30 text-alert-dark',
  amber: 'bg-warning-light border-warning/30 text-warning-dark',
} as const;

export function Chip({ active, count, color = 'default', onClick, children }: ChipProps) {
  const tone = active ? 'blue' : color;
  return (
    <button onClick={onClick} className={`chip ${palettes[tone]}`}>
      {children}
      {count !== undefined && (
        <span
          className={`min-w-5 h-5 px-1 inline-flex items-center justify-center rounded-full text-xs font-bold ${
            active ? 'bg-white/25 text-white' : 'bg-canvas text-ink-soft'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
