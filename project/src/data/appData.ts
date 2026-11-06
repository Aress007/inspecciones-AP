export type AssetStatus = 'pendiente' | 'visitado' | 'novedad';

export interface Asset {
  id: string;
  codigo: string;
  farola: string;
  odt: string;
  estado: AssetStatus;
  barrio: string;
  municipio: string;
  lat: number;
  lon: number;
  apoyo: string;
  serie: string;
  potencia: number;
  materiales: { nombre: string; unidad: string; esperado: number }[];
}

export const inspector = {
  nombre: 'Carlos Ramírez',
  rol: 'Interventor AP',
  cedula: 'C.C. 1.032.456',
  zona: 'Cucuta',
};

export const assets: Asset[] = [
  {
    id: 'a1',
    codigo: 'AP-001-238',
    farola: 'Farola LED 120W',
    odt: 'ODT-2026-0451',
    estado: 'pendiente',
    barrio: 'La Playa',
    municipio: 'Cucuta',
    lat: 7.885196,
    lon: -72.500905,
    apoyo: 'AP-014',
    serie: 'LED-120-SN-8821',
    potencia: 120,
    materiales: [
      { nombre: 'Cable', unidad: 'm', esperado: 6 },
      { nombre: 'Brazo', unidad: 'und', esperado: 1 },
      { nombre: 'Conectores', unidad: 'und', esperado: 4 },
      { nombre: 'Fotocelda', unidad: 'und', esperado: 1 },
    ],
  },
  {
    id: 'a2',
    codigo: 'AP-001-239',
    farola: 'Farola LED 90W',
    odt: 'ODT-2026-0452',
    estado: 'visitado',
    barrio: 'La Playa',
    municipio: 'Cucuta',
    lat: 7.885198,
    lon: -72.500900,
    apoyo: 'AP-015',
    serie: 'LED-090-SN-4410',
    potencia: 90,
    materiales: [
      { nombre: 'Cable', unidad: 'm', esperado: 5 },
      { nombre: 'Brazo', unidad: 'und', esperado: 1 },
      { nombre: 'Conectores', unidad: 'und', esperado: 3 },
      { nombre: 'Fotocelda', unidad: 'und', esperado: 1 },
    ],
  },
  {
    id: 'a3',
    codigo: 'AP-001-240',
    farola: 'Farola LED 150W',
    odt: 'ODT-2026-0453',
    estado: 'novedad',
    barrio: 'La Playa',
    municipio: 'Cucuta',
    lat: 7.884505,
    lon: -72.501157,
    apoyo: 'AP-016',
    serie: 'LED-150-SN-7702',
    potencia: 150,
    materiales: [
      { nombre: 'Cable', unidad: 'm', esperado: 8 },
      { nombre: 'Brazo', unidad: 'und', esperado: 1 },
      { nombre: 'Conectores', unidad: 'und', esperado: 6 },
      { nombre: 'Fotocelda', unidad: 'und', esperado: 1 },
    ],
  },
  {
    id: 'a4',
    codigo: 'AP-001-241',
    farola: 'Farola LED 120W',
    odt: 'ODT-2026-0454',
    estado: 'pendiente',
    barrio: 'La Playa',
    municipio: 'Cucuta',
    lat: 7.884064,
    lon: -72.502525,
    apoyo: 'AP-017',
    serie: 'LED-120-SN-8830',
    potencia: 120,
    materiales: [
      { nombre: 'Cable', unidad: 'm', esperado: 6 },
      { nombre: 'Brazo', unidad: 'und', esperado: 1 },
      { nombre: 'Conectores', unidad: 'und', esperado: 4 },
      { nombre: 'Fotocelda', unidad: 'und', esperado: 1 },
    ],
  },
  {
    id: 'a5',
    codigo: 'AP-001-242',
    farola: 'Farola LED 60W',
    odt: 'ODT-2026-0455',
    estado: 'pendiente',
    barrio: 'Centro',
    municipio: 'Cucuta',
    lat: 7.884001,
    lon: -72.500176,
    apoyo: 'AP-018',
    serie: 'LED-060-SN-2204',
    potencia: 60,
    materiales: [
      { nombre: 'Cable', unidad: 'm', esperado: 4 },
      { nombre: 'Brazo', unidad: 'und', esperado: 1 },
      { nombre: 'Conectores', unidad: 'und', esperado: 2 },
      { nombre: 'Fotocelda', unidad: 'und', esperado: 1 },
    ],
  },
];

export const categorias = [
  'Luminaria en buen estado',
  'Luminaria con deficiencia leve',
  'Luminaria con deficiencia grave',
  'Falta de luminaria',
  'Luminaria fuera de servicio',
];

export const deficiencias = [
  'Lámpara apagada',
  'Lámpara parpadeante',
  'Luminaria inclinada',
  'Brazo dañado',
  'Cable expuesto',
  'Fotocelda defectuosa',
  'Vándalo / robo',
  'Suciedad acumulada',
  'Falta de tapa',
  'Corrosión',
];

export const estadoMeta: Record<AssetStatus, { label: string; tone: 'pending' | 'visited' | 'novelty' }> = {
  pendiente: { label: 'Pendiente', tone: 'pending' },
  visitado: { label: 'Visitado', tone: 'visited' },
  novedad: { label: 'Con novedad', tone: 'novelty' },
};
