# وب‌سایت علی رضازاده بگلر

سایت استاتیک فارسی و راست‌چین برای معرفی خدمات نقشه‌برداری و GIS، با تمرکز خدمات میدانی در ارومیه و آذربایجان غربی. طراحی مستقل و الهام‌گرفته از ساختار شرکت‌های مهندسی و نقشه‌برداری است؛ از دارایی‌ها یا کد سایت سهند استفاده نمی‌کند.

## ساختار فایل‌ها
- index.html — صفحه اصلی
- request.html — فرم درخواست خدمات و انتخاب موقعیت پروژه
- blog.html — وبلاگ و راهنماهای فنی
- assets/css/style.css — استایل مشترک صفحات و نسخه موبایل
- assets/js/main.js — منوی موبایل و موارد عمومی
- assets/js/request.js — نقشه، انتخاب مختصات و ارسال درخواست فقط از طریق ایمیل
- functions/api/request.js — منطق اعتبارسنجی و ارسال امن درخواست با Resend
- src/index.js — ورودی Worker؛ API را اجرا می‌کند و بقیه درخواست‌ها را به assets می‌سپارد
- wrangler.jsonc — پیکربندی Cloudflare Workers Static Assets
- .assetsignore — جلوگیری از انتشار فایل‌های منبع و تنظیمات به‌عنوان فایل عمومی سایت

## فرم درخواست خدمات و ارسال ایمیل
صفحه request.html از Leaflet و OpenStreetMap برای انتخاب موقعیت پروژه استفاده می‌کند. اطلاعات فرم به مسیر /api/request ارسال می‌شود. Worker سمت‌سرور در src/index.js این مسیر را به functions/api/request.js هدایت می‌کند. ایمیل شامل شرح پروژه، شماره تماس، مختصات و لینک‌های Google Maps و OpenStreetMap است و به alirezazadehbeglar@gmail.com فرستاده می‌شود. ارسال درخواست فقط از طریق ایمیل انجام می‌شود؛ اگر سرویس ایمیل با مشکل مواجه شود، پیام خطا نمایش داده می‌شود و مسیر جایگزینی ارائه نمی‌شود.

### راه‌اندازی ارسال ایمیل
1. یک حساب Resend بسازید و در آن یک دامنه فرستنده را تأیید کنید.
2. در Resend ترجیحاً زیر‌دامنه‌ای مانند send.alirezazade.ir اضافه کنید تا مجبور به تغییر بی‌مورد سیاست‌های ایمیل دامنه اصلی نشوید. رکوردهای دقیق DNS را از Resend بردارید و در Cloudflare اضافه کنید؛ مقادیر را حدس نزنید.
3. پس از انتشار پیکربندی Worker، در Cloudflare به Workers & Pages → site1 → Settings → Variables and Secrets بروید.
4. یک Secret با نام RESEND_API_KEY بسازید و API key ایجادشده در Resend را در آن قرار دهید. این مقدار نباید در HTML، JavaScript مرورگر یا GitHub قرار بگیرد.
5. متغیر CONTACT_TO_EMAIL باید برابر alirezazadehbeglar@gmail.com باشد؛ این مقدار در wrangler.jsonc درج شده است.
6. متغیر CONTACT_FROM_EMAIL را روی requests@send.alirezazade.ir تنظیم کنید. از دامنه فرستنده‌ای استفاده کنید که در Resend واقعاً تأیید شده باشد.
7. مقادیر را برای محیط Production تنظیم کنید و سپس Deploy انجام دهید تا Worker به مقادیر جدید دسترسی داشته باشد.
8. یک درخواست آزمایشی بفرستید، صندوق Inbox و پوشه Spam را بررسی کنید. API ایمیل را از سمت سرور درخواست می‌کند و پاسخ موفق فقط زمانی برمی‌گردد که Resend درخواست را پذیرفته باشد.
9. اگر فرم خطای Resend را نشان داد، به Cloudflare → Workers & Pages → site1 → Observability → Logs بروید و گزارش با شناسه پیگیری نمایش‌داده‌شده را باز کنید. پیام خطای Resend شامل وضعیت HTTP و پاسخ خطا ثبت می‌شود؛ کلید API و اطلاعات کامل فرم در گزارش ثبت نمی‌شوند. بخش Logs/Emails در داشبورد Resend را هم بررسی کنید.

کلید Resend را هرگز داخل HTML/JavaScript عمومی یا GitHub قرار ندهید. فقط به‌عنوان Cloudflare Secret ذخیره‌اش کنید.

## خدمات پهپاد و فتوگرامتری
صفحه اصلی و فرم درخواست خدمات شامل نقشه‌برداری پهپادی، فتوگرامتری بردکوتاه، پردازش تصاویر، ارتوفتو، ابرنقاط و محصولات مدل سه‌بعدی است. امکان اجرا و دقت محصولات به شرایط تصویربرداری، کیفیت داده، برنامه‌ریزی میدانی و بررسی محل بستگی دارد.

## انتشار در Cloudflare Workers از طریق Git
این مخزن برای Workers Static Assets به‌همراه Worker API تنظیم شده است، نه پروژه Pages خالص.

1. در Worker متصل به این ریپازیتوری، Build command می‌تواند خالی بماند؛ Deploy command را روی npx wrangler deploy قرار دهید. پیکربندی از wrangler.jsonc خوانده می‌شود.
2. مهم: مقدار name در wrangler.jsonc برابر site1 تنظیم شده است تا با Worker موجود هماهنگ باشد.
3. فایل اصلی src/index.js است و assets directory روی ریشه مخزن (.) قرار دارد.
4. Worker مسیر /api/* را قبل از static asset routing اجرا می‌کند و بقیه درخواست‌ها را از binding به نام ASSETS به فایل‌های استاتیک می‌سپارد.
5. پس از شناسایی پیکربندی Wrangler و انتشار مجدد، Runtime Variables and Secrets را در تنظیمات Worker اضافه کنید.

## اتصال دامنه alirezazade.ir
1. در داشبورد Cloudflare به پروژه Worker بروید و Settings → Domains & Routes یا بخش Custom Domains را باز کنید.
2. دامنه alirezazade.ir را به‌عنوان Custom Domain به Worker متصل کنید. اگر از شما خواسته شد، Zone دامنه باید در همان حساب Cloudflare فعال باشد.
3. اگر لازم است Nameserverها را تغییر دهید، ابتدا رکوردهای فعلی را مستند کنید؛ به‌خصوص MX/TXT مربوط به ایمیل را بدون بررسی حذف نکنید.
4. پس از فعال‌شدن گواهی TLS، https://alirezazade.ir و فرم درخواست خدمات را آزمایش کنید.

مستندات رسمی:
- Workers Static Assets: https://developers.cloudflare.com/workers/static-assets/
- Bindings & Variables: https://developers.cloudflare.com/workers/configuration/environment-variables/
- Resend API: https://resend.com/docs/api-reference/emails/send-email
