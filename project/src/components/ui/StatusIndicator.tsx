import { Wifi, WifiOff } from 'lucide-react';

interface StatusIndicatorProps {
  online: boolean;
  compact?: boolean;
}

export function StatusIndicator({ online, compact }: StatusIndicatorProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full ${
        compact ? 'h-6 px-2.5 text-xs' : 'h-7 px-3 text-xs'
      } font-medium ${
        online
          ? 'bg-success-light text-success-dark'
          : 'bg-gray-100 text-ink-soft'
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${online ? 'bg-success animate-pulseDot' : 'bg-ink-muted'}`}
      />
      {online ? <Wifi size={compact ? 12 : 14} /> : <WifiOff size={compact ? 12 : 14} />}
      {online ? 'Online' : 'Offline'}
    </div>
  );
}
