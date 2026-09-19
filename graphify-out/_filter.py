import json
from pathlib import Path
p = Path('graphify-out/.graphify_detect.json')
r = json.loads(p.read_text(encoding='utf-8'))
n = len(r['files']['image'])
r['files']['image'] = []
r['total_files'] -= n
p.write_text(json.dumps(r, ensure_ascii=False), encoding='utf-8')
print('dropped', n, 'images; now', r['total_files'], 'files')
print('docs:'); [print(' ', f) for f in r['files']['document']]
