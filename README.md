# وب‌سایت علی رضازاده بگلر

سایت استاتیک فارسی و راست‌چین برای معرفی خدمات نقشه‌برداری و GIS، با تمرکز خدمات میدانی در ارومیه و آذربایجان غربی. طراحی مستقل و الهام‌گرفته از ساختار شرکت‌های مهندسی و نقشه‌برداری است؛ از دارایی‌ها یا کد سایت سهند استفاده نمی‌کند.

## ساختار فایل‌ها
- index.html — صفحه اصلی
- request.html — فرم درخواست خدمات و انتخاب موقعیت پروژه
- blog.html — وبلاگ و راهنماهای فنی
- assets/css/style.css — استایل مشترک صفحات و نسخه موبایل
- assets/js/main.js — منوی موبایل و موارد عمومی
- assets/js/request.js — نقشه، انتخاب مختصات، ارسال ایمیل و جایگزین واتساپ
- functions/api/request.js — منطق اعتبارسنجی و ارسال امن درخواست با Resend
- src/index.js — ورودی Worker؛ API را اجرا می‌کند و بقیه درخواست‌ها را به assets می‌سپارد
- wrangler.jsonc — پیکربندی Cloudflare Workers Static Assets
- .assetsignore — جلوگیری از انتشار فایل‌های منبع و تنظیمات به‌عنوان فایل عمومی سایت

## فرم درخواست خدمات و ارسال ایمیل
صفحه request.html از Leaflet و OpenStreetMap برای انتخاب موقعیت پروژه استفاده می‌کند. اطلاعات فرم به مسیر /api/request ارسال می‌شود. Worker سمت‌سرور در src/index.js این مسیر را به functions/api/request.js هدایت می‌کند. ایمیل شامل شرح پروژه، شماره تماس، مختصات و لینک‌های Google Maps و OpenStreetMap است و به alirezazadehbeglar@gmail.com فرستاده می‌شود. اگر سرویس ایمیل با مشکل مواجه شود، فرم لینک جایگزین واتساپ را نشان می‌دهد.

### راه‌اندازی ارسال ایمیل
1. یک حساب Resend بسازید و در آن یک دامنه فرستنده را تأیید کنید.
2. در Resend ترجیحاً زیر‌دامنه‌ای مانند send.alirezade.ir اضافه کنید تا مجبور به تغییر بی‌مورد سیاست‌های ایمیل دامنه اصلی نشوید. رکوردهای دقیق DNS را از Resend بردارید و در Cloudflare اضافه کنید؛ مقادیر را حدس نزنید.
3. پس از انتشار پیکربندی Worker، در Cloudflare به Workers & Pages → alirezade-site → Settings → Variables and Secrets بروید.
4. یک Secret با نام RESEND_API_KEY بسازید و API key ایجادشده در Resend را در آن قرار دهید. این مقدار نباید در HTML، JavaScript مرورگر یا GitHub قرار بگیرد.
5. یک variable با نام CONTACT_FROM_EMAIL بسازید؛ مقدار نمونه بعد از تأیید دامنه فرستنده: Ali RezaZadeh Beglar <requests@send.alirezade.ir>. از دامنه فرستنده‌ای استفاده کنید که در Resend واقعاً تأیید شده باشد.
6. مقادیر را برای محیط Production تنظیم کنید و سپس Deploy انجام دهید تا Worker به مقادیر جدید دسترسی داشته باشد.
7. یک درخواست آزمایشی بفرستید، صندوق Inbox و پوشه Spam را بررسی کنید. API ایمیل را از سمت سرور درخواست می‌کند و پاسخ موفق فقط زمانی برمی‌گردد که Resend درخواست را پذیرفته باشد.

کلید Resend را هرگز داخل HTML/JavaScript عمومی یا GitHub قرار ندهید. فقط به‌عنوان Cloudflare Secret ذخیره‌اش کنید.

## خدمات پهپاد و فتوگرامتری
صفحه اصلی و فرم درخواست خدمات شامل نقشه‌برداری پهپادی، فتوگرامتری بردکوتاه، پردازش تصاویر، ارتوفتو، ابرنقاط و محصولات مدل سه‌بعدی است. امکان اجرا و دقت محصولات به شرایط تصویربرداری، کیفیت داده، برنامه‌ریزی میدانی و بررسی محل بستگی دارد.

## انتشار در Cloudflare Workers از طریق Git
این مخزن برای Workers Static Assets به‌همراه Worker API تنظیم شده است، نه پروژه Pages خالص.

1. در Worker متصل به این ریپازیتوری، Build command می‌تواند خالی بماند؛ Deploy command را روی npx wrangler deploy قرار دهید. پیکربندی از wrangler.jsonc خوانده می‌شود.
2. فایل اصلی src/index.js است و assets directory روی ریشه مخزن (.) قرار دارد.
3. Worker مسیر /api/* را قبل از static asset routing اجرا می‌کند و بقیه درخواست‌ها را از binding به نام ASSETS به فایل‌های استاتیک می‌سپارد.
4. پس از شناسایی پیکربندی Wrangler و انتشار مجدد، Runtime Variables and Secrets را در تنظیمات Worker اضافه کنید.

## اتصال دامنه alirezade.ir
1. در داشبورد Cloudflare به پروژه Worker بروید و Settings → Domains & Routes یا بخش Custom Domains را باز کنید.
2. دامنه alirezade.ir را به‌عنوان Custom Domain به Worker متصل کنید. اگر از شما خواسته شد، Zone دامنه باید در همان حساب Cloudflare فعال باشد.
3. اگر لازم است Nameserverها را تغییر دهید، ابتدا رکوردهای فعلی را مستند کنید؛ به‌خصوص MX/TXT مربوط به ایمیل را بدون بررسی حذف نکنید.
4. پس از فعال‌شدن گواهی TLS، https://alirezade.ir و فرم درخواست خدمات را آزمایش کنید.

مستندات رسمی:
- Workers Static Assets: https://developers.cloudflare.com/workers/static-assets/
- Bindings & Variables: https://developers.cloudflare.com/workers/configuration/environment-variables/
- Resend API: https://resend.com/docs/api-reference/emails/send-email
