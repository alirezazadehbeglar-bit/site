const RECIPIENT = "alirezazadehbeglar@gmail.com";
const MAX_BODY_BYTES = 24000;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function clean(value, maxLength = 3000) {
  if (typeof value !== "string") return "";
  return value
    .replace(/\r/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim()
    .slice(0, maxLength);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function validEmail(value) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function validCoordinate(lat, lng) {
  return Number.isFinite(lat) && Number.isFinite(lng) &&
    lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return json({ ok: false, message: "برای ارسال درخواست از فرم سایت استفاده کنید." }, 405);
  }

  const requestUrl = new URL(request.url);
  const origin = request.headers.get("Origin");
  if (!origin || origin !== requestUrl.origin) {
    return json({ ok: false, message: "مبدأ درخواست معتبر نیست. صفحه را دوباره باز کنید." }, 403);
  }

  if (!(request.headers.get("Content-Type") || "").toLowerCase().includes("application/json")) {
    return json({ ok: false, message: "فرمت درخواست پشتیبانی نمی‌شود." }, 415);
  }

  const contentLength = Number(request.headers.get("Content-Length") || "0");
  if (contentLength > MAX_BODY_BYTES) {
    return json({ ok: false, message: "حجم درخواست بیش از حد مجاز است." }, 413);
  }

  let rawBody;
  try {
    rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return json({ ok: false, message: "حجم درخواست بیش از حد مجاز است." }, 413);
    }
  } catch {
    return json({ ok: false, message: "بدنه درخواست خوانده نشد." }, 400);
  }

  let body;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return json({ ok: false, message: "اطلاعات فرم معتبر نیست." }, 400);
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json({ ok: false, message: "اطلاعات فرم معتبر نیست." }, 400);
  }

  if (clean(body.company, 200)) {
    return json({ ok: true, message: "درخواست دریافت شد." });
  }

  const name = clean(body.name, 100);
  const phone = clean(body.phone, 30);
  const service = clean(body.service, 160);
  const timing = clean(body.timing, 80) || "قابل هماهنگی";
  const address = clean(body.address, 250) || "ذکر نشده";
  const description = clean(body.description, 3000);
  const email = clean(body.email, 254);
  const page = clean(body.page, 160) || requestUrl.origin;

  if (!name || !phone || !service || !description) {
    return json({ ok: false, message: "لطفاً نام، شماره تماس، نوع خدمت و توضیحات پروژه را کامل کنید." }, 400);
  }
  if (!/^[0-9+\s()\-]{7,30}$/.test(phone)) {
    return json({ ok: false, message: "شماره تماس را بررسی کنید." }, 400);
  }
  if (email && !validEmail(email)) {
    return json({ ok: false, message: "آدرس ایمیل واردشده معتبر نیست." }, 400);
  }

  let location = null;
  if (body.location && typeof body.location === "object") {
    const lat = Number(body.location.lat);
    const lng = Number(body.location.lng);
    if (validCoordinate(lat, lng)) location = { lat, lng };
  }

  const apiKey = typeof env.RESEND_API_KEY === "string" ? env.RESEND_API_KEY.trim() : "";
  const from = typeof env.CONTACT_FROM_EMAIL === "string" ? env.CONTACT_FROM_EMAIL.trim() : "";

  if (!apiKey || !from) {
    return json({
      ok: false,
      code: "email_not_configured",
      message: "ارسال ایمیل هنوز پیکربندی نشده است. مدیر سایت باید کلید Resend و آدرس فرستنده تأییدشده را در تنظیمات Cloudflare ثبت کند.",
    }, 503);
  }

  const requestId = crypto.randomUUID();
  const fields = [
    ["نام و نام خانوادگی", name],
    ["شماره تماس", phone],
    ["نوع خدمت", service],
    ["زمان‌بندی", timing],
    ["نشانی یا محدوده", address],
    ["توضیحات پروژه", description],
    ["ایمیل یا راه ارتباطی", email || "ذکر نشده"],
    ["محدوده خدمات میدانی", "ارومیه و آذربایجان غربی"],
    ["صفحه ارسال درخواست", page],
    ["شناسه درخواست", requestId],
  ];

  if (location) {
    const lat = location.lat.toFixed(6);
    const lng = location.lng.toFixed(6);
    fields.push(
      ["عرض جغرافیایی (Latitude)", lat],
      ["طول جغرافیایی (Longitude)", lng],
      ["Google Maps", "https://www.google.com/maps?q=" + lat + "," + lng],
      ["OpenStreetMap", "https://www.openstreetmap.org/?mlat=" + lat + "&mlon=" + lng + "#map=17/" + lat + "/" + lng],
    );
  } else {
    fields.push(["موقعیت پروژه", "در فرم انتخاب نشده است"]);
  }

  const subjectName = name.replace(/[\r\n]+/g, " ").slice(0, 80);
  const subject = "درخواست جدید سایت | " + service + " | " + subjectName;
  const textBody = fields.map(function(field) { return field[0] + ": " + field[1]; }).join("\n\n");
  const rows = fields.map(function(field) {
    const label = field[0];
    const value = field[1];
    const safeLabel = escapeHtml(label);
    const safeValue = escapeHtml(value).replace(/\n/g, "<br>");
    let displayValue = safeValue;
    if (label === "Google Maps" || label === "OpenStreetMap") {
      displayValue = '<a href="' + safeValue + '" rel="noopener noreferrer">' + safeValue + "</a>";
    }
    return '<tr><th align="right" style="background:#edf3f5;border:1px solid #dbe4e8;width:34%;vertical-align:top">' +
      safeLabel + '</th><td style="border:1px solid #dbe4e8;vertical-align:top">' + displayValue + "</td></tr>";
  }).join("");

  const htmlBody = '<div dir="rtl" style="font-family:Tahoma,Arial,sans-serif;line-height:1.9;color:#20313a">' +
    '<h2 style="color:#142d3b">درخواست جدید خدمات سایت</h2>' +
    "<p>یک درخواست جدید از وب‌سایت علی رضازاده بگلر ثبت شده است.</p>" +
    '<table cellpadding="8" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:760px">' +
    rows + "</table></div>";

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json",
        "Idempotency-Key": requestId,
      },
      body: JSON.stringify({
        from: from,
        to: [RECIPIENT],
        subject: subject,
        html: htmlBody,
        text: textBody,
        ...(email ? { reply_to: email } : {}),
      }),
    });

    if (!response.ok) {
      return json({
        ok: false,
        code: "email_provider_error",
        message: "سرویس ایمیل درخواست را نپذیرفت. فرستنده تأییدشده و تنظیمات Resend را بررسی کنید و دوباره تلاش کنید.",
      }, 502);
    }
  } catch {
    return json({
      ok: false,
      code: "email_provider_unreachable",
      message: "ارتباط با سرویس ارسال ایمیل برقرار نشد. لطفاً تنظیمات اتصال را بررسی کنید و دوباره تلاش کنید.",
    }, 502);
  }

  return json({
    ok: true,
    requestId: requestId,
    message: "درخواست به سرویس ایمیل ارسال شد. اگر تا چند دقیقه آینده ایمیل را ندیدید، پوشه Spam را هم بررسی کنید.",
  });
}
