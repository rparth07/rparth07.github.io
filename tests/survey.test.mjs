import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {validateSubmission} from '../services/surveys/validate.mjs';
import {createSurveyHandler} from '../services/surveys/handler.mjs';
import {variants,SURVEY_VERSION} from '../services/surveys/schema.mjs';
const body=(variant='india')=>({responseId:randomUUID(),surveyVersion:SURVEY_VERSION,variant,currency:variants[variant].currency,answers:{currentSituation:'No website',businessType:'Other',businessTypeOtherText:'Local service',budget:variants[variant].fields.budget.values[0]},contactPermission:false,contactEmail:'',companyFax:'',challenge:''});
test('both original questionnaires accept required and conditional answers',()=>{
 for(const variant of ['india','global']){
  const value=body(variant);value.answers.hasExistingWebsite='Yes';value.answers.existingWebsiteUrl='https://example.com';value.answers.existingWebsiteSpend=variant==='india'?'INR 25,000':'USD 1,000';
  if(variant==='global')value.answers.country='US';
  assert.equal(validateSubmission(value).currency,variant==='india'?'INR':'USD');
 }
});
test('validation rejects fabricated options, invalid variants, stale conditional data, invalid URLs, unwanted contact details, and overlong text',()=>{
 const changes=[v=>v.answers.businessType='Fake',v=>v.variant='unknown',v=>v.currency='USD',v=>v.answers.currentSituation='',v=>v.answers.country='US',v=>v.answers.existingWebsiteUrl='https://example.com',v=>{v.answers.hasExistingWebsite='Yes';v.answers.existingWebsiteUrl='javascript:alert(1)';},v=>v.contactPermission='true',v=>v.contactEmail='owner@example.com',v=>v.contactPermission=true,v=>v.answers.notes='x'.repeat(4001),v=>v.answers.goals=['Show products','Show products'],v=>v.companyFax='bot',v=>v.answers.unexpected='x'];
 for(const change of changes){const value=body();change(value);assert.throws(()=>validateSubmission(value));}
 const value=body();value.contactPermission=true;value.contactEmail='owner@example.com';assert.equal(validateSubmission(value).contactEmail,'owner@example.com');
});
const origin='https://rparth07.github.io';
const request=(method,data,path='')=>new Request('https://api.example/'+path,{method,headers:{origin,'content-type':'application/json'},body:data?JSON.stringify(data):undefined});
test('signed challenges, minimum time, idempotency, failure handling and method restrictions',async()=>{
 let time=100000,saves=0;const stored=new Map();
 const handler=createSurveyHandler({secret:'s'.repeat(48),now:()=>time,save:async record=>{saves++;if(stored.has(record.responseId))return stored.get(record.responseId)===record.payloadHash?'duplicate':'conflict';stored.set(record.responseId,record.payloadHash);return 'saved';}});
 const challenge=await(await handler(request('GET',null,'?variant=india'))).json();const value=body();value.challenge=challenge.challenge;
 assert.equal((await handler(request('POST',value))).status,400);time+=2100;
 assert.equal((await handler(request('POST',value))).status,200);assert.equal(stored.size,1);
 assert.equal((await handler(request('POST',value))).status,200);assert.equal(stored.size,1);
 value.answers.notes='Changed';assert.equal((await handler(request('POST',value))).status,409);
 value.challenge+='x';assert.equal((await handler(request('POST',value))).status,400);
 assert.equal((await handler(request('GET'))).status,400);
 assert.equal((await handler(request('DELETE'))).status,405);
 assert.equal((await handler(new Request('https://api.example/?variant=india'))).status,403);
 assert.equal((await handler(request('OPTIONS'))).status,204);
 assert.equal((await handler(request('POST',{...body(),answers:{notes:'x'.repeat(25000)}}))).status,413);
 const unavailable=createSurveyHandler({secret:'s'.repeat(48),now:()=>time,save:async()=>{throw Error('database private error');}});value.challenge=challenge.challenge;
 const response=await unavailable(request('POST',value));assert.equal(response.status,503);assert(!(await response.text()).includes('database private error'));
 const limited=createSurveyHandler({secret:'s'.repeat(48),now:()=>time,save:async()=> 'rate_limited'});assert.equal((await limited(request('POST',value))).status,429);
 time+=86400000;assert.equal((await handler(request('POST',value))).status,400);
});
