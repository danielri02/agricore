#! /bin/bash
set -euo pipefail

cd backend
if [[ ! -d ".venv" ]]; then
    python -m venv .venv
fi

python -m pip install -r requirements.txt
cd ..

cd frontend
bun install
cd ..



