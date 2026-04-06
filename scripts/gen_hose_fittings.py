#!/usr/bin/env python3
"""
Generates hose_fittings_0.ts through hose_fittings_7.ts
from hydrofit_entries.json in ~/Downloads.
If not in Downloads, also checks ~/Desktop and /tmp.
Run: python3 /Users/admin/hydrofit/scripts/gen_hose_fittings.py
"""
import json, os, sys

DATA_DIR = '/Users/admin/hydrofit/db/data'
os.makedirs(DATA_DIR, exist_ok=True)

def find(name):
    for d in [os.path.expanduser('~/Downloads'), os.path.expanduser('~/Desktop'), '/tmp']:
        p = os.path.join(d, name)
        if os.path.exists(p): return p
    return None

def fval(v):
    if v is None or v == '' or str(v).lower() == 'none': return None
    try: return float(v)
    except: return None

def clean(e):
    return {
        'fitting_type': e.get('fitting_type',''),
        'standard':     e.get('standard',''),
        'gender':       e.get('gender','') or None,
        'orientation':  e.get('orientation','') or None,
        'end_style':    e.get('end_style','') or None,
        'thread_inch':  e.get('thread_inch','') or None,
        'hose_id_inch': e.get('hose_id_inch','') or None,
        'dim_A_inch':   fval(e.get('dim_A_inch')),
        'dim_H_inch':   fval(e.get('dim_H_inch')),
        'dim_B_inch':   fval(e.get('dim_B_inch')),
        'dim_E_inch':   fval(e.get('dim_E_inch')),
        'dim_W_inch':   fval(e.get('dim_W_inch')),
        'dim_C_inch':   fval(e.get('dim_C_inch')),
        'dim_D_inch':   fval(e.get('dim_D_inch')),
    }

src = find('hydrofit_entries.json')
if not src:
    print('ERROR: hydrofit_entries.json not found in ~/Downloads, ~/Desktop or /tmp')
    print('Download it from the claude.ai conversation output panel.')
    sys.exit(1)

with open(src) as f:
    raw = json.load(f)

data = [clean(e) for e in raw]
CHUNK = 200
chunks = [data[i:i+CHUNK] for i in range(0, len(data), CHUNK)]

for idx, chunk in enumerate(chunks):
    path = f'{DATA_DIR}/hose_fittings_{idx}.ts'
    content = f'export const HOSE_FITTINGS_{idx} = {json.dumps(chunk, separators=(",",":"))} as const;'
    with open(path, 'w') as f:
        f.write(content)
    print(f'  hose_fittings_{idx}.ts — {len(chunk)} entries — {os.path.getsize(path)//1024}KB')

print(f'\nDone — {len(chunks)} files written to {DATA_DIR}')
print('Now run: cd /Users/admin/hydrofit && npx expo export --platform android --no-minify')
