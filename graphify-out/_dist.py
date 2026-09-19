import json, collections
from pathlib import Path
r = json.loads(Path('graphify-out/.graphify_detect.json').read_text(encoding='utf-8'))
root = Path(r['scan_root'])
for cat in ('image', 'document', 'code'):
    c = collections.Counter()
    for f in r['files'][cat]:
        p = Path(f)
        try: rel = p.relative_to(root)
        except ValueError: rel = p
        parts = rel.parts
        c['/'.join(parts[:2])] += 1
    print(cat, c.most_common(8))
