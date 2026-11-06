import { CloudOff, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface OfflineStateProps {
  online: boolean;
  onRetry: () => void;
}

export function OfflineState({ online, onRetry }: OfflineStateProps) {
  if (online) return null;
  return (
    <div className="absolute inset-0 z-50 bg-canvas flex flex-col items-center justify-center px-8 text-center">
      <div className="w-24 h-24 rounded-3xl bg-white shadow-soft grid place-items-center mb-5">
        <CloudOff size={48} className="text-ink-muted" />
      </div>
      <h2 className="text-xl font-bold text-ink">Sin conexión</h2>
      <p className="text-sm text-ink-soft mt-2 max-w-xs">
        Tus inspecciones se guardarán y sincronizarán automáticamente cuando vuelva la conexión.
      </p>
      <div className="mt-6 flex flex-col gap-2.5 w-full max-w-xs">
        <Button variant="secondary" full onClick={onRetry} leftIcon={<RotateCw size={18} />}>
          REINTENTAR CONEXIÓN
        </Button>
        <p className="text-xs text-ink-muted">3 inspecciones en cola para sincronizar</p>
      </div>
    </div>
  );
}
