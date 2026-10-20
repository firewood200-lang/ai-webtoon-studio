// 집필실(Writing Studio) 노션 저장용 중계 — Cloudflare Pages Functions (2026-10-21 추가)
// 브라우저 → 같은 사이트의 /notion/v1/... → api.notion.com/v1/...
// 같은 주소에서 처리되므로 브라우저 CORS 검사가 없고 PATCH(본문 추가·수정)도 통과한다.
// 토큰은 요청의 X-Notion-Key 헤더로만 받고 어디에도 저장하지 않는다.
export async function onRequest(context) {
  const { request, params } = context;
  const json = (status, obj) => new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });
  if (request.method === 'OPTIONS') return new Response(null, { status: 204 });
  const key = request.headers.get('X-Notion-Key');
  if (!key) return json(401, { message: '노션 토큰(X-Notion-Key)이 없습니다.' });
  const path = Array.isArray(params.path) ? params.path.join('/') : String(params.path || '');
  if (!/^v1\//.test(path)) return json(400, { message: 'v1 경로만 전달합니다.' });
  if (!['GET', 'POST', 'PATCH', 'DELETE'].includes(request.method)) return json(405, { message: '허용되지 않는 요청 방식입니다.' });
  const url = new URL(request.url);
  const init = { method: request.method, headers: { Authorization: 'Bearer ' + key, 'Notion-Version': '2022-06-28', 'Content-Type': 'application/json' } };
  if (request.method !== 'GET') init.body = await request.text();
  const r = await fetch('https://api.notion.com/' + path + url.search, init);
  const headers = { 'Content-Type': r.headers.get('Content-Type') || 'application/json' };
  const ra = r.headers.get('Retry-After'); if (ra) headers['Retry-After'] = ra;
  return new Response(r.body, { status: r.status, headers });
}
