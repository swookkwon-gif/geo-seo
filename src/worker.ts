interface AssetsBinding {
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

interface Env {
  ASSETS: AssetsBinding;
}

const CONTENT_SIGNAL = 'ai-train=yes, search=yes, ai-input=yes';

const RESERVED_PATHS = new Set(['/', '/about', '/paper', '/book', '/research', '/AI', '/404']);

function isPostPath(pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  return (
    !RESERVED_PATHS.has(normalized) &&
    !normalized.startsWith('/_astro/') &&
    !normalized.includes('.')
  );
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const accept = request.headers.get('accept') || '';
    const postPath = isPostPath(url.pathname);

    // AI 에이전트/크롤러가 Accept: text/markdown 으로 요청할 경우 정적 .md 엔드포인트로 콘텐츠 협상
    if (
      (request.method === 'GET' || request.method === 'HEAD') &&
      accept.includes('text/markdown') &&
      postPath
    ) {
      const normalized = url.pathname.replace(/\/+$/, '');
      const mdUrl = new URL(`${normalized}.md`, url.origin);
      const mdResponse = await env.ASSETS.fetch(new Request(mdUrl.toString(), request));

      if (mdResponse.ok) {
        const headers = new Headers(mdResponse.headers);
        headers.set('Content-Type', 'text/markdown; charset=utf-8');
        headers.set('Vary', 'Accept');
        headers.set('Content-Signal', CONTENT_SIGNAL);
        return new Response(mdResponse.body, {
          status: mdResponse.status,
          statusText: mdResponse.statusText,
          headers,
        });
      }
    }

    const response = await env.ASSETS.fetch(request);

    if (postPath && response.ok) {
      const headers = new Headers(response.headers);
      headers.set('Vary', 'Accept');
      headers.set('Content-Signal', CONTENT_SIGNAL);
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    return response;
  },
};
