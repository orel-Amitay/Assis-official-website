#!/usr/bin/env bash
# Regenerate the downloadable PDF from the live Next.js print page
# so it matches /PoweredByAssis exactly.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PDF_DOCS="$ROOT/docs/onboarding/What-you-now-have-with-Assis.pdf"
PDF_PUBLIC="$ROOT/public/docs/What-you-now-have-with-Assis.pdf"
URL="${1:-http://localhost:3000/PoweredByAssis/print}"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

mkdir -p "$(dirname "$PDF_DOCS")" "$(dirname "$PDF_PUBLIC")"

"$CHROME" \
  --headless=new \
  --disable-gpu \
  --no-pdf-header-footer \
  --virtual-time-budget=8000 \
  --print-to-pdf="$PDF_DOCS" \
  "$URL"

cp "$PDF_DOCS" "$PDF_PUBLIC"
echo "Wrote $PDF_DOCS"
echo "Copied $PDF_PUBLIC"
