import { MapPin, X, Layers, Tag, Package, Camera, ChevronDown } from 'lucide-react';
import { type Asset, estadoMeta } from '@/data/appData';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface AssetSheetProps {
  asset: Asset;
  onClose: () => void;
  onStartInspection: () => void;
}

export function AssetSheet({ asset, onClose, onStartInspection }: AssetSheetProps) {
  const meta = estadoMeta[asset.estado];
  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end animate-fadeIn">
      <button onClick={onClose} className="absolute inset-0 bg-black/30" aria-label="Cerrar" />
      <div className="relative bg-white rounded-t-2xl shadow-sheet animate-slideUp max-h-[88%] overflow-y-auto scroll-hide">
        <div className="sticky top-0 bg-white pt-2.5 pb-1 flex justify-center">
          <div className="w-10 h-1 rounded-full bg-gray-200" />
        </div>

        <div className="px-4 pb-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-ink-muted uppercase tracking-wide">Ficha del activo</p>
              <h2 className="text-xl font-bold text-ink leading-tight mt-0.5">{asset.codigo}</h2>
              <p className="text-sm text-ink-soft mt-0.5">{asset.farola}</p>
              <p className="text-sm text-ink-soft">ODT {asset.odt}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button onClick={onClose} className="w-8 h-8 grid place-items-center rounded-lg bg-gray-100 text-ink-soft">
                <X size={16} />
              </button>
              <Badge tone={meta.tone} dot>{meta.label}</Badge>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2.5">
            <InfoItem icon={<MapPin size={14} />} label="Coordenadas" value={`${asset.lat.toFixed(6)}, ${asset.lon.toFixed(6)}`} />
            <InfoItem icon={<Layers size={14} />} label="No. Apoyo" value={asset.apoyo} />
            <InfoItem icon={<Tag size={14} />} label="Serie" value={asset.serie} />
            <InfoItem icon={<Tag size={14} />} label="Potencia" value={`${asset.potencia} W`} />
          </div>

          <div className="mt-3 rounded-xl bg-canvas p-3">
            <p className="text-xs font-medium text-ink-soft">Barrio</p>
            <p className="text-sm font-semibold text-ink">{asset.barrio}</p>
          </div>

          <div className="mt-3">
            <p className="text-xs font-medium text-ink-soft mb-1.5">Materiales esperados</p>
            <div className="flex flex-wrap gap-1.5">
              {asset.materiales.map((m) => (
                <span key={m.nombre} className="chip bg-white border-gray-200 text-ink-soft">
                  <Package size={12} className="text-accent" />
                  {m.nombre} · {m.esperado} {m.unidad}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 sticky bottom-0 bg-white pt-2 pb-1">
            <Button full onClick={onStartInspection} leftIcon={<Camera size={18} />}>
              INICIAR INSPECCIÓN
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-gray-100 p-2.5">
      <div className="flex items-center gap-1 text-ink-muted">
        {icon}
        <span className="text-[10px] uppercase tracking-wide font-medium">{label}</span>
      </div>
      <p className="text-sm font-semibold text-ink mt-0.5 break-words">{value}</p>
    </div>
  );
}
