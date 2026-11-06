import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, MapPin } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { TabBar } from '@/components/layout/TabBar';
import { MapView } from '@/components/inspector/MapView';
import { AssetCard } from '@/components/inspector/AssetCard';
import { AssetSheet } from '@/components/inspector/AssetSheet';
import { Chip } from '@/components/ui/Chip';
import { type Asset, assets } from '@/data/appData';

interface InspectorHomeProps {
  online: boolean;
  onOpenInspection: (asset: Asset) => void;
  onOpenAdmin: () => void;
}

type Tab = 'mapa' | 'lista' | 'pendientes' | 'perfil';
type Filter = 'todos' | 'pendiente' | 'visitado' | 'novedad';

export function InspectorHome({ online, onOpenInspection, onOpenAdmin }: InspectorHomeProps) {
  const [tab, setTab] = useState<Tab>('mapa');
  const [filter, setFilter] = useState<Filter>('todos');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Asset | null>(null);

  const counts = useMemo(
    () => ({
      pendiente: assets.filter((a) => a.estado === 'pendiente').length,
      visitado: assets.filter((a) => a.estado === 'visitado').length,
      novedad: assets.filter((a) => a.estado === 'novedad').length,
    }),
    []
  );

  const filtered = useMemo(() => {
    return assets.filter((a) => {
      const matchFilter = filter === 'todos' || a.estado === filter;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        a.codigo.toLowerCase().includes(q) ||
        a.farola.toLowerCase().includes(q) ||
        a.odt.toLowerCase().includes(q) ||
        a.barrio.toLowerCase().includes(q);
      return matchFilter && matchQuery;
    });
  }, [filter, query]);

  return (
    <div className="absolute inset-0 bg-canvas flex flex-col">
      <Header online={online} subtitle="Ruta diaria · La Playa" />

      {/* Filters + search */}
      <div className="px-3 pt-3 pb-2 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por código, ODT o barrio"
              className="input-base h-10 pl-9 text-sm"
            />
          </div>
          <button className="w-10 h-10 grid place-items-center rounded-xl border border-gray-200 text-ink-soft shrink-0">
            <SlidersHorizontal size={16} />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto scroll-hide -mx-1 px-1">
          <Chip active={filter === 'todos'} onClick={() => setFilter('todos')} count={assets.length}>
            Todos
          </Chip>
          <Chip
            active={filter === 'pendiente'}
            color="default"
            onClick={() => setFilter('pendiente')}
            count={counts.pendiente}
          >
            Pendientes
          </Chip>
          <Chip
            active={filter === 'visitado'}
            color="default"
            onClick={() => setFilter('visitado')}
            count={counts.visitado}
          >
            Visitadas
          </Chip>
          <Chip
            active={filter === 'novedad'}
            color="default"
            onClick={() => setFilter('novedad')}
            count={counts.novedad}
          >
            Con novedad
          </Chip>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {tab === 'mapa' && (
          <div className="absolute inset-0 flex flex-col">
            <div className="relative h-[55%] min-h-[280px]">
              <MapView assets={filtered} onSelect={setSelected} className="h-full" />
            </div>
            <div className="flex-1 overflow-y-auto scroll-hide px-3 py-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink">
                  {filtered.length} activo{filtered.length !== 1 && 's'} en ruta
                </p>
                <span className="text-xs text-ink-muted">Toque un marcador</span>
              </div>
              {filtered.map((a) => (
                <AssetCard key={a.id} asset={a} onClick={() => setSelected(a)} />
              ))}
            </div>
          </div>
        )}

        {tab === 'lista' && (
          <div className="absolute inset-0 overflow-y-auto scroll-hide px-3 py-3 space-y-2.5">
            {filtered.map((a) => (
              <AssetCard key={a.id} asset={a} onClick={() => setSelected(a)} />
            ))}
            {filtered.length === 0 && <EmptyMini />}
          </div>
        )}

        {tab === 'pendientes' && (
          <div className="absolute inset-0 overflow-y-auto scroll-hide px-3 py-3 space-y-2.5">
            <p className="text-sm font-semibold text-ink mb-1">
              {counts.pendiente} inspecciones pendientes
            </p>
            {assets.filter((a) => a.estado === 'pendiente').map((a) => (
              <AssetCard key={a.id} asset={a} onClick={() => setSelected(a)} />
            ))}
          </div>
        )}

        {tab === 'perfil' && <ProfilePanel online={online} onOpenAdmin={onOpenAdmin} />}
      </div>

      {selected && (
        <AssetSheet
          asset={selected}
          onClose={() => setSelected(null)}
          onStartInspection={() => {
            const a = selected;
            setSelected(null);
            onOpenInspection(a);
          }}
        />
      )}

      <TabBar active={tab} onChange={setTab} pendingCount={counts.pendiente} />
    </div>
  );
}

function EmptyMini() {
  return (
    <div className="py-16 text-center">
      <MapPin size={40} className="mx-auto text-ink-muted" />
      <p className="mt-3 text-sm text-ink-soft">No se encontraron activos</p>
    </div>
  );
}

function ProfilePanel({ online, onOpenAdmin }: { online: boolean; onOpenAdmin: () => void }) {
  return (
    <div className="absolute inset-0 overflow-y-auto scroll-hide px-4 py-4 space-y-4">
      <div className="card p-4 text-center">
        <div className="w-16 h-16 rounded-full bg-primary-50 text-primary grid place-items-center mx-auto text-xl font-bold">
          CR
        </div>
        <p className="mt-2 font-semibold text-ink">Carlos Ramírez</p>
        <p className="text-sm text-ink-soft">Interventor AP · C.C. 1.032.456</p>
        <p className="text-xs text-ink-muted mt-1">Centro· Cucuta</p>
      </div>
      <div className="card p-4 grid grid-cols-3 gap-3 text-center">
        <Stat label="Hoy" value="3" />
        <Stat label="Pendientes" value="24" />
        <Stat label="Total" value="32" />
      </div>
      <div className="card divide-y divide-gray-100">
        <RowItem label="Estado de conexión" value={online ? 'Online' : 'Offline'} />
        <RowItem label="Última sincronización" value="hace 2 min" />
        <RowItem label="Almacenamiento local" value="8 MB" />
      </div>
      <button onClick={onOpenAdmin} className="w-full text-left card p-4 flex items-center justify-between">
        <span className="text-sm font-medium text-ink">Panel administrativo</span>
        <span className="text-xs text-ink-muted">Abrir en escritorio →</span>
      </button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xl font-bold text-primary">{value}</p>
      <p className="text-[11px] text-ink-muted">{label}</p>
    </div>
  );
}

function RowItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-3.5">
      <span className="text-sm text-ink-soft">{label}</span>
      <span className="text-sm font-medium text-ink">{value}</span>
    </div>
  );
}
