#!/bin/bash
set -e

echo "=== إعداد متجر لمسة ==="
echo ""
read -sp "الصق الباسورد بتاع قاعدة بيانات Supabase واضغط Enter: " DBPASS
echo ""

SECRET=$(openssl rand -base64 32)

cat > .env << ENV
DATABASE_URL="postgresql://postgres.xmumrtzmqdomrwoukysi:${DBPASS}@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xmumrtzmqdomrwoukysi:${DBPASS}@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"
NEXTAUTH_SECRET="${SECRET}"
NEXTAUTH_URL="http://localhost:3000"
ENV

echo "تم إنشاء ملف .env ✅"
echo ""
echo "بنثبت المكتبات..."
npm install --legacy-peer-deps

echo ""
echo "بنبني الجداول على قاعدة البيانات..."
npx prisma db push

echo ""
echo "بنزرع بيانات تجريبية وحساب الأدمن..."
npm run db:seed

echo ""
echo "=== خلصنا! ==="
echo "شغّل الأمر ده دلوقتي عشان تشوف الموقع:"
echo "npm run dev"
echo ""
echo "هتدخل على الداش بورد بالبيانات دي:"
echo "رقم الموبايل: 01000000000"
echo "كلمة السر: admin123456"
