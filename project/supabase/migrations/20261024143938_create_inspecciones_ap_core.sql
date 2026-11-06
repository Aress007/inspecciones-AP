/*
# Crear base operativa de Inspecciones AP

1. Resumen
- Crea la estructura persistente para administrar ODT de postes/materiales y luminarias.
- Permite registrar qué informó la UCAP, qué encontró el inspector y si cada dato coincide.
- Conserva evidencias fotográficas y ejecuciones de reportes administrativos.

2. Nuevas tablas y columnas
- `odt_orders`: una orden de trabajo importada desde una memoria Excel.
  - `odt_type`: clasifica la memoria como `postes` o `luminarias`.
  - `external_code`, `project_name`, `address`, `municipality`, `source_file_name`, `metadata`.
- `assets`: cada poste o luminaria asociado a una ODT.
  - Códigos UCAP/sticker, serie, coordenadas, sector, potencia esperada y materiales esperados.
- `inspections`: una revisión de campo por activo.
  - Datos reportados/observados, categoría, deficiencias, observaciones, estado y sincronización.
- `inspection_validations`: validación individual de código, coordenada y potencia.
- `inspection_material_validations`: validación individual de cada material definido por la UCAP.
- `inspection_photos`: evidencias de la inspección y los datos que fueron impresos sobre la foto.
- `report_runs`: registro de reportes administrativos PDF/Excel generados por periodo y tipo.

3. Integridad y rendimiento
- Usa claves foráneas para conservar la relación ODT → activo → inspección → evidencia.
- Agrega restricciones para tipos, estados y resultados válidos.
- Agrega índices para buscar ODT, activos, inspecciones y reportes rápidamente.
- Evita borrar automáticamente información histórica cuando se elimina una ODT; los registros relacionados quedan protegidos.

4. Seguridad
- Habilita RLS en todas las tablas nuevas.
- La aplicación actual es una operación compartida de una sola organización y todavía no tiene autenticación real conectada a Supabase.
- Por eso, temporalmente se permite CRUD a `anon` y `authenticated` para que el prototipo pueda operar con el cliente público.
- Las políticas están separadas por operación CRUD.

5. Notas importantes
- Los archivos Excel originales no se almacenan dentro de estas tablas; `source_file_name` y `metadata` guardan su referencia y configuración.
- Las fotos deben guardarse posteriormente en Storage usando `inspection_photos.storage_path`; la tabla conserva el vínculo y el sello de datos aplicado.
- Cuando se conecte el login real, estas políticas deben restringirse a `authenticated` y a roles/membresías de la organización antes de usar datos reales.
*/

CREATE TABLE IF NOT EXISTS public.odt_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_code text NOT NULL UNIQUE,
  odt_type text NOT NULL CHECK (odt_type IN ('postes', 'luminarias')),
  project_name text NOT NULL,
  address text,
  municipality text NOT NULL DEFAULT 'San José de Cúcuta',
  source_file_name text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pendiente' CHECK (status IN ('pendiente', 'en_revision', 'finalizada', 'cancelada')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  odt_id uuid NOT NULL REFERENCES public.odt_orders(id) ON DELETE RESTRICT,
  asset_type text NOT NULL CHECK (asset_type IN ('poste', 'luminaria')),
  asset_code text NOT NULL,
  ucap_code text,
  sticker_code text,
  description text,
  series text,
  sector text,
  municipality text NOT NULL DEFAULT 'San José de Cúcuta',
  latitude numeric(10,7),
  longitude numeric(10,7),
  expected_power_w numeric(10,2),
  expected_materials jsonb NOT NULL DEFAULT '[]'::jsonb,
  source_row integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (odt_id, asset_code)
);

CREATE TABLE IF NOT EXISTS public.inspections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid NOT NULL REFERENCES public.assets(id) ON DELETE RESTRICT,
  inspector_name text NOT NULL,
  status text NOT NULL DEFAULT 'borrador' CHECK (status IN ('borrador', 'completada', 'sincronizada')),
  category text,
  deficiencies text[] NOT NULL DEFAULT '{}'::text[],
  observed_code text,
  observed_latitude numeric(10,7),
  observed_longitude numeric(10,7),
  observed_power_w numeric(10,2),
  observations text,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  is_offline boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.inspection_validations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
  field_key text NOT NULL CHECK (field_key IN ('codigo', 'coordenada', 'potencia')),
  expected_value text NOT NULL,
  observed_value text,
  result text NOT NULL DEFAULT 'pendiente' CHECK (result IN ('pendiente', 'coincide', 'no_coincide')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (inspection_id, field_key)
);

CREATE TABLE IF NOT EXISTS public.inspection_material_validations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
  material_name text NOT NULL,
  expected_quantity numeric(10,2),
  unit text,
  observed_quantity numeric(10,2),
  result text NOT NULL DEFAULT 'pendiente' CHECK (result IN ('pendiente', 'coincide', 'no_coincide')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (inspection_id, material_name)
);

CREATE TABLE IF NOT EXISTS public.inspection_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inspection_id uuid NOT NULL REFERENCES public.inspections(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  captured_at timestamptz NOT NULL DEFAULT now(),
  stamped_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.report_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type text NOT NULL CHECK (report_type IN ('pdf', 'excel')),
  odt_type text CHECK (odt_type IN ('postes', 'luminarias', 'todos')),
  period_start date,
  period_end date,
  file_name text NOT NULL,
  filters jsonb NOT NULL DEFAULT '{}'::jsonb,
  generated_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_odt_orders_type_status ON public.odt_orders (odt_type, status);
CREATE INDEX IF NOT EXISTS idx_assets_odt_id ON public.assets (odt_id);
CREATE INDEX IF NOT EXISTS idx_assets_code ON public.assets (asset_code);
CREATE INDEX IF NOT EXISTS idx_assets_sector ON public.assets (sector);
CREATE INDEX IF NOT EXISTS idx_inspections_asset_status ON public.inspections (asset_id, status);
CREATE INDEX IF NOT EXISTS idx_inspection_photos_inspection_id ON public.inspection_photos (inspection_id);
CREATE INDEX IF NOT EXISTS idx_report_runs_type_created_at ON public.report_runs (report_type, created_at DESC);

ALTER TABLE public.odt_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_material_validations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inspection_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_runs ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.odt_orders TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assets TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inspections TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inspection_validations TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inspection_material_validations TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inspection_photos TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.report_runs TO anon, authenticated;

DROP POLICY IF EXISTS "shared_select_odt_orders" ON public.odt_orders;
CREATE POLICY "shared_select_odt_orders" ON public.odt_orders FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "shared_insert_odt_orders" ON public.odt_orders;
CREATE POLICY "shared_insert_odt_orders" ON public.odt_orders FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "shared_update_odt_orders" ON public.odt_orders;
CREATE POLICY "shared_update_odt_orders" ON public.odt_orders FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "shared_delete_odt_orders" ON public.odt_orders;
CREATE POLICY "shared_delete_odt_orders" ON public.odt_orders FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "shared_select_assets" ON public.assets;
CREATE POLICY "shared_select_assets" ON public.assets FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "shared_insert_assets" ON public.assets;
CREATE POLICY "shared_insert_assets" ON public.assets FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "shared_update_assets" ON public.assets;
CREATE POLICY "shared_update_assets" ON public.assets FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "shared_delete_assets" ON public.assets;
CREATE POLICY "shared_delete_assets" ON public.assets FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "shared_select_inspections" ON public.inspections;
CREATE POLICY "shared_select_inspections" ON public.inspections FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "shared_insert_inspections" ON public.inspections;
CREATE POLICY "shared_insert_inspections" ON public.inspections FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "shared_update_inspections" ON public.inspections;
CREATE POLICY "shared_update_inspections" ON public.inspections FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "shared_delete_inspections" ON public.inspections;
CREATE POLICY "shared_delete_inspections" ON public.inspections FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "shared_select_inspection_validations" ON public.inspection_validations;
CREATE POLICY "shared_select_inspection_validations" ON public.inspection_validations FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "shared_insert_inspection_validations" ON public.inspection_validations;
CREATE POLICY "shared_insert_inspection_validations" ON public.inspection_validations FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "shared_update_inspection_validations" ON public.inspection_validations;
CREATE POLICY "shared_update_inspection_validations" ON public.inspection_validations FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "shared_delete_inspection_validations" ON public.inspection_validations;
CREATE POLICY "shared_delete_inspection_validations" ON public.inspection_validations FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "shared_select_inspection_materials" ON public.inspection_material_validations;
CREATE POLICY "shared_select_inspection_materials" ON public.inspection_material_validations FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "shared_insert_inspection_materials" ON public.inspection_material_validations;
CREATE POLICY "shared_insert_inspection_materials" ON public.inspection_material_validations FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "shared_update_inspection_materials" ON public.inspection_material_validations;
CREATE POLICY "shared_update_inspection_materials" ON public.inspection_material_validations FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "shared_delete_inspection_materials" ON public.inspection_material_validations;
CREATE POLICY "shared_delete_inspection_materials" ON public.inspection_material_validations FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "shared_select_inspection_photos" ON public.inspection_photos;
CREATE POLICY "shared_select_inspection_photos" ON public.inspection_photos FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "shared_insert_inspection_photos" ON public.inspection_photos;
CREATE POLICY "shared_insert_inspection_photos" ON public.inspection_photos FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "shared_update_inspection_photos" ON public.inspection_photos;
CREATE POLICY "shared_update_inspection_photos" ON public.inspection_photos FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "shared_delete_inspection_photos" ON public.inspection_photos;
CREATE POLICY "shared_delete_inspection_photos" ON public.inspection_photos FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "shared_select_report_runs" ON public.report_runs;
CREATE POLICY "shared_select_report_runs" ON public.report_runs FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "shared_insert_report_runs" ON public.report_runs;
CREATE POLICY "shared_insert_report_runs" ON public.report_runs FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "shared_update_report_runs" ON public.report_runs;
CREATE POLICY "shared_update_report_runs" ON public.report_runs FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "shared_delete_report_runs" ON public.report_runs;
CREATE POLICY "shared_delete_report_runs" ON public.report_runs FOR DELETE TO anon, authenticated USING (true);
