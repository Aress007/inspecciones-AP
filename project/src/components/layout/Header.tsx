import { type ReactNode } from 'react';
import { Zap } from 'lucide-react';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { inspector } from '@/data/appData';

interface HeaderProps {
  online: boolean;
  right?: ReactNode;
  subtitle?: string;
}

export function Header({ online, right, subtitle }: HeaderProps) {
  return (
    <header className="bg-primary text-white px-4 pt-3 pb-3 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/10 grid place-items-center">
            <Zap size={20} className="text-accent" fill="#4A90D9" />
          </div>
          <div className="leading-tight">
            <p className="text-[11px] font-medium tracking-wide text-white/70 uppercase">
              CONSORCIO INTERALUMBRADO DE CUCUTA
            </p>
            <p className="text-sm font-semibold">{inspector.nombre}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {right}
          <StatusIndicator online={online} compact />
        </div>
      </div>
      {subtitle && (
        <p className="mt-2 text-xs text-white/70">{subtitle}</p>
      )}
    </header>
  );
}
