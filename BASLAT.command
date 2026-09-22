#!/bin/zsh
# Çimko İK Platformu — çift tıklayınca sunucuyu başlatır (http://localhost:3000)
# NOT: Proje iCloud senkronu DIŞINDA, yerel diskte tutulur: ~/cimko-platform
cd "$HOME/cimko-platform" || { echo "Proje klasörü bulunamadı: ~/cimko-platform"; read; exit 1; }

export NEXT_TELEMETRY_DISABLED=1

# Zaten çalışıyorsa yeniden başlatma, sadece tarayıcıyı aç
if curl -s --max-time 3 -o /dev/null http://localhost:3000/ 2>/dev/null; then
  echo "Sunucu zaten çalışıyor. Tarayıcı açılıyor..."
  open "http://localhost:3000"
  exit 0
fi

# Derleme yoksa önce hazırla
if [ ! -f ".next/BUILD_ID" ]; then
  echo "İlk kurulum yapılıyor, lütfen bekleyin (birkaç dakika sürebilir)..."
  [ -d node_modules ] || npm install
  npm run build || { echo "Derleme başarısız oldu."; read; exit 1; }
fi

echo "Çimko İK Platformu başlatılıyor..."
echo "Hazır olduğunda tarayıcı otomatik açılacak."
echo "Durdurmak için bu pencerede Ctrl+C yapın."

# Sunucu ayağa kalkınca tarayıcıyı aç
( for i in {1..60}; do
    if curl -s --max-time 2 -o /dev/null http://localhost:3000/ 2>/dev/null; then
      open "http://localhost:3000"; break
    fi
    sleep 2
  done ) &

npm start
