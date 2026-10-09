
set -euo pipefail

cd backend
python -m scripts.reset_db
python -m scripts.seed_db
