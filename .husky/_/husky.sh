#!/bin/sh
# shellcheck disable=SC2086,SC2048

export npm_config_yes=true
export PNPM_HOME="${PNPM_HOME:-$HOME/.local/share/pnpm}"
command -v pnpm >/dev/null 2>&1 || {
  echo "pnpm not found, skipping hook" >&2
  exit 0
}

exec pnpm "$@"
