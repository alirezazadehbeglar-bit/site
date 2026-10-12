import { onRequest as sendServiceRequest } from "../functions/api/request.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/request") {
      return sendServiceRequest({ request, env });
    }

    if (url.pathname.startsWith("/api/")) {
      return new Response(JSON.stringify({ ok: false, message: "مسیر API پیدا نشد." }), {
        status: 404,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
