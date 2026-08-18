"""
Subsets the three variable fonts to the characters this site actually uses.

Why this is a manual step and not part of `npm run build`: CI installs npm
packages only, and this needs Python with fontTools. The subset .woff2 files are
therefore committed under src/fonts/ and the build just bundles them.

Re-run after adding copy that introduces a new character:

    pip install fonttools brotli
    npm run build              # so dist/ reflects current content
    python scripts/subset-fonts.py

It reads every rendered page in dist/, collects the characters actually shown,
and reports anything a font cannot supply. The kept set is deliberately wider
than what is rendered today — printable ASCII plus the accented Latin letters a
European name or loanword is likely to need — so ordinary copy edits do not
silently produce tofu. Anything outside it will, which is what the report at the
end is for.

Variable axes are preserved: the weight axis is what the design uses, so the
subsetter is never asked to instance the font to a single weight.
"""

import glob
import io
import os
import re
import subprocess
import sys

sys.stdout.reconfigure(encoding="utf-8")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "node_modules", "@fontsource-variable")
OUT = os.path.join(ROOT, "src", "fonts")

FONTS = [
    ("space-grotesk", os.path.join("space-grotesk", "files", "space-grotesk-latin-wght-normal.woff2")),
    ("inter", os.path.join("inter", "files", "inter-latin-wght-normal.woff2")),
    ("jetbrains-mono", os.path.join("jetbrains-mono", "files", "jetbrains-mono-latin-wght-normal.woff2")),
]

# Printable ASCII: the floor. Everything the site says is built from these.
ASCII = "".join(chr(c) for c in range(0x20, 0x7F))

# Accented Latin. Not used by the current copy beyond "résumé", but a portfolio
# names people and studios, and a missing diacritic is a visible defect.
ACCENTED = (
    "ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÑÒÓÔÕÖØÙÚÛÜÝß"
    "àáâãäåæçèéêëìíîïñòóôõöøùúûüýÿ"
    "ŁłŠšŽžŒœ"
)

# Punctuation and symbols the design uses: em dash, curly quotes, middot,
# multiplication sign, degree, plus-minus, arrows, minus, ellipsis, currency.
SYMBOLS = "©°±·×–—‘’“”…→←↑↓↗↘−€£™"

KEEP = ASCII + ACCENTED + SYMBOLS


def rendered_chars():
    """Every printable character the built site puts on screen."""
    chars = set()
    for path in glob.glob(os.path.join(ROOT, "dist", "**", "*.html"), recursive=True):
        html = io.open(path, encoding="utf-8").read()
        html = re.sub(r"<script[\s\S]*?</script>", " ", html)
        html = re.sub(r"<style[\s\S]*?</style>", " ", html)
        text = re.sub(r"<[^>]+>", " ", html)
        for entity, literal in (
            ("&amp;", "&"), ("&lt;", "<"), ("&gt;", ">"), ("&quot;", '"'),
            ("&#39;", "'"), ("&#x27;", "'"), ("&nbsp;", " "),
        ):
            text = text.replace(entity, literal)
        chars |= set(text)
    return {c for c in chars if c.isprintable() and not c.isspace()}


def subset(src, dest, keep):
    unicodes = ",".join("U+%04X" % ord(c) for c in sorted(set(keep)))
    result = subprocess.run(
        [
            sys.executable, "-m", "fontTools.subset", src,
            "--unicodes=" + unicodes,
            "--flavor=woff2",
            "--layout-features=*",
            "--no-hinting",
            "--desubroutinize",
            "--output-file=" + dest,
        ],
        capture_output=True,
        text=True,
    )
    if result.returncode != 0:
        raise SystemExit("subsetting %s failed:\n%s" % (src, result.stderr))


def main():
    os.makedirs(OUT, exist_ok=True)
    used = rendered_chars()
    print("characters rendered by the built site: %d" % len(used))

    outside = sorted(c for c in used if c not in KEEP)
    if outside:
        print("\n!! rendered but NOT in the kept set - these will fall back:")
        print("   " + " ".join("U+%04X %s" % (ord(c), c) for c in outside))
        print("   add them to SYMBOLS in this script and re-run.\n")

    from fontTools.ttLib import TTFont

    before = after = 0
    for name, rel in FONTS:
        src = os.path.join(SRC, rel)
        dest = os.path.join(OUT, "%s-subset.woff2" % name)
        subset(src, dest, KEEP)

        b, a = os.path.getsize(src), os.path.getsize(dest)
        before, after = before + b, after + a

        font = TTFont(dest, lazy=True)
        axes = ",".join(
            "%s %g-%g" % (ax.axisTag, ax.minValue, ax.maxValue)
            for ax in font["fvar"].axes
        ) if "fvar" in font else "NONE - variable axes lost!"
        cmap = font.getBestCmap()
        missing = [c for c in used if ord(c) not in cmap]

        print("%-15s %6d -> %6d B  (%3d%%)  axes: %s" % (name, b, a, round(100 * a / b), axes))
        if missing:
            print("     cannot render: " + " ".join("U+%04X" % ord(c) for c in sorted(missing)))

    print("\ntotal %d -> %d bytes  (saves %d)" % (before, after, before - after))


if __name__ == "__main__":
    main()
