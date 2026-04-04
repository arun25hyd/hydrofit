#!/usr/bin/env python3
"""
HydroFit data generator — run once to populate db/data/ from JSON files.
Place the 3 JSON files in ~/Downloads/ then run:
  python3 /Users/admin/hydrofit/scripts/generate_data.py
"""
import json, os, sys

DATA_DIR = '/Users/admin/hydrofit/db/data'
os.makedirs(DATA_DIR, exist_ok=True)

def load_json(path):
    with open(path) as f:
        return json.load(f)

def fval(v):
    if v is None or v == '' or str(v).lower() == 'none': return None
    try: return float(v)
    except: return None

def clean_hf(e):
    return {'fitting_type':e.get('fitting_type',''),'standard':e.get('standard',''),
            'gender':e.get('gender','') or None,'orientation':e.get('orientation','') or None,
            'end_style':e.get('end_style','') or None,'thread_inch':e.get('thread_inch','') or None,
            'hose_id_inch':e.get('hose_id_inch','') or None,'dim_A_inch':fval(e.get('dim_A_inch')),
            'dim_H_inch':fval(e.get('dim_H_inch')),'dim_B_inch':fval(e.get('dim_B_inch')),
            'dim_E_inch':fval(e.get('dim_E_inch')),'dim_W_inch':fval(e.get('dim_W_inch')),
            'dim_C_inch':fval(e.get('dim_C_inch')),'dim_D_inch':fval(e.get('dim_D_inch'))}

def clean_tf(e):
    return {'fitting_type':e.get('fitting_type',''),'series':e.get('series',''),
            'series_desc':e.get('series_desc','') or None,'thread_standard':e.get('thread_standard','') or None,
            'tube_od_mm':fval(e.get('tube_od_mm')),'pressure_rating_bar':fval(e.get('pressure_rating_bar')),
            'thread_size':e.get('thread_size','') or None,'dim_T_mm':fval(e.get('dim_T_mm')),
            'dim_D2_mm':fval(e.get('dim_D2_mm')),'dim_i_mm':fval(e.get('dim_i_mm')),
            'dim_L_mm':fval(e.get('dim_L_mm')),'dim_L1_mm':fval(e.get('dim_L1_mm')),
            'dim_L2_mm':fval(e.get('dim_L2_mm')),'dim_S1_mm':fval(e.get('dim_S1_mm')),
            'dim_S2_mm':fval(e.get('dim_S2_mm')),'torque_Nm':fval(e.get('torque_Nm'))}

def clean_hose(e):
    return {'hose_name':e.get('hose_name',''),'reinforcement':e.get('reinforcement','') or None,
            'tube_material':e.get('tube_material','') or None,'temp_range':e.get('temp_range','') or None,
            'application':e.get('application','') or None,'dash_size':int(e.get('dash_size',0)),
            'id_mm':fval(e.get('id_mm')),'id_inch':e.get('id_inch','') or None,
            'od_mm':fval(e.get('od_mm')),'wp_bar':fval(e.get('wp_bar')),
            'wp_psi':int(e['wp_psi']) if e.get('wp_psi') else None,
            'bp_bar':fval(e.get('bp_bar')),'bp_psi':int(e['bp_psi']) if e.get('bp_psi') else None,
            'min_bend_radius_mm':int(e['min_bend_radius_mm']) if e.get('min_bend_radius_mm') else None,
            'safety_factor':fval(e.get('safety_factor'))}

def write_ts(path, varname, data):
    with open(path,'w') as f:
        f.write(f'export const {varname} = {json.dumps(data,separators=(",",":"))} as const;')
    print(f'  {os.path.basename(path)} — {len(data)} entries — {os.path.getsize(path)//1024}KB')

def find_json(name):
    for d in [os.path.expanduser('~/Downloads'), os.path.expanduser('~/Desktop'), '/tmp']:
        p = os.path.join(d, name)
        if os.path.exists(p): return p
    return None

def main():
    hf_path = find_json('hydrofit_entries.json')
    tf_path = find_json('hydrofit_din_entries.json')
    ho_path = find_json('hydrofit_hoses_final.json')
    missing = [n for n,p in [('hydrofit_entries.json',hf_path),
                               ('hydrofit_din_entries.json',tf_path),
                               ('hydrofit_hoses_final.json',ho_path)] if not p]
    if missing:
        print('ERROR — cannot find these files in ~/Downloads, ~/Desktop or /tmp:')
        for m in missing: print(f'  {m}')
        print('\nDownload from the claude.ai conversation outputs and retry.')
        sys.exit(1)

    hf = [clean_hf(e)   for e in load_json(hf_path)]
    tf = [clean_tf(e)   for e in load_json(tf_path)]
    ho = [clean_hose(e) for e in load_json(ho_path)]
    print(f'Loaded: {len(hf)} hose fittings, {len(tf)} tube fittings, {len(ho)} hoses')

    CHUNK = 200
    chunks = [hf[i:i+CHUNK] for i in range(0, len(hf), CHUNK)]
    for idx, chunk in enumerate(chunks):
        write_ts(f'{DATA_DIR}/hose_fittings_{idx}.ts', f'HOSE_FITTINGS_{idx}', chunk)
    write_ts(f'{DATA_DIR}/tube_fittings.ts', 'TUBE_FITTINGS', tf)
    write_ts(f'{DATA_DIR}/hoses.ts', 'HOSES', ho)
    print(f'\nAll done — {len(chunks)+2} files written to {DATA_DIR}')

if __name__ == '__main__':
    main()
