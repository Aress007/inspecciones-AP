import { useState } from 'react';
import * as XLSX from 'xlsx';
import {
  UploadCloud, FileSpreadsheet, Users, BarChart3, FileText, Settings,
  Search, Bell, Check, AlertTriangle, X, Download, FolderArchive,
  Plus, ChevronRight, MapPin, Trash2,
} from 'lucide-react';

interface AdminPanelProps {
  onBack: () => void;
}

type AdminSection = 'cargar' | 'inspectores' | 'progreso' | 'pdfs' | 'catalogos';
type OdtKind = 'postes' | 'luminarias';

type WorkbookRow = Record<string, string | number>;

const posteRows: WorkbookRow[] = [
  {
    ITEM: 1,
    'COD UCAP': 'POSTE-001',
    'DESC. UCAP': 'Poste de Fibra de 12 m x 510KgF',
    'AP01330F | 7.902214263 | -72.5195196': 1,
    'AP01331F | 7.901835471 | -72.51994473': 1,
    'AP01332F | 7.901792416 | -72.51955789': 1,
    'CANT. INST': 3,
    VALIDACION: 'Pendiente',
  },
  {
    ITEM: 2,
    'COD UCAP': 'POSTE-002',
    'DESC. UCAP': 'Poste de Fibra de 8 m x 510KgF',
    'AP01333F | 7.90177019 | -72.51965189': 1,
    'AP01334F | 7.902231996 | -72.51967902': 1,
    'CANT. INST': 2,
    VALIDACION: 'Pendiente',
  },
];

const luminariaRows: WorkbookRow[] = [
  {
    ITEM: 1,
    'N° ODT': 'ODT-2026-0451',
    DIRECCION: 'La Playa',
    'CODIGO STICKER': 'P907415',
    'POT. RETIRADA - CONV [W]': 0,
    'POT. INSTALADA - LED [W]': 27.8,
    '3 X 14 AWG': '',
    'BRAZO METALICO': 1.5,
    CONECTORES: 2,
    OTRO: '',
    'FECHA INSTALACIÓN': '09/12/2025',
    OBSERVACIONES: 'SAT_3491',
    VALIDACION: 'Pendiente',
  },
  {
    ITEM: 2,
    'N° ODT': 'ODT-2026-0451',
    DIRECCION: 'La Playa',
    'CODIGO STICKER': 'P907411',
    'POT. RETIRADA - CONV [W]': 0,
    'POT. INSTALADA - LED [W]': 27.8,
    '3 X 14 AWG': '',
    'BRAZO METALICO': 1.5,
    CONECTORES: 2,
    OTRO: '',
    'FECHA INSTALACIÓN': '09/12/2025',
    OBSERVACIONES: 'SAT_3491',
    VALIDACION: 'Pendiente',
  },
];

function exportarExcel(tipo: OdtKind): void {
  const rows = tipo === 'postes' ? posteRows : luminariaRows;
  const worksheet = XLSX.utils.json_to_sheet(rows);
  worksheet['!freeze'] = { xSplit: 0, ySplit: 1 };
  worksheet['!autofilter'] = { ref: worksheet['!ref'] ?? 'A1' };
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, tipo === 'postes' ? 'Postes materiales' : 'Luminarias');
  XLSX.writeFile(workbook, `inspecciones-${tipo}-2026.xlsx`);
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [section, setSection] = useState<AdminSection>('cargar');

  return (
    <div className="absolute inset-0 bg-canvas flex flex-col">
      {/* Top bar */}
      <header className="bg-primary text-white h-14 px-5 flex items-center justify-between shadow-soft">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="md:hidden w-8 h-8 grid place-items-center rounded-lg bg-white/10">
            <ChevronRight size={18} className="rotate-180" />
          </button>
          <div className="w-8 h-8 rounded-lg bg-white/10 grid place-items-center">
            <FileText size={18} className="text-accent" />
          </div>
          <div>
            <p className="text-[10px] text-white/70 uppercase tracking-wide leading-none">CONSORCIO INTERALUMBRADO DE CUCUTA</p>
            <p className="text-sm font-semibold leading-tight">Panel Administrativo · Inspecciones AP</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-lg h-9 px-3 w-64">
            <Search size={15} className="text-white/60" />
            <input className="bg-transparent text-sm text-white placeholder:text-white/50 outline-none w-full" placeholder="Buscar ODT, inspector..." />
          </div>
          <button className="w-9 h-9 grid place-items-center rounded-lg bg-white/10 relative">
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-alert" />
          </button>
          <div className="w-9 h-9 rounded-full bg-white/15 grid place-items-center text-xs font-bold">CR</div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 bg-white border-r border-gray-100 flex flex-col shrink-0 hidden md:flex">
          <nav className="flex-1 p-3 space-y-1">
            <p className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">Operación</p>
            <NavItem icon={UploadCloud} label="Cargar Excel" active={section === 'cargar'} onClick={() => setSection('cargar')} />
            <NavItem icon={Users} label="Inspectores" active={section === 'inspectores'} onClick={() => setSection('inspectores')} />
            <NavItem icon={BarChart3} label="Progreso" active={section === 'progreso'} onClick={() => setSection('progreso')} />
            <NavItem icon={FileText} label="Informes" active={section === 'pdfs'} onClick={() => setSection('pdfs')} />
            <p className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-wide text-ink-muted">Configuración</p>
            <NavItem icon={Settings} label="Catálogos" active={section === 'catalogos'} onClick={() => setSection('catalogos')} />
          </nav>
          <div className="p-3 border-t border-gray-100">
            <div className="rounded-xl bg-canvas p-3">
              <p className="text-xs font-semibold text-ink">Almacenamiento</p>
              <div className="mt-1.5 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full w-1/3 bg-accent" />
              </div>
              <p className="text-[10px] text-ink-muted mt-1">2.4 GB usados de 10 GB</p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto scroll-hide p-6">
          {section === 'cargar' && <CargarExcel />}
          {section === 'inspectores' && <Inspectores />}
          {section === 'progreso' && <Progreso />}
          {section === 'pdfs' && <Pdfs />}
          {section === 'catalogos' && <Catalogos />}
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon: Icon, label, active, onClick }: { icon: any; label: string; active?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 h-10 px-3 rounded-lg text-sm font-medium transition ${
        active ? 'bg-primary-50 text-primary' : 'text-ink-soft hover:bg-canvas'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  );
}

function CargarExcel() {
  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-ink">Cargar Excel de rutas</h1>
        <p className="text-sm text-ink-soft mt-0.5">Importe el archivo de ODT y valide las filas antes de asignar.</p>
      </div>

      {/* Drag & drop */}
      <div className="card p-8 border-2 border-dashed border-gray-200">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary grid place-items-center mb-3">
            <UploadCloud size={28} />
          </div>
          <p className="text-sm font-semibold text-ink">Arrastre su archivo Excel aquí</p>
          <p className="text-xs text-ink-muted mt-0.5">Formatos: .xlsx, .xls, .csv · Máx 10 MB</p>
          <div className="mt-4 flex items-center gap-2">
            <button className="btn-primary h-10 px-4 text-sm">
              <FileSpreadsheet size={16} /> Seleccionar archivo
            </button>
            <span className="text-xs text-ink-muted">o arrastre para soltar</span>
          </div>
        </div>
      </div>

      {/* Preview table */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <p className="text-sm font-semibold text-ink">Previsualización · Ruta_Octubre.xlsx</p>
            <p className="text-xs text-ink-soft">32 filas · 2 advertencias · 0 errores</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs text-success-dark bg-success-light h-6 px-2 rounded-full font-medium">
              <Check size={12} /> 30 OK
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-warning-dark bg-warning-light h-6 px-2 rounded-full font-medium">
              <AlertTriangle size={12} /> 2 adv.
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-canvas text-ink-muted text-xs">
              <tr>
                <th className="p-3 text-left font-medium">Estado</th>
                <th className="p-3 text-left font-medium">No. Orden</th>
                <th className="p-3 text-left font-medium">Serie</th>
                <th className="p-3 text-left font-medium">Barrio</th>
                <th className="p-3 text-left font-medium">Municipio</th>
                <th className="p-3 text-left font-medium">Apoyo</th>
                <th className="p-3 text-left font-medium">ODT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { ok: true, orden: 'AP-001-238', serie: 'LED-120-SN-8821', barrio: 'La Playa', mun: 'Cucuta', apoyo: 'AP-014', odt: 'ODT-2026-0451', warn: '' },
                { ok: true, orden: 'AP-001-239', serie: 'LED-090-SN-4410', barrio: 'La Playa', mun: 'Cucuta', apoyo: 'AP-015', odt: 'ODT-2026-0452', warn: '' },
                { ok: false, orden: 'AP-001-240', serie: 'LED-150-SN-7702', barrio: 'La Playa', mun: 'Cucuta', apoyo: 'AP-016', odt: 'ODT-2026-0453', warn: 'Coordenadas sospechosas' },
                { ok: true, orden: 'AP-001-241', serie: 'LED-120-SN-8830', barrio: 'La Playa', mun: 'Cucuta', apoyo: 'AP-017', odt: 'ODT-2026-0454', warn: '' },
                { ok: false, orden: 'AP-001-242', serie: 'LED-060-SN-2204', barrio: 'Centro', mun: 'Cucuta', apoyo: 'AP-018', odt: 'ODT-2026-0455', warn: 'Falta material esperado' },
              ].map((r, i) => (
                <tr key={i} className={r.ok ? 'bg-success-light/40' : 'bg-warning-light/40'}>
                  <td className="p-3">
                    {r.ok ? (
                      <span className="inline-flex items-center gap-1 text-xs text-success-dark font-medium">
                        <Check size={14} /> OK
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-warning-dark font-medium">
                        <AlertTriangle size={14} /> {r.warn}
                      </span>
                    )}
                  </td>
                  <td className="p-3 font-medium text-ink">{r.orden}</td>
                  <td className="p-3 text-ink-soft">{r.serie}</td>
                  <td className="p-3 text-ink-soft">{r.barrio}</td>
                  <td className="p-3 text-ink-soft">{r.mun}</td>
                  <td className="p-3 text-ink-soft">{r.apoyo}</td>
                  <td className="p-3 text-ink-soft">{r.odt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-ink">Asignación de ODT a inspectores</p>
          <button className="btn-secondary h-9 px-3 text-sm">
            <Plus size={15} /> Nueva asignación
          </button>
        </div>
        <div className="space-y-2">
          {[
            { insp: 'Carlos Ramírez', zona: 'Zona Norte', odts: 12, color: 'bg-primary' },
            { insp: 'María Torres', zona: 'Zona Sur', odts: 10, color: 'bg-accent' },
            { insp: 'Jorge Medina', zona: 'Centro', odts: 10, color: 'bg-success' },
          ].map((a) => (
            <div key={a.insp} className="flex items-center justify-between p-3 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full ${a.color} text-white grid place-items-center text-xs font-bold`}>
                  {a.insp.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">{a.insp}</p>
                  <p className="text-xs text-ink-muted flex items-center gap-1">
                    <MapPin size={11} /> {a.zona}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{a.odts}</p>
                  <p className="text-[10px] text-ink-muted">ODT asignadas</p>
                </div>
                <button className="btn-ghost h-8 px-2 text-xs">Reasignar</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xs text-ink-muted">Última importación: hace 3 horas</p>
        <div className="flex items-center gap-2">
          <button className="btn-secondary h-11 px-4">
            <FileSpreadsheet size={18} /> Descargar Excel
          </button>
          <button className="btn-primary h-11 px-5">
            <FolderArchive size={18} /> Descargar ZIP de fotos
          </button>
        </div>
      </div>
    </div>
  );
}

function Inspectores() {
  return (
    <div className="max-w-5xl">
      <h1 className="text-xl font-bold text-ink mb-1">Inspectores</h1>
      <p className="text-sm text-ink-soft mb-5">Gestione usuarios de campo y sus asignaciones.</p>
      <div className="grid grid-cols-3 gap-4">
        {['Carlos Ramírez · Zona Norte', 'María Torres · Zona Sur', 'Jorge Medina · Centro'].map((n) => (
          <div key={n} className="card p-4">
            <div className="w-12 h-12 rounded-full bg-primary-50 text-primary grid place-items-center font-bold">
              {n.split(' ').map((x) => x[0]).slice(0, 2).join('')}
            </div>
            <p className="mt-2 text-sm font-semibold text-ink">{n.split(' · ')[0]}</p>
            <p className="text-xs text-ink-muted">{n.split(' · ')[1]}</p>
            <div className="mt-3 flex gap-2">
              <span className="chip bg-success-light border-success/30 text-success-dark">Activo</span>
              <span className="chip bg-white border-gray-200 text-ink-soft">12 ODT</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Progreso() {
  const bars = [
    { label: 'Pendientes', value: 24, color: 'bg-primary', pct: 60 },
    { label: 'Visitadas', value: 8, color: 'bg-success', pct: 20 },
    { label: 'Con novedad', value: 3, color: 'bg-alert', pct: 8 },
    { label: 'Sincronizadas', value: 5, color: 'bg-accent', pct: 12 },
  ];
  return (
    <div className="max-w-5xl">
      <h1 className="text-xl font-bold text-ink mb-1">Progreso de inspecciones</h1>
      <p className="text-sm text-ink-soft mb-5">Resumen general de la operación.</p>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { l: 'Total activos', v: '40', c: 'text-ink' },
          { l: 'Completado', v: '40%', c: 'text-success' },
          { l: 'Pendiente hoy', v: '24', c: 'text-primary' },
          { l: 'Novedades', v: '3', c: 'text-alert' },
        ].map((s) => (
          <div key={s.l} className="card p-4">
            <p className={`text-2xl font-bold ${s.c}`}>{s.v}</p>
            <p className="text-xs text-ink-muted mt-0.5">{s.l}</p>
          </div>
        ))}
      </div>
      <div className="card p-5">
        <p className="text-sm font-semibold text-ink mb-4">Distribución por estado</p>
        <div className="space-y-3">
          {bars.map((b) => (
            <div key={b.label}>
              <div className="flex justify-between text-xs text-ink-soft mb-1">
                <span>{b.label}</span>
                <span className="font-semibold text-ink">{b.value}</span>
              </div>
              <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                <div className={`h-full ${b.color}`} style={{ width: `${b.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Pdfs() {
  const [periodo, setPeriodo] = useState('octubre');
  const [tipoOdt, setTipoOdt] = useState<OdtKind>('luminarias');
  return (
    <div className="max-w-5xl">
      <h1 className="text-xl font-bold text-ink mb-1">Informes y exportes</h1>
      <p className="text-sm text-ink-soft mb-5">Genere el informe consolidado en PDF o exporte los datos tabulados en Excel.</p>

      {/* Tarjetas de exportación */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="card p-5">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-alert-light text-alert-dark grid place-items-center shrink-0">
              <FileText size={22} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">Informe PDF</p>
              <p className="text-xs text-ink-soft mt-0.5">Documento consolidado con todos los recorridos, observaciones y evidencias fotográficas.</p>
            </div>
          </div>
          <button className="mt-4 btn-primary h-10 px-4 text-sm w-full">
            <Download size={16} /> Generar y descargar PDF
          </button>
        </div>
        <div className="card p-5">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-success-light text-success-dark grid place-items-center shrink-0">
              <FileSpreadsheet size={22} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">Exportar Excel</p>
              <p className="text-xs text-ink-soft mt-0.5">Datos tabulados por luminaria para análisis, filtros y cruce de información.</p>
            </div>
          </div>
          <button
            onClick={() => exportarExcel(tipoOdt)}
            className="mt-4 btn-secondary h-10 px-4 text-sm w-full"
          >
            <Download size={16} /> Descargar Excel de {tipoOdt === 'postes' ? 'postes' : 'luminarias'}
          </button>
        </div>
      </div>

      {/* Selector de plantilla y periodo */}
      <div className="card p-4 mb-4 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <p className="text-sm font-semibold text-ink">Tipo de memoria / ODT</p>
            <p className="text-xs text-ink-soft">La plantilla define el orden de columnas y la forma de validar.</p>
          </div>
          <div className="flex rounded-xl bg-canvas p-1">
            <button
              onClick={() => setTipoOdt('luminarias')}
              className={`h-9 px-4 rounded-lg text-sm font-semibold transition ${tipoOdt === 'luminarias' ? 'bg-white text-primary shadow-card' : 'text-ink-soft'}`}
            >
              Luminarias
            </button>
            <button
              onClick={() => setTipoOdt('postes')}
              className={`h-9 px-4 rounded-lg text-sm font-semibold transition ${tipoOdt === 'postes' ? 'bg-white text-primary shadow-card' : 'text-ink-soft'}`}
            >
              Postes / materiales
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 flex-wrap border-t border-gray-100 pt-3">
          <div>
            <p className="text-sm font-semibold text-ink">Periodo del reporte</p>
            <p className="text-xs text-ink-soft">Incluye inspecciones finalizadas en el rango.</p>
          </div>
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="input-base h-9 w-40 text-sm"
          >
            <option value="semana">Última semana</option>
            <option value="octubre">Octubre 2026</option>
            <option value="trimestre">Trimestre actual</option>
            <option value="anual">Año 2026</option>
          </select>
        </div>
      </div>

      {/* Vista previa según la plantilla seleccionada */}
      <div className="card overflow-hidden mb-4">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <p className="text-sm font-semibold text-ink">Vista previa · memoria de {tipoOdt === 'postes' ? 'postes y materiales' : 'luminarias'}</p>
            <p className="text-xs text-ink-soft">{tipoOdt === 'postes' ? 'Matriz de materiales por código UCAP, poste y coordenada' : 'Una fila por luminaria / código sticker / ODT'}</p>
          </div>
          <span className="chip bg-success-light border-success/30 text-success-dark">Orden lista</span>
        </div>
        <div className="overflow-x-auto">
          {tipoOdt === 'postes' ? (
            <table className="w-full text-xs">
              <thead className="bg-success-light text-success-dark">
                <tr>
                  {['ITEM', 'COD UCAP', 'DESC. UCAP', 'AP01330F | 7.902214263 | -72.5195196', 'AP01331F | 7.901835471 | -72.51994473', 'AP01332F | 7.901792416 | -72.51955789', 'CANT. INST', 'VALIDACIÓN'].map((h) => (
                    <th key={h} className="p-2.5 text-left font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {posteRows.map((row) => (
                  <tr key={String(row.ITEM)} className="even:bg-gray-50">
                    <td className="p-2.5 text-ink">{row.ITEM}</td>
                    <td className="p-2.5 font-medium text-ink">{row['COD UCAP']}</td>
                    <td className="p-2.5 text-ink-soft">{row['DESC. UCAP']}</td>
                    <td className="p-2.5 text-ink-soft">{row['AP01330F | 7.902214263 | -72.5195196'] || ''}</td>
                    <td className="p-2.5 text-ink-soft">{row['AP01331F | 7.901835471 | -72.51994473'] || ''}</td>
                    <td className="p-2.5 text-ink-soft">{row['AP01332F | 7.901792416 | -72.51955789'] || ''}</td>
                    <td className="p-2.5 font-semibold text-ink">{row['CANT. INST']}</td>
                    <td className="p-2.5 text-warning-dark">{row.VALIDACION}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-xs">
              <thead className="bg-primary-50 text-primary">
                <tr>
                  {Object.keys(luminariaRows[0]).map((h) => (
                    <th key={h} className="p-2.5 text-left font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {luminariaRows.map((row) => (
                  <tr key={`${String(row.ITEM)}-${String(row['CODIGO STICKER'])}`} className="even:bg-gray-50">
                    {Object.keys(luminariaRows[0]).map((h) => (
                      <td key={h} className="p-2.5 whitespace-nowrap text-ink-soft">{row[h]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Informes PDF generados */}
      <p className="text-sm font-semibold text-ink mb-2">Informes PDF generados</p>
      <div className="card divide-y divide-gray-100 mb-4">
        {['ODT-2026-0451 · La Playa', 'ODT-2026-0452 · La Playa', 'ODT-2026-0453 · La Playa'].map((p) => (
          <div key={p} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-alert-light text-alert-dark grid place-items-center">
                <FileText size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{p}</p>
                <p className="text-xs text-ink-muted">18/10/2026 · 1.2 MB</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn-ghost h-9 px-3 text-sm"><Download size={15} /></button>
              <button className="btn-ghost h-9 px-3 text-sm text-alert"><Trash2 size={15} /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-2 flex-wrap">
        <button onClick={() => exportarExcel(tipoOdt)} className="btn-secondary h-11 px-5">
          <FileSpreadsheet size={18} /> Descargar Excel de {tipoOdt === 'postes' ? 'postes' : 'luminarias'}
        </button>
        <button className="btn-primary h-11 px-5"><FolderArchive size={18} /> Descargar ZIP de fotos</button>
      </div>
    </div>
  );
}

function Catalogos() {
  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-bold text-ink mb-1">Catálogos</h1>
      <p className="text-sm text-ink-soft mb-5">Materiales, categorías y deficiencias disponibles.</p>
      <div className="grid grid-cols-3 gap-4">
        {[
          { t: 'Materiales', n: 12 },
          { t: 'Categorías', n: 5 },
          { t: 'Deficiencias', n: 10 },
        ].map((c) => (
          <div key={c.t} className="card p-5">
            <p className="text-3xl font-bold text-primary">{c.n}</p>
            <p className="text-sm text-ink-soft mt-1">{c.t}</p>
            <button className="mt-3 btn-secondary h-9 px-3 text-sm w-full">Gestionar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export { X };
