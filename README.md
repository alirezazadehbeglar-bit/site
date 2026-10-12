# وب‌سایت علی رضازاده بگلر

سایت استاتیک فارسی و راست‌چین برای معرفی خدمات نقشه‌برداری و GIS، با تمرکز خدمات میدانی در ارومیه و آذربایجان غربی. طراحی مستقل و الهام‌گرفته از ساختار شرکت‌های مهندسی و نقشه‌برداری است؛ از دارایی‌ها یا کد سایت سهند استفاده نمی‌کند.

## ساختار فایل‌ها
- index.html — صفحه اصلی
- request.html — فرم درخواست خدمات و انتخاب مختصات پروژه روی نقشه
- blog.html — وبلاگ و راهنماهای فنی
- assets/css/style.css — استایل مشترک صفحات و نسخه موبایل
- assets/js/main.js — منوی موبایل و موارد عمومی
- assets/js/request.js — نقشه، انتخاب مختصات و ارسال درخواست ایمیلی با جایگزین واتساپ
- functions/api/request.js — API سمت سرور برای ارسال ایمیل از طریق Resend

## فرم درخواست خدمات و ارسال ایمیل
صفحه request.html از Leaflet و OpenStreetMap برای انتخاب موقعیت پروژه استفاده می‌کند. اطلاعات فرم به مسیر /api/request فرستاده می‌شود که با Cloudflare Pages Function در functions/api/request.js پردازش می‌شود. ایمیل شامل شرح پروژه، شماره تماس، مختصات و لینک‌های Google Maps و OpenStreetMap است و به alirezazadehbeglar@gmail.com فرستاده می‌شود. اگر سرویس ایمیل با مشکل مواجه شود، فرم لینک جایگزین واتساپ را نشان می‌دهد.

### راه‌اندازی ارسال ایمیل
1. یک حساب Resend بسازید و در آن یک دامنه فرستنده را تأیید کنید.
2. پیشنهاد می‌شود در Resend زیر‌دامنه‌ای مانند send.alirezade.ir بسازید تا رکوردهای SPF/DMARC موجود دامنه اصلی بی‌دلیل تغییر نکنند. رکوردهای DNS دقیق را از Resend بردارید و در Cloudflare اضافه کنید؛ مقادیر را حدس نزنید.
3. در Cloudflare به Workers & Pages → پروژه Pages → Settings → Variables and Secrets بروید.
4. یک Secret با نام RESEND_API_KEY بسازید و API key ایجادشده در Resend را در آن قرار دهید.
5. یک variable معمولی با نام CONTACT_FROM_EMAIL بسازید؛ مقدار نمونه پس از تأیید دامنه فرستنده: Ali RezaZadeh Beglar <requests@send.alirezade.ir>. باید از دامنه تأییدشده خودتان استفاده کنید.
6. این مقادیر را برای Production تنظیم کنید؛ اگر می‌خواهید Preview Deployments هم فرم را آزمایش کنند، برای محیط Preview نیز جداگانه تنظیمشان کنید.
7. سپس از Deployments آخرین استقرار را Retry کنید یا یک commit جدید به main بفرستید تا Pages Function با secrets جدید منتشر شود.
8. با یک درخواست آزمایشی، ایمیل مقصد را بررسی کنید و پوشه Spam را هم ببینید. موفقیت API به معنی پذیرش توسط سرویس ارسال است؛ تحویل نهایی ممکن است به اعتبار دامنه، DNS و فیلترهای ایمیل بستگی داشته باشد.

کلید Resend را هرگز داخل HTML/JavaScript عمومی یا GitHub قرار ندهید. فقط به‌عنوان Cloudflare Secret ذخیره‌اش کنید.

## خدمات پهپاد و فتوگرامتری
صفحه اصلی و فرم درخواست خدمات شامل نقشه‌برداری پهپادی، فتوگرامتری بردکوتاه، پردازش تصاویر، ارتوفتو، ابرنقاط و محصولات مدل سه‌بعدی است. امکان اجرا و دقت محصولات به شرایط تصویربرداری، کیفیت داده، برنامه‌ریزی میدانی و بررسی محل بستگی دارد.

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
