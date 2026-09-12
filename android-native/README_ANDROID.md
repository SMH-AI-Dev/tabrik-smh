# 📱 ساخت نسخه اندروید — ۳ راه

## راه ۱ (ساده، ۲ دقیقه): نصب به‌عنوان اپ (PWA)
1. پوشه `shared` را روی گوشی کپی کن یا با `python -m http.server` در شبکه محلی سرو کن.
2. در کروم اندروید باز کن → منو ⋮ → **Add to Home screen / نصب برنامه**.
3. آیکون «تبریک‌ساز» روی هوم‌اسکرین می‌آید، تمام‌صفحه و آفلاین (Service Worker).

## راه ۲: WebView (خروجی APK)
1. در اندرویداستودیو پروژه خالی بساز (package: `com.smh.tabrik`).
2. محتویات `shared/` را در `app/src/main/assets/shared/` کپی کن.
3. فایل `MainActivity.kt` همین پوشه را جایگزین کن.
4. بیلد → APK. مجوز لازم: `INTERNET`، `RECORD_AUDIO` (برای ضبط وویس)، `READ_MEDIA_IMAGES`.

## راه ۳: Capacitor (پیشنهادی)
```
npm i -g @capacitor/cli
npx cap init TabrikSMH com.smh.tabrik
# پوشه shared را به عنوان webDir بده، سپس:
npx cap add android
```
