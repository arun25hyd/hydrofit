import { SQLiteDatabase } from 'expo-sqlite';

// Inline seed data — small representative set to verify DB works
// Full data will be loaded from bundled JSON assets in Phase 2
const HOSE_FITTING_SAMPLES = [
  { fitting_type: 'Male JIC 37 - Rigid', standard: 'JIC', gender: 'male',
    orientation: 'rigid', end_style: 'standard', thread_inch: '9/16x18',
    hose_id_inch: '5/16', dim_A_inch: 2.12, dim_H_inch: 0.75, dim_B_inch: 1.26 },
  { fitting_type: 'Female JIC 37 - Swivel', standard: 'JIC', gender: 'female',
    orientation: 'swivel', end_style: 'standard', thread_inch: '9/16x18',
    hose_id_inch: '5/16', dim_A_inch: 1.81, dim_W_inch: 0.6875, dim_B_inch: 0.95 },
  { fitting_type: 'Male Seal-Lok - Rigid - (with O-Ring)', standard: 'ORFS', gender: 'male',
    orientation: 'rigid', end_style: 'standard', thread_inch: '11/16x16',
    hose_id_inch: '3/8', dim_A_inch: 1.95, dim_H_inch: 0.75, dim_B_inch: 1.10 },
  { fitting_type: 'Male NPTF Pipe - Rigid', standard: 'NPTF', gender: 'male',
    orientation: 'rigid', end_style: 'standard', thread_inch: '3/8x18',
    hose_id_inch: '3/8', dim_A_inch: 1.89, dim_H_inch: 0.6875, dim_B_inch: 1.03 },
];

const TUBE_FITTING_SAMPLES = [
  { fitting_type: 'Straight Male Stud', series: 'L',
    series_desc: 'L — Light series (max 400 bar)', thread_standard: 'BSPP',
    tube_od_mm: 6, pressure_rating_bar: 400, thread_size: 'G 1/4',
    dim_T_mm: 4, dim_D2_mm: 12, dim_i_mm: 29, dim_L_mm: 37,
    dim_L1_mm: 10, dim_L2_mm: 19, dim_S1_mm: 14, dim_S2_mm: 35, torque_Nm: 4.3 },
  { fitting_type: 'Straight Male Stud', series: 'S',
    series_desc: 'S — Heavy series (max 630 bar)', thread_standard: 'BSPP',
    tube_od_mm: 6, pressure_rating_bar: 630, thread_size: 'G 1/4',
    dim_T_mm: 4, dim_D2_mm: 12, dim_i_mm: 32, dim_L_mm: 40,
    dim_L1_mm: 13, dim_L2_mm: 19, dim_S1_mm: 17, dim_S2_mm: 55, torque_Nm: 5.8 },
];

const HOSE_SAMPLES = [
  { hose_name: 'SAE 100R1AT / EN 853 1SN — 1 wire braid',
    reinforcement: '1 wire braid', tube_material: 'oil resistant synthetic rubber',
    temp_range: '-40°C to +100°C',
    application: 'High pressure hydraulic lines, fuel oil, antifreeze solutions',
    dash_size: -6, id_mm: 10, id_inch: '3/8', od_mm: 17.4,
    wp_bar: 180, wp_psi: 2610, bp_bar: 720, bp_psi: 10440, min_bend_radius_mm: 130, safety_factor: 4.0 },
  { hose_name: 'SAE 100R1AT / EN 853 1SN — 1 wire braid',
    reinforcement: '1 wire braid', tube_material: 'oil resistant synthetic rubber',
    temp_range: '-40°C to +100°C',
    application: 'High pressure hydraulic lines, fuel oil, antifreeze solutions',
    dash_size: -8, id_mm: 13, id_inch: '1/2', od_mm: 20.6,
    wp_bar: 160, wp_psi: 2320, bp_bar: 640, bp_psi: 9280, min_bend_radius_mm: 180, safety_factor: 4.0 },
];

export async function seedDatabase(db: SQLiteDatabase): Promise<void> {
  await db.withTransactionAsync(async () => {
    // Seed hose fittings
    for (const f of HOSE_FITTING_SAMPLES) {
      await db.runAsync(
        `INSERT INTO hose_fittings
         (fitting_type, standard, gender, orientation, end_style,
          thread_inch, hose_id_inch, dim_A_inch, dim_H_inch, dim_B_inch,
          dim_E_inch, dim_W_inch)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
        [f.fitting_type, f.standard, f.gender ?? null, f.orientation ?? null,
         f.end_style ?? null, f.thread_inch ?? null, f.hose_id_inch ?? null,
         f.dim_A_inch ?? null, f.dim_H_inch ?? null, f.dim_B_inch ?? null,
         null, (f as any).dim_W_inch ?? null]
      );
    }

    // Seed tube fittings
    for (const t of TUBE_FITTING_SAMPLES) {
      await db.runAsync(
        `INSERT INTO tube_fittings
         (fitting_type, series, series_desc, thread_standard,
          tube_od_mm, pressure_rating_bar, thread_size,
          dim_T_mm, dim_D2_mm, dim_i_mm, dim_L_mm,
          dim_L1_mm, dim_L2_mm, dim_S1_mm, dim_S2_mm, torque_Nm)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [t.fitting_type, t.series, t.series_desc, t.thread_standard,
         t.tube_od_mm, t.pressure_rating_bar, t.thread_size,
         t.dim_T_mm, t.dim_D2_mm, t.dim_i_mm, t.dim_L_mm,
         t.dim_L1_mm, t.dim_L2_mm, t.dim_S1_mm, t.dim_S2_mm, t.torque_Nm]
      );
    }

    // Seed hoses
    for (const h of HOSE_SAMPLES) {
      await db.runAsync(
        `INSERT INTO hoses
         (hose_name, reinforcement, tube_material, temp_range, application,
          dash_size, id_mm, id_inch, od_mm, wp_bar, wp_psi,
          bp_bar, bp_psi, min_bend_radius_mm, safety_factor)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
        [h.hose_name, h.reinforcement, h.tube_material, h.temp_range,
         h.application, h.dash_size, h.id_mm, h.id_inch, h.od_mm,
         h.wp_bar, h.wp_psi, h.bp_bar, h.bp_psi,
         h.min_bend_radius_mm, h.safety_factor]
      );
    }
  });
}
