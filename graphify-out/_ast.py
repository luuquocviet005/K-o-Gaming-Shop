import json
from pathlib import Path
from graphify.extract import collect_files, extract
d = json.loads(Path('graphify-out/.graphify_detect.json').read_text(encoding='utf-8'))
code = []
for f in d['files']['code']:
    p = Path(f)
    code.extend(collect_files(p) if p.is_dir() else [p])
r = extract(code, cache_root=Path('.'))
Path('graphify-out/.graphify_ast.json').write_text(json.dumps(r, indent=2, ensure_ascii=False), encoding='utf-8')
print('AST:', len(r['nodes']), 'nodes,', len(r['edges']), 'edges')
