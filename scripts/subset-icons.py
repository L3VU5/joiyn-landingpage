"""Build the self-hosted Tabler icon font with only the icons the pages use.

Usage (fonttools and brotli installed, e.g. in a venv):
    npm pack @tabler/icons-webfont@3.49.0 && tar xzf tabler-icons-webfont-3.49.0.tgz
    python3 scripts/subset-icons.py path/to/package

Reads every `ti ti-<name>` class from the HTML files in the repo root, looks
up the code points in the package's tabler-icons.css, writes
assets/fonts/tabler-icons/tabler-icons.<hash>.woff2 (old builds removed) and
assets/css/tabler-icons.css. Run it again after adding an icon to a page.
"""
import hashlib
import json
import re
import sys
from pathlib import Path

from fontTools import subset

ROOT = Path(__file__).resolve().parent.parent
pkg = Path(sys.argv[1])
version = json.loads((pkg / "package.json").read_text())["version"]
css = (pkg / "dist" / "tabler-icons.css").read_text(encoding="utf-8")

used = set()
for page in sorted(ROOT.glob("*.html")):
    used |= set(re.findall(r"\bti-([a-z0-9-]+)", page.read_text(encoding="utf-8")))

codepoints = {}
for name in sorted(used):
    m = re.search(r'\.ti-%s:before\s*\{\s*content:\s*"\\([0-9a-f]+)"' % re.escape(name), css)
    if not m:
        sys.exit("icon not in Tabler %s: ti-%s" % (version, name))
    codepoints[name] = m.group(1)

out_dir = ROOT / "assets" / "fonts" / "tabler-icons"
out_dir.mkdir(parents=True, exist_ok=True)
tmp = out_dir / "build.woff2"
options = subset.Options()
options.flavor = "woff2"
options.layout_features = []
options.name_IDs = ["*"]
font = subset.load_font(str(pkg / "dist" / "fonts" / "tabler-icons.ttf"), options)
subsetter = subset.Subsetter(options)
subsetter.populate(unicodes=[int(cp, 16) for cp in codepoints.values()])
subsetter.subset(font)
subset.save_font(font, str(tmp), options)

digest = hashlib.sha256(tmp.read_bytes()).hexdigest()[:10]
for old in out_dir.glob("tabler-icons.*.woff2"):
    old.unlink()
final = out_dir / ("tabler-icons.%s.woff2" % digest)
tmp.rename(final)
(out_dir / "LICENSE").write_text((pkg / "LICENSE").read_text(encoding="utf-8"), encoding="utf-8")

rules = "\n".join('.ti-%s:before { content: "\\%s"; }' % (n, cp) for n, cp in codepoints.items())
(ROOT / "assets" / "css" / "tabler-icons.css").write_text(
    """/*!
 * Tabler Icons %s by tabler, https://tabler.io (MIT, assets/fonts/tabler-icons/LICENSE)
 * Subset with only the icons these pages use; built by scripts/subset-icons.py.
 */
@font-face {
  font-family: "tabler-icons";
  font-style: normal;
  font-weight: 400;
  font-display: block;
  src: url("../fonts/tabler-icons/%s") format("woff2");
}
.ti {
  font-family: "tabler-icons" !important;
  speak: none;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
%s
""" % (version, final.name, rules),
    encoding="utf-8",
)
print("%d icons -> %s (%d bytes)" % (len(codepoints), final.relative_to(ROOT), final.stat().st_size))
