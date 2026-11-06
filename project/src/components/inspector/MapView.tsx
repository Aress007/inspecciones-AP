import { type Asset } from '@/data/appData';
import { Badge } from '@/components/ui/Badge';

interface MapViewProps {
  assets: Asset[];
  onSelect?: (asset: Asset) => void;
  className?: string;
}

const pinColor: Record<Asset['estado'], string> = {
  pendiente: '#1E3A5F',
  visitado: '#27AE60',
  novedad: '#E74C3C',
};

function Pin({ color }: { color: string }) {
  return (
    <svg width="22" height="28" viewBox="0 0 22 28" fill="none">
      <path d="M11 27C11 27 19 17 19 10C19 5 15 1 11 1C7 1 3 5 3 10C3 17 11 27 11 27Z" fill={color} stroke="white" strokeWidth="1.5" />
      <circle cx="11" cy="10" r="3.5" fill="white" />
    </svg>
  );
}

export function MapView({ assets, onSelect, className = '' }: MapViewProps) {
  // Deterministic pseudo layout based on normalized lat/lon for a "map" grid
  const bounds = {
    minLat: Math.min(...assets.map((a) => a.lat)),
    maxLat: Math.max(...assets.map((a) => a.lat)),
    minLon: Math.min(...assets.map((a) => a.lon)),
    maxLon: Math.max(...assets.map((a) => a.lon)),
  };
  const norm = (v: number, min: number, max: number) => {
    const range = max - min || 1;
    return ((v - min) / range) * 80 + 10;
  };

  return (
    <div className={`relative w-full overflow-hidden bg-[#DDE7F2] ${className}`}>
      {/* Stylized map base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#C7D7E8] via-[#DDE7F2] to-[#E8EFF5]" />
      <svg className="absolute inset-0 w-full h-full opacity-60" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#B6C9DD" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <path d="M0,60 Q120,40 240,70 T480,55" stroke="#A8C2D9" strokeWidth="6" fill="none" opacity="0.5" />
        <path d="M30,0 Q60,80 90,160 T150,320" stroke="#A8C2D9" strokeWidth="5" fill="none" opacity="0.4" />
        <path d="M200,0 L230,200 L210,400" stroke="#B6C9DD" strokeWidth="4" fill="none" opacity="0.45" />
      </svg>
      <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
        <span className="text-[10px] bg-white/80 text-ink-soft px-2 py-0.5 rounded-md font-medium">Cucuta</span>
      </div>

      {assets.map((a) => {
        const top = norm(a.lat, bounds.maxLat, bounds.minLat);
        const left = norm(a.lon, bounds.minLon, bounds.maxLon);
        return (
          <button
            key={a.id}
            onClick={() => onSelect?.(a)}
            className="absolute -translate-x-1/2 -translate-y-full transition hover:scale-110 active:scale-95"
            style={{ top: `${top}%`, left: `${left}%` }}
          >
            <Pin color={pinColor[a.estado]} />
            <span className="block text-[9px] font-semibold bg-white/90 px-1 rounded text-ink shadow-sm mt-0.5">
              {a.codigo}
            </span>
          </button>
        );
      })}

      <div className="absolute bottom-2.5 right-2.5 bg-white/90 rounded-lg shadow-soft p-2 space-y-1">
        <p className="text-[9px] font-semibold text-ink-soft uppercase tracking-wide">Leyenda</p>
        <Legend color="#1E3A5F" label="Pendiente" />
        <Legend color="#27AE60" label="Visitado" />
        <Legend color="#E74C3C" label="Con novedad" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
      <span className="text-[10px] text-ink-soft">{label}</span>
    </div>
  );
}


