import { createHmac, randomUUID, timingSafeEqual, createHash } from 'node:crypto';
import { InvalidSubmission, validateSubmission } from './validate.mjs';
import { SURVEY_VERSION, variants } from './schema.mjs';

export function createSurveyHandler({ save, secret, origins = ['https://rparth07.github.io'], now = Date.now }) {
  if (!secret || secret.length < 32) throw new Error('A server-only survey secret is required.');
  const sign = text => createHmac('sha256', secret).update(text).digest('base64url');
  const equal = (a, b) => {
    const left = Buffer.from(a), right = Buffer.from(b);
    return left.length === right.length && timingSafeEqual(left, right);
  };
  return async request => {
    const origin = request.headers.get('origin');
    const headers = {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','Vary':'Origin','X-Content-Type-Options':'nosniff'};
    const reply = (status, data, extra = {}) => Response.json(data, {status, headers: {...headers, ...extra}});
    if (!origins.includes(origin)) return reply(403, {error:'This survey must be opened from Parth’s portfolio.'});
    headers['Access-Control-Allow-Origin'] = origin;
    if (request.method === 'OPTIONS') return new Response(null, {status:204,headers:{...headers,'Access-Control-Allow-Methods':'GET, POST, OPTIONS','Access-Control-Allow-Headers':'Content-Type','Access-Control-Max-Age':'600'}});
    const url = new URL(request.url);
    if (request.method === 'GET') {
      const variant = url.searchParams.get('variant');
      if (!Object.hasOwn(variants, variant || '')) return reply(400, {error:'Unknown survey.'});
      const data = Buffer.from(JSON.stringify({time:now(),nonce:randomUUID(),variant,origin})).toString('base64url');
      return reply(200, {challenge:`${data}.${sign(data)}`,surveyVersion:SURVEY_VERSION});
    }
    if (request.method !== 'POST') return reply(405, {error:'Use Submit on the survey page.'}, {Allow:'GET, POST, OPTIONS'});
    if (!/^application\/json(?:;|$)/i.test(request.headers.get('content-type') || '')) return reply(415, {error:'Please submit the survey using the form.'});
    if (Number(request.headers.get('content-length')) > 24000) return reply(413, {error:'Please shorten the text in your answers.'});
    try {
      const reader = request.body?.getReader();
      if (!reader) throw new InvalidSubmission('Please check your answers.');
      const chunks = []; let length = 0;
      while (true) {
        const {done,value} = await reader.read();
        if (done) break;
        length += value.length;
        if (length > 24000) { await reader.cancel(); return reply(413, {error:'Please shorten the text in your answers.'}); }
        chunks.push(value);
      }
      let body;
      try { body = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw new InvalidSubmission('Please check your answers.'); }
      const record = validateSubmission(body);
      const [data, signature, extra] = body.challenge.split('.');
      if (!data || !signature || extra || !equal(signature, sign(data))) return reply(400, {error:'Please try submitting again.',refreshChallenge:true});
      let token;
      try { token = JSON.parse(Buffer.from(data,'base64url').toString()); } catch { return reply(400, {error:'Please try submitting again.',refreshChallenge:true}); }
      const age = now() - token.time;
      if (!Number.isFinite(age) || age < 2000 || age > 86400000 || token.variant !== record.variant || token.origin !== origin) return reply(400, {error:age < 2000 ? 'Please wait a moment, then submit again.' : 'Please submit again to refresh the form’s safety check.',refreshChallenge:age >= 2000});
      const address = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
      const actor = sign(`survey-ip:${address}`);
      const hash = createHash('sha256').update(JSON.stringify(record)).digest('hex');
      const result = await save({...record,actor,payloadHash:hash,isTest:record.answers.businessName?.startsWith('[TEST] ') || false});
      if (result === 'rate_limited') return reply(429, {error:'Too many submissions. Please try again later. Your answers are still here.'},{'Retry-After':'3600'});
      if (result === 'conflict') return reply(409, {error:'This response was already saved with different answers. Please do not submit it again.'});
      if (!['saved','duplicate'].includes(result)) throw new Error('Unexpected storage result');
      return reply(200, {ok:true,responseId:record.responseId});
    } catch (error) {
      if (error instanceof InvalidSubmission) return reply(400, {error:error.message});
      return reply(503, {error:'Your answers could not be saved. Please try Submit again. Your answers are still here.'});
    }
  };
}
