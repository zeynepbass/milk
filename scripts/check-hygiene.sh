#!/bin/sh
set -u

status=0

report() {
  if [ -n "$2" ]; then
    printf '%s\n%s\n\n' "$1" "$2"
    status=1
  fi
}

search_files() {
  pattern=$1
  shift
  git ls-files -z --cached --others --exclude-standard -- "$@" | xargs -0 grep -nIE "$pattern" 2>/dev/null || true
}

source_files() {
  git ls-files --cached --others --exclude-standard -- '*.js' '*.jsx' '*.mjs' '*.cjs' | grep -v '^scripts/'
}

report "TypeScript dosyası bulundu:" "$(git ls-files --cached --others --exclude-standard -- '*.ts' '*.tsx')"

report "typescript bağımlılığı bulundu:" "$(search_files '"typescript"' '*package.json')"

report "console kullanımı bulundu:" "$(source_files | tr '\n' '\0' | xargs -0 grep -n 'console\.' 2>/dev/null || true)"

report "Yorum satırı bulundu:" "$(source_files | tr '\n' '\0' | xargs -0 grep -nE '^[[:space:]]*(//|/\*)|\{/\*' 2>/dev/null || true)"

report "Asistan izi bulundu:" "$(git ls-files -z --cached --others --exclude-standard | grep -zv -e '^scripts/check-hygiene.sh$' -e 'package-lock.json$' -e '^.gitignore$' -e '^commitlint.config.js$' | xargs -0 grep -nIiE 'co-authored-by|generated with|claude|chatgpt|copilot|\bAI\b' 2>/dev/null || true)"

report "Commit mesajlarında asistan izi bulundu:" "$(git log --format='%h %s%n%b' | grep -iE 'co-authored-by|generated with|claude' || true)"

report "Asistan dosyası repoda:" "$(git ls-files --cached --others --exclude-standard | grep -E '(^|/)(CLAUDE\.md|AGENTS\.md|\.claude/)' || true)"

exit $status
