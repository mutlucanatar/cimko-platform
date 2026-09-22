# Cimko Platform - Repair Package

Bu paket, orijinal ZIP'teki Prisma veri modelini ve demo veritabanini koruyarak eksik Next.js App Router kaynaklarini yeniden baslatmak icin hazirlanmistir.

## StackBlitz / local
1. npm install
2. npx prisma db push
3. npm run dev
4. http://localhost:3000

## Not
Bu paket tam urun implementasyonu degildir. Mevcut belgelerde tanimlanan MVP icin calisan bir iskelet, veritabani baglantisi ve temel liste ekranlari saglar. Orijinal kayip frontend/backend kodlari ZIP'te mevcut olmadigi icin bu ekranlar kaynak belgeler esas alinarak yeniden olusturulmustur.

## Prisma
- schema.prisma -> prisma/schema.prisma
- seed.ts -> prisma/seed.ts
- dev.db -> prisma/dev.db
