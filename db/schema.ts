import * as SQLite from 'expo-sqlite';

export type DB = SQLite.SQLiteDatabase;

// ── Table: hose_fittings ──────────────────────────────────────────────────
// Crimped hose fittings: JIC, ORFS, NPTF, SAE45, BSPP, SAE Flange
export const CREATE_HOSE_FITTINGS = `
  CREATE TABLE IF NOT EXISTS hose_fittings (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    fitting_type     TEXT NOT NULL,
    standard         TEXT NOT NULL,
    gender           TEXT,
    orientation      TEXT,
    end_style        TEXT,
    thread_inch      TEXT,
    hose_id_inch     TEXT,
    dim_A_inch       REAL,
    dim_H_inch       REAL,
    dim_B_inch       REAL,
    dim_E_inch       REAL,
    dim_W_inch       REAL,
    dim_C_inch       REAL,
    dim_D_inch       REAL
  );
`;

// ── Table: tube_fittings ──────────────────────────────────────────────────
// DIN 24° cutting ring tube fittings (DIN 2353 / ISO 8434-1)
export const CREATE_TUBE_FITTINGS = `
  CREATE TABLE IF NOT EXISTS tube_fittings (
    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
    fitting_type         TEXT NOT NULL,
    series               TEXT NOT NULL,
    series_desc          TEXT,
    thread_standard      TEXT,
    tube_od_mm           REAL NOT NULL,
    pressure_rating_bar  INTEGER,
    thread_size          TEXT,
    dim_T_mm             REAL,
    dim_D2_mm            REAL,
    dim_i_mm             REAL,
    dim_L_mm             REAL,
    dim_L1_mm            REAL,
    dim_L2_mm            REAL,
    dim_S1_mm            REAL,
    dim_S2_mm            REAL,
    torque_Nm            REAL
  );
`;
// ── Table: hoses ─────────────────────────────────────────────────────────
// SAE/EN hydraulic hose specifications
export const CREATE_HOSES = `
  CREATE TABLE IF NOT EXISTS hoses (
    id                   INTEGER PRIMARY KEY AUTOINCREMENT,
    hose_name            TEXT NOT NULL,
    reinforcement        TEXT,
    tube_material        TEXT,
    temp_range           TEXT,
    application          TEXT,
    dash_size            INTEGER NOT NULL,
    id_mm                REAL,
    id_inch              TEXT,
    od_mm                REAL,
    wp_bar               REAL,
    wp_psi               INTEGER,
    bp_bar               REAL,
    bp_psi               INTEGER,
    min_bend_radius_mm   INTEGER,
    safety_factor        REAL
  );
`;

// ── Table: standards_kb ──────────────────────────────────────────────────
// Standard definitions, assembly notes, thread ID guides
export const CREATE_STANDARDS_KB = `
  CREATE TABLE IF NOT EXISTS standards_kb (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    standard_key   TEXT UNIQUE NOT NULL,
    name           TEXT NOT NULL,
    standard_ref   TEXT,
    seal_method    TEXT,
    thread_form    TEXT,
    identification TEXT,
    notes          TEXT,
    assembly_notes TEXT
  );
`;

export const ALL_TABLES = [
  CREATE_HOSE_FITTINGS,
  CREATE_TUBE_FITTINGS,
  CREATE_HOSES,
  CREATE_STANDARDS_KB,
];
