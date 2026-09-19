import json
from pathlib import Path
from graphify.cache import check_semantic_cache
d = json.loads(Path('graphify-out/.graphify_detect.json').read_text(encoding='utf-8'))
all_files = [f for cat in ('document','paper','image') for f in d['files'].get(cat, [])]
spec = r'C:\Users\OS\.claude\skills\graphify\references\extraction-spec.md'
cn, ce, ch, unc = check_semantic_cache(all_files, root='.', prompt_file=spec)
if cn or ce or ch:
    Path('graphify-out/.graphify_cached.json').write_text(json.dumps({'nodes':cn,'edges':ce,'hyperedges':ch}, ensure_ascii=False), encoding='utf-8')
else:
    Path('graphify-out/.graphify_cached.json').unlink(missing_ok=True)
Path('graphify-out/.graphify_uncached.txt').write_text('\n'.join(unc), encoding='utf-8')
print('cache hit', len(all_files)-len(unc), '| need extraction', len(unc))
for u in unc: print('  ', Path(u).name, Path(u).stat().st_size)
