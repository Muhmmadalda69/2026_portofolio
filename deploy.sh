echo "pull code ..."
git pull origin main

echo "up container ..."
docker compose down
docker compose up -d --build

echo "deploy berhasil"
