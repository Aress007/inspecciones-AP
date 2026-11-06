import { useState } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  Route, ClipboardList, Package, MessageSquare, Camera,
  MapPin, Calendar, Clock, User, CheckSquare, Square, Plus,
  CheckCircle2, XCircle, X, Image as ImageIcon, Save, ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { type Asset, categorias, deficiencias } from '@/data/appData';

interface InspectionFormProps {
  asset: Asset;
  online: boolean;
  onBack: () => void;
  onSave: () => void;
}

const sections = [
  { id: 'recorrido', label: 'Datos del recorrido', icon: Route },
  { id: 'categoria', label: 'Categoría y deficiencias', icon: ClipboardList },
  { id: 'validacion', label: 'Validación de datos UCAP', icon: ShieldCheck },
  { id: 'materiales', label: 'Materiales', icon: Package },
  { id: 'observaciones', label: 'Observaciones', icon: MessageSquare },
  { id: 'fotos', label: 'Fotos', icon: Camera },
] as const;

type ValEstado = 'ok' | 'no' | 'pendiente';

interface ItemValidacion {
  key: string;
  label: string;
  esperado: string;
}

export function InspectionForm({ asset, online, onBack, onSave }: InspectionFormProps) {
  const [open, setOpen] = useState<string>('recorrido');
  const [categoria, setCategoria] = useState(categorias[0]);
  const [defs, setDefs] = useState<string[]>([]);
  const [obs, setObs] = useState('');
  const [fotos, setFotos] = useState<number>(2);

  const coordsStr = `${asset.lat.toFixed(6)}, ${asset.lon.toFixed(6)}`;

  const itemsDatos: ItemValidacion[] = [
    { key: 'codigo', label: 'Código', esperado: asset.codigo },
    { key: 'coordenada', label: 'Coordenada (Lat, Lon)', esperado: coordsStr },
    { key: 'potencia', label: 'Potencia', esperado: `${asset.potencia} W` },
  ];

  const [valDatos, setValDatos] = useState<Record<string, ValEstado>>(() =>
    Object.fromEntries(itemsDatos.map((i) => [i.key, 'pendiente']))
  );
  const [valMats, setValMats] = useState<Record<string, ValEstado>>(() =>
    Object.fromEntries(asset.materiales.map((m) => [m.nombre, 'pendiente']))
  );

  const toggleDef = (d: string) =>
    setDefs((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const toggleSection = (id: string) => setOpen((cur) => (cur === id ? '' : id));

  const pendientesDatos = Object.values(valDatos).filter((v) => v === 'pendiente').length;
  const pendientesMats = Object.values(valMats).filter((v) => v === 'pendiente').length;
  const noCoincideDatos = Object.values(valDatos).filter((v) => v === 'no').length;
  const noCoincideMats = Object.values(valMats).filter((v) => v === 'no').length;

  return (
    <div className="absolute inset-0 bg-canvas flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white px-3 pt-3 pb-3 shadow-soft">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 grid place-items-center rounded-lg bg-white/10">
            <ArrowLeft size={18} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-white/70 uppercase tracking-wide font-medium">Inspección</p>
            <p className="text-sm font-semibold truncate">{asset.codigo} · {asset.farola}</p>
          </div>
          <StatusIndicator online={online} compact />
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 overflow-y-auto scroll-hide px-3 py-3 space-y-2.5">
        {sections.map((s) => {
          const Icon = s.icon;
          const isOpen = open === s.id;
          return (
            <section key={s.id} className="card overflow-hidden">
              <button
                onClick={() => toggleSection(s.id)}
                className="w-full flex items-center gap-3 p-3.5"
              >
                <span className="w-9 h-9 rounded-lg bg-primary-50 text-primary grid place-items-center shrink-0">
                  <Icon size={18} />
                </span>
                <span className="flex-1 text-left text-sm font-semibold text-ink">{s.label}</span>
                <ChevronDown
                  size={18}
                  className={`text-ink-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isOpen && (
                <div className="px-3.5 pb-4 animate-fadeIn">
                  {s.id === 'recorrido' && (
                    <div className="grid grid-cols-2 gap-3">
                      <ReadOnly label="No. Orden" value={asset.codigo} icon={<Route size={13} />} />
                      <ReadOnly label="Serie" value={asset.serie} icon={<ClipboardList size={13} />} />
                      <ReadOnly label="Barrio" value={asset.barrio} icon={<MapPin size={13} />} />
                      <ReadOnly label="No. Apoyo" value={asset.apoyo} icon={<MapPin size={13} />} />
                      <ReadOnly label="Municipio" value={asset.municipio} icon={<MapPin size={13} />} />
                      <ReadOnly label="Potencia" value={`${asset.potencia} W`} icon={<ClipboardList size={13} />} />
                      <ReadOnly label="Fecha" value="18/10/2026" icon={<Calendar size={13} />} />
                      <ReadOnly label="Hora" value="14:32" icon={<Clock size={13} />} />
                      <ReadOnly label="Interventor" value="C. Ramírez" icon={<User size={13} />} />
                      <ReadOnly label="Coordenada" value={coordsStr} icon={<MapPin size={13} />} />
                    </div>
                  )}

                  {s.id === 'categoria' && (
                    <div className="space-y-3">
                      <label className="block">
                        <span className="mb-1.5 block text-sm font-medium text-ink-soft">Categoría</span>
                        <select
                          value={categoria}
                          onChange={(e) => setCategoria(e.target.value)}
                          className="input-base appearance-none"
                        >
                          {categorias.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </label>
                      <div>
                        <span className="mb-2 block text-sm font-medium text-ink-soft">Deficiencias detectadas</span>
                        <div className="grid grid-cols-1 gap-1.5">
                          {deficiencias.map((d) => {
                            const checked = defs.includes(d);
                            return (
                              <button
                                key={d}
                                onClick={() => toggleDef(d)}
                                className="flex items-center gap-2.5 p-2.5 rounded-lg border border-gray-100 text-left"
                              >
                                {checked ? (
                                  <CheckSquare size={18} className="text-accent shrink-0" />
                                ) : (
                                  <Square size={18} className="text-ink-muted shrink-0" />
                                )}
                                <span className={`text-sm ${checked ? 'text-ink font-medium' : 'text-ink-soft'}`}>
                                  {d}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}

                  {s.id === 'validacion' && (
                    <div>
                      <p className="text-xs text-ink-muted mb-2">
                        Valide si los datos reportados por la UCAP coinciden con lo encontrado en campo.
                      </p>
                      <div className="space-y-1.5">
                        {itemsDatos.map((item) => (
                          <FilaValidacion
                            key={item.key}
                            label={item.label}
                            esperado={item.esperado}
                            estado={valDatos[item.key] ?? 'pendiente'}
                            onOk={() => setValDatos((v) => ({ ...v, [item.key]: 'ok' }))}
                            onNo={() => setValDatos((v) => ({ ...v, [item.key]: 'no' }))}
                          />
                        ))}
                      </div>
                      <ResumenValidacion pendientes={pendientesDatos} noCoincide={noCoincideDatos} total={itemsDatos.length} />
                    </div>
                  )}

                  {s.id === 'materiales' && (
                    <div>
                      <p className="text-xs text-ink-muted mb-2">
                        Los materiales están definidos por la UCAP. Solo valide si lo reportado coincide en campo.
                      </p>
                      <div className="space-y-1.5">
                        {asset.materiales.map((m) => (
                          <FilaValidacion
                            key={m.nombre}
                            label={m.nombre}
                            esperado={`${m.esperado} ${m.unidad}`}
                            estado={valMats[m.nombre] ?? 'pendiente'}
                            onOk={() => setValMats((v) => ({ ...v, [m.nombre]: 'ok' }))}
                            onNo={() => setValMats((v) => ({ ...v, [m.nombre]: 'no' }))}
                          />
                        ))}
                      </div>
                      <ResumenValidacion pendientes={pendientesMats} noCoincide={noCoincideMats} total={asset.materiales.length} />
                    </div>
                  )}

                  {s.id === 'observaciones' && (
                    <textarea
                      value={obs}
                      onChange={(e) => setObs(e.target.value)}
                      rows={5}
                      placeholder="Describa hallazgos, novedades o recomendaciones..."
                      className="w-full p-3 rounded-xl border border-gray-200 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-accent/40"
                    />
                  )}

                  {s.id === 'fotos' && (
                    <div>
                      <div className="grid grid-cols-3 gap-2">
                        {Array.from({ length: fotos }).map((_, i) => (
                          <FotoConMarca
                            key={i}
                            index={i}
                            codigo={asset.codigo}
                            odt={asset.odt}
                            sector={asset.barrio}
                            coords={coordsStr}
                            onRemove={() => setFotos((n) => Math.max(0, n - 1))}
                          />
                        ))}
                        <button
                          onClick={() => setFotos((n) => n + 1)}
                          className="aspect-square rounded-xl border-2 border-dashed border-gray-300 grid place-items-center text-ink-muted hover:border-accent hover:text-accent transition"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <Plus size={20} />
                            <span className="text-[10px] font-medium">Cámara</span>
                          </div>
                        </button>
                      </div>
                      <p className="mt-2.5 text-xs text-ink-muted flex items-center gap-1.5">
                        <ImageIcon size={13} />
                        {fotos} foto{fotos !== 1 && 's'} · mínimo 1 requerida · datos impresos automáticamente
                      </p>
                      {fotos < 1 && (
                        <Badge tone="alert" dot>Faltan fotos (mín. 1)</Badge>
                      )}
                    </div>
                  )}
                </div>
              )}
            </section>
          );
        })}
        <div className="h-20" />
      </div>

      {/* Fixed bottom action */}
      <div className="absolute bottom-0 inset-x-0 bg-white border-t border-gray-100 px-4 py-3 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
        <Button full onClick={onSave} leftIcon={<Save size={18} />}>
          GUARDAR INSPECCIÓN
        </Button>
      </div>
    </div>
  );
}

function FilaValidacion({
  label,
  esperado,
  estado,
  onOk,
  onNo,
}: {
  label: string;
  esperado: string;
  estado: ValEstado;
  onOk: () => void;
  onNo: () => void;
}) {
  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl border border-gray-100 gap-2">
      <div className="min-w-0">
        <p className="text-sm font-medium text-ink">{label}</p>
        <p className="text-xs text-ink-muted truncate">Esperado: {esperado}</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={onOk}
          className={`flex items-center gap-1 h-8 px-2.5 rounded-lg text-xs font-semibold transition ${
            estado === 'ok'
              ? 'bg-success text-white'
              : 'bg-success-light text-success-dark hover:bg-success/15'
          }`}
        >
          <CheckCircle2 size={14} /> Coincide
        </button>
        <button
          onClick={onNo}
          className={`flex items-center gap-1 h-8 px-2.5 rounded-lg text-xs font-semibold transition ${
            estado === 'no'
              ? 'bg-alert text-white'
              : 'bg-alert-light text-alert-dark hover:bg-alert/15'
          }`}
        >
          <XCircle size={14} /> No coincide
        </button>
      </div>
    </div>
  );
}

function ResumenValidacion({ pendientes, noCoincide, total }: { pendientes: number; noCoincide: number; total: number }) {
  return (
    <div className="mt-2.5 flex items-center gap-2 flex-wrap">
      {pendientes > 0 ? (
        <Badge tone="warning" dot>{pendientes} de {total} sin validar</Badge>
      ) : noCoincide > 0 ? (
        <Badge tone="alert" dot>{noCoincide} no coincide(n)</Badge>
      ) : (
        <Badge tone="success" dot>Todo validado</Badge>
      )}
    </div>
  );
}

function FotoConMarca({
  index,
  codigo,
  odt,
  sector,
  coords,
  onRemove,
}: {
  index: number;
  codigo: string;
  odt: string;
  sector: string;
  coords: string;
  onRemove: () => void;
}) {
  const photoIds = [1102256, 1903702, 3585047, 2090651, 3573555];
  const src = `https://images.pexels.com/photos/${photoIds[index % photoIds.length]}/auto.jpg?auto=compress&cs=tinysrgb&w=400`;
  return (
    <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
      <img src={src} alt={`Evidencia ${index + 1}`} className="w-full h-full object-cover" />
      {/* Marca de datos impresa sobre la foto */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent p-1.5 pt-4">
        <p className="text-white text-[10px] font-bold leading-tight">{codigo}</p>
        <p className="text-white/90 text-[9px] leading-tight">{odt} · {sector}</p>
        <p className="text-white/80 text-[9px] leading-tight font-mono">{coords}</p>
        <p className="text-white/60 text-[8px] leading-tight mt-0.5">
          {new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}
        </p>
      </div>
      <button
        onClick={onRemove}
        className="absolute top-1 right-1 w-6 h-6 grid place-items-center rounded-full bg-black/55 text-white"
      >
        <X size={12} />
      </button>
    </div>
  );
}

function ReadOnly({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-gray-50 border border-gray-100 p-2.5">
      <div className="flex items-center gap-1 text-ink-muted">
        {icon}
        <span className="text-[10px] uppercase tracking-wide font-medium">{label}</span>
      </div>
      <p className="text-sm font-semibold text-ink-soft mt-0.5 truncate">{value}</p>
    </div>
  );
}
