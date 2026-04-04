import { getDB } from './database';

// ── Hose Fittings ─────────────────────────────────────────────────────────

export async function getStandards(): Promise<string[]> {
  const db = await getDB();
  const rows = await db.getAllAsync<{ standard: string }>(
    'SELECT DISTINCT standard FROM hose_fittings ORDER BY standard'
  );
  return rows.map(r => r.standard);
}

export async function getFittingTypes(standard: string): Promise<any[]> {
  const db = await getDB();
  return db.getAllAsync(
    `SELECT DISTINCT fitting_type, orientation, end_style,
            dim_A_inch, dim_H_inch, dim_B_inch, dim_E_inch, dim_W_inch
     FROM hose_fittings
     WHERE standard = ?
     ORDER BY fitting_type`,
    [standard]
  );
}

export async function getFittingDetail(
  standard: string,
  fittingType: string,
  threadInch: string
): Promise<any | null> {
  const db = await getDB();
  return db.getFirstAsync(
    `SELECT * FROM hose_fittings
     WHERE standard = ? AND fitting_type = ? AND thread_inch = ?
     LIMIT 1`,
    [standard, fittingType, threadInch]
  );
}

export async function getThreadSizes(
  standard: string,
  fittingType: string
): Promise<string[]> {
  const db = await getDB();
  const rows = await db.getAllAsync<{ thread_inch: string }>(
    `SELECT DISTINCT thread_inch FROM hose_fittings
     WHERE standard = ? AND fitting_type = ? AND thread_inch != ''
     ORDER BY thread_inch`,
    [standard, fittingType]
  );
  return rows.map(r => r.thread_inch);
}

// ── Tube Fittings ─────────────────────────────────────────────────────────

export async function getTubeFittingTypes(): Promise<string[]> {
  const db = await getDB();
  const rows = await db.getAllAsync<{ fitting_type: string }>(
    'SELECT DISTINCT fitting_type FROM tube_fittings ORDER BY fitting_type'
  );
  return rows.map(r => r.fitting_type);
}

export async function getTubeFittingsByOD(
  fittingType: string,
  series: string
): Promise<any[]> {
  const db = await getDB();
  return db.getAllAsync(
    `SELECT * FROM tube_fittings
     WHERE fitting_type = ? AND series = ?
     ORDER BY tube_od_mm`,
    [fittingType, series]
  );
}

// ── Hoses ─────────────────────────────────────────────────────────────────

export async function getHoseTypes(): Promise<string[]> {
  const db = await getDB();
  const rows = await db.getAllAsync<{ hose_name: string }>(
    'SELECT DISTINCT hose_name FROM hoses ORDER BY hose_name'
  );
  return rows.map(r => r.hose_name);
}

export async function getHoseSizes(hoseName: string): Promise<any[]> {
  const db = await getDB();
  return db.getAllAsync(
    `SELECT * FROM hoses WHERE hose_name = ? ORDER BY dash_size`,
    [hoseName]
  );
}

// ── Search ────────────────────────────────────────────────────────────────

export async function searchFittings(query: string): Promise<any[]> {
  const db = await getDB();
  const q = `%${query}%`;
  return db.getAllAsync(
    `SELECT *, 'hose' as category FROM hose_fittings
     WHERE fitting_type LIKE ? OR standard LIKE ? OR thread_inch LIKE ?
     UNION ALL
     SELECT id, fitting_type, series as standard, NULL, NULL, NULL,
            CAST(tube_od_mm as TEXT), NULL, NULL, NULL, NULL, NULL, NULL,
            'tube' as category
     FROM tube_fittings
     WHERE fitting_type LIKE ? OR thread_size LIKE ?
     LIMIT 50`,
    [q, q, q, q, q]
  );
}
