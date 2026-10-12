# وب‌سایت علی رضازاده بگلر

سایت استاتیک فارسی و راست‌چین برای معرفی خدمات نقشه‌برداری و GIS، با تمرکز خدمات میدانی در ارومیه و آذربایجان غربی. طراحی مستقل و الهام‌گرفته از ساختار شرکت‌های مهندسی و نقشه‌برداری است؛ از دارایی‌ها یا کد سایت سهند استفاده نمی‌کند.

## ساختار فایل‌ها
- index.html — صفحه اصلی
- request.html — فرم درخواست خدمات و انتخاب مختصات پروژه روی نقشه
- blog.html — وبلاگ و راهنماهای فنی
- assets/css/style.css — استایل مشترک صفحات و نسخه موبایل
- assets/js/main.js — منوی موبایل و موارد عمومی
- assets/js/request.js — نقشه، انتخاب مختصات و آماده‌سازی پیام واتساپ

## فرم درخواست خدمات و موقعیت
نقشه از Leaflet و OpenStreetMap استفاده می‌کند. بازدیدکننده می‌تواند نقطه پروژه را با کلیک روی نقشه، جابه‌جایی نشانگر یا اجازه موقعیت دستگاه مشخص کند. هنگام ارسال، پیام شامل مشخصات فرم، عرض و طول جغرافیایی و لینک Google Maps و OpenStreetMap در واتساپ برای شماره +989140884403 آماده می‌شود. کاربر باید ارسال پیام را در واتساپ نهایی کند؛ فرم اطلاعات را در پس‌زمینه و بدون اطلاع بازدیدکننده ارسال نمی‌کند.

## پیش از انتشار
- لینک اینستاگرام در صفحه اصلی روی https://www.instagram.com/surveying_rzzde/ تنظیم شده است.
- تصاویر از Unsplash بارگذاری می‌شوند؛ برای تعویض یا میزبانی محلی تصاویر، URLهای داخل HTML و CSS را تغییر دهید.
- فونت اصلی فارسی Vazirmatn است و برای شرایط عدم دسترسی به فونت آنلاین، فونت‌های رایج فارسی و Tahoma در fallback هستند.

## اتصال به Cloudflare Pages از طریق GitHub
1. وارد https://dash.cloudflare.com/ شوید و اکانت درست Cloudflare را انتخاب کنید.
2. از بخش Workers & Pages گزینه Create application و سپس Pages را انتخاب کنید؛ Connect to Git را بزنید.
3. در صورت درخواست، GitHub را وصل و دسترسی Cloudflare را به ریپازیتوری alirezazadehbeglar-bit/site بدهید.
4. مخزن site و شاخه main را انتخاب کنید.
5. برای پروژه بدون فریم‌ورک (static HTML) تنظیمات را وارد کنید:
   - Framework preset: None
   - Production branch: main
   - Build command: خالی بگذارید یا طبق مستندات Pages مقدار exit 0 را وارد کنید.
   - Build output directory: . (نقطه؛ چون index.html در ریشه است)
   - Root directory: خالی، یعنی ریشه مخزن.
6. Save and Deploy را بزنید. پس از اتمام Deploy، آدرس آزمایشی با پسوند pages.dev نشان داده می‌شود. آن را روی موبایل و دسکتاپ آزمایش کنید.
7. برای دامنه اصلی، دامنه alirezade.ir باید در همان اکانت Cloudflare به‌عنوان Zone اضافه شده باشد. اگر DNS از جای دیگری مدیریت می‌شود و دامنه apex است، Nameserverهای دامنه را نزد ثبت‌کننده به Nameserverهای Cloudflare تغییر دهید و صبر کنید تا وضعیت Zone فعال شود. پیش از تغییر، رکوردهای DNS فعلی (به‌خصوص ایمیل) را یادداشت و رکوردهای لازم را حفظ کنید.
8. سپس به Workers & Pages → پروژه Pages → Custom domains → Set up a domain بروید؛ alirezade.ir را وارد کنید و مراحل را انجام دهید. در صورت تمایل www.alirezade.ir را هم اضافه کنید و برای هدایت www به دامنه اصلی یک redirect تنظیم کنید.
9. برای دامنه apex، اتصال دامنه را از صفحه Custom domains انجام دهید؛ صرفاً ساختن CNAME دستی بدون اضافه‌کردن دامنه در Pages کافی نیست. پس از فعال‌شدن DNS و TLS، https://alirezade.ir را آزمایش کنید.
10. با هر commit روی main، Pages به‌صورت خودکار سایت را دوباره Deploy می‌کند.

مستندات رسمی:
- Static HTML: https://developers.cloudflare.com/pages/framework-guides/deploy-anything/
- اتصال Git: https://developers.cloudflare.com/pages/configuration/git-integration/
- دامنه‌های سفارشی: https://developers.cloudflare.com/pages/configuration/custom-domains/
