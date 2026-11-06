import { ChevronRight, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { type Asset, estadoMeta } from '@/data/appData';

interface AssetCardProps {
  asset: Asset;
  onClick?: () => void;
}

export function AssetCard({ asset, onClick }: AssetCardProps) {
  const meta = estadoMeta[asset.estado];
  return (
    <button
      onClick={onClick}
      className="w-full text-left card p-3.5 active:scale-[0.99] transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-ink text-[15px]">{asset.codigo}</p>
            <Badge tone={meta.tone} dot>{meta.label}</Badge>
          </div>
          <p className="mt-0.5 text-sm text-ink-soft truncate">{asset.farola}</p>
          <p className="text-xs text-ink-muted mt-0.5">ODT {asset.odt}</p>
          <p className="mt-1.5 flex items-center gap-1 text-xs text-ink-soft">
            <MapPin size={12} className="text-ink-muted" />
            {asset.barrio} · {asset.municipio}
          </p>
        </div>
        <ChevronRight size={20} className="text-ink-muted shrink-0 mt-1" />
      </div>
    </button>
  );
}
