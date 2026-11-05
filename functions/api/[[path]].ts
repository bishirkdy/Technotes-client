interface Env {
  API_UPSTREAM?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

const DEFAULT_API_UPSTREAM = 'https://scribly-api.onrender.com';

export async function onRequest(context: PagesContext): Promise<Response> {
  const { request, env } = context;
  const upstream = (env.API_UPSTREAM || DEFAULT_API_UPSTREAM).replace(/\/+$/, '');
  const incomingUrl = new URL(request.url);
  const targetUrl = new URL(`${incomingUrl.pathname}${incomingUrl.search}`, `${upstream}/`);

  const headers = new Headers(request.headers);
  headers.delete('host');
  headers.set('x-forwarded-host', incomingUrl.host);
  headers.set('x-forwarded-proto', incomingUrl.protocol.replace(':', ''));

  const hasBody = request.method !== 'GET' && request.method !== 'HEAD';
  const upstreamResponse = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: hasBody ? request.body : undefined,
    redirect: 'manual'
  });

  const responseHeaders = new Headers(upstreamResponse.headers);
  responseHeaders.delete('content-encoding');
  responseHeaders.delete('content-length');
  responseHeaders.delete('transfer-encoding');
  responseHeaders.delete('connection');
  responseHeaders.delete('keep-alive');

  const setCookies = readSetCookies(upstreamResponse.headers);
  if (setCookies.length > 0) {
    responseHeaders.delete('set-cookie');
    for (const cookie of setCookies) {
      responseHeaders.append('set-cookie', cookie);
    }
  }

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders
  });
}

function readSetCookies(headers: Headers): string[] {
  const withGetSetCookie = headers as Headers & { getSetCookie?: () => string[] };
  if (typeof withGetSetCookie.getSetCookie === 'function') {
    return withGetSetCookie.getSetCookie();
  }

  const single = headers.get('set-cookie');
  return single ? [single] : [];
}
