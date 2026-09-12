# 🚀 انتشار و بیلد «تبریک‌ساز SMH» — همه سیستم‌عامل‌ها

## بیلد خودکار (GitHub Actions) — پیشنهادی ✅
هر پوش به `main` → ورک‌فلو `.github/workflows/build.yml` می‌سازد:
| خروجی | فایل |
|---|---|
| 🪟 Windows Portable | `Tabrik-SMH-Portable.exe` |
| 🐧 Linux | `Tabrik-SMH.AppImage` |
| 📱 Android (debug) | `app-debug.apk` |
| 🌐 PWA وب | پوشه `shared/` (قابل هاست) |
از صفحه **Actions → Artifacts** دانلود کن. نسخه Release اندروید نیاز به Keystore دارد (راهنما پایین).

## بیلد دستی ویندوز
```
cd windows
npm install
npm run dist:win    # خروجی: windows/dist/Tabrik-SMH-Portable.exe
```
بدون npm هم: `Tabrik-SMH.bat` (اجرا با پایتون، بدون نصب).

## بیلد دستی اندروید (Release امضاشده)
```
# ۱) ساخت keystore (یک‌بار):
keytool -genkey -v -keystore smh.keystore -alias smh -keyalg RSA -keysize 2048 -validity 10000
# ۲) در capacitor-setup مسیر keystore را بده، بعد:
cd android-app && npx cap sync android
cd android && gradlew assembleRelease
```

## انتشار در مارکت‌های ایرانی
1. **کافه‌بازار:** پنل توسعه‌دهنده → اپ جدید → APK امضاشده + آیکون ۵۱۲ + ۲ اسکرین‌شات + دسته «شخصی‌سازی/سرگرمی» → تعریف IAP برای ۳ پلن → انتشار (بررسی ~۱-۳ روز)
2. **مایکت:** مشابه بازار؛ رقابت کم‌تر، شانس دیده‌شدن بیشتر
3. نام فارسی پیشنهادی: «تبریک‌ساز SMH | کارت تبریک دیجیتال» + توضیح شامل کلمات: کارت تبریک، تولد، نوروز، عکس‌نوشته، کلیپ تولد
