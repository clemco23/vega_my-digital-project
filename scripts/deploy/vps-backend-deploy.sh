#!/usr/bin/env bash

set -euo pipefail

: "${APP_DIR:?APP_DIR is required}"

cd "${APP_DIR}/backend"

npm ci --omit=dev
npm run prisma:generate
npm run prisma:migrate:deploy

if [[ -n "${RESTART_COMMAND:-}" ]]; then
  eval "${RESTART_COMMAND}"
else
  echo "No RESTART_COMMAND provided. Backend restart skipped."
fi
