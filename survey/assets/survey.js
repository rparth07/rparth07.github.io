import { surveyConfig } from './config.js';

const form = document.getElementById('surveyForm');
const variant = document.documentElement.dataset.surveyVariant;
const submit = document.getElementById('submitSurvey');
const errorBox = document.getElementById('submissionError');
const status = document.getElementById('submissionStatus');
const success = document.getElementById('successMessage');
const contact = document.getElementById('contactPermission');
const email = document.getElementById('contactEmail');
const storageKey = `website-survey:${surveyConfig.surveyVersion}:${variant}`;
let responseId = crypto.randomUUID();
let saved = false;
let sending = false;
let pending = null;
let challenge = null;
let challengePromise = null;
try {
  const existing = JSON.parse(sessionStorage.getItem(storageKey));
  if (existing?.responseId && /^[0-9a-f-]{36}$/i.test(existing.responseId)) {
    responseId = existing.responseId;
    saved = existing.saved === true;
  }
} catch {}

function remember() {
  try { sessionStorage.setItem(storageKey,JSON.stringify({responseId,saved})); } catch {}
}

function showError(message) {
  errorBox.textContent = message;
  errorBox.hidden = false;
  errorBox.focus();
}

function toggleFields() {
  const other = form.querySelector('[name="businessType"]:checked')?.value === 'Other';
  const website = form.querySelector('[name="hasExistingWebsite"]:checked')?.value === 'Yes';
  for (const [id,show] of [['businessTypeOtherWrap',other],['existingWebsiteDetails',website]]) {
    const section = document.getElementById(id);
    section.hidden = !show;
    section.style.display = show ? 'block' : 'none';
    section.querySelectorAll('input').forEach(input => { input.disabled = !show; });
  }
  document.getElementById('contactDetails').hidden = !contact.checked;
  email.disabled = !contact.checked;
  email.required = contact.checked;
  const names = ['currentSituation','businessType','goals','customerActions','content','catalogSize','buyFlow','designLevel','selfManage','assets','extras','googleImportance','timeline','budget','budgetFlexibility','hasExistingWebsite'];
  const count = names.filter(name => form.querySelector(`[name="${name}"]:checked`)).length;
  const percent = Math.round(count / names.length * 100);
  document.getElementById('progressBar').style.width = `${percent}%`;
  document.getElementById('progressText').textContent = `${count} of 16 questions answered`;
}

async function fetchChallenge() {
  if (challenge) return challenge;
  if (!surveyConfig.endpoint) throw new Error('Submissions are not open yet. Please return later. Your answers have not been sent.');
  if (!challengePromise) {
    challengePromise = (async () => {
      const url = new URL(surveyConfig.endpoint);
      url.searchParams.set('variant',variant);
      const response = await fetch(url,{signal:AbortSignal.timeout(20000),credentials:'omit',cache:'no-store'});
      if (!response.ok) throw new Error('The survey service is temporarily unavailable. Please try Submit again.');
      const data = await response.json();
      if (!data.challenge || data.surveyVersion !== surveyConfig.surveyVersion) throw new Error('Please refresh this survey before submitting.');
      challenge = data.challenge;
      return challenge;
    })().finally(() => { challengePromise = null; });
  }
  return challengePromise;
}

function collect() {
  const data = new FormData(form), answers = {};
  for (const [name,value] of data) {
    if (['companyFax','contactPermission','contactEmail'].includes(name)) continue;
    const input = form.elements.namedItem(name);
    const checkbox = form.querySelector(`[name="${name}"]`)?.type === 'checkbox';
    if (checkbox) answers[name] = data.getAll(name);
    else if (!input.disabled && value.trim()) answers[name] = value.trim();
  }
  return {responseId,surveyVersion:surveyConfig.surveyVersion,variant,currency:variant === 'india' ? 'INR' : 'USD',answers,contactPermission:contact.checked,contactEmail:contact.checked ? email.value.trim() : '',companyFax:data.get('companyFax') || ''};
}

function finish() {
  saved = true;
  remember();
  status.textContent = '';
  errorBox.hidden = true;
  success.hidden = false;
  for (const input of form.elements) input.disabled = true;
  submit.textContent = 'Submitted';
  success.focus();
}

form.addEventListener('change',toggleFields);
form.addEventListener('input',() => { if (!sending) errorBox.hidden = true; });
form.addEventListener('submit',async event => {
  event.preventDefault();
  if (sending || saved) return;
  if (!form.reportValidity()) return;
  const current = pending ? {...pending,challenge:undefined} : collect();
  sending = true;
  submit.disabled = true;
  form.querySelector('[type="reset"]').disabled = true;
  errorBox.hidden = true;
  status.textContent = 'Saving your answers…';
  form.setAttribute('aria-busy','true');
  for (const input of form.querySelectorAll('input,select,textarea')) input.disabled = true;
  try {
    const token = await fetchChallenge();
    const payload = {...current,challenge:token};
    pending = payload;
    remember();
    const response = await fetch(surveyConfig.endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(25000),credentials:'omit'});
    const result = await response.json();
    if (!response.ok) {
      if (response.status < 500 && response.status !== 409) pending = null;
      if (result.refreshChallenge) challenge = null;
      throw new Error(result.error || 'Your answers could not be saved. Please try Submit again.');
    }
    if (result.ok !== true || result.responseId !== responseId) throw new Error('The service did not confirm your response. Please try Submit again.');
    finish();
  } catch (error) {
    status.textContent = '';
    showError(error.name === 'TimeoutError' || error.name === 'TypeError' ? 'We could not confirm that your answers were saved. Your answers are still here. Please try Submit again; retries will not create a second response.' : error.message);
  } finally {
    sending = false;
    form.removeAttribute('aria-busy');
    submit.disabled = saved;
    form.querySelector('[type="reset"]').disabled = saved || !!pending;
    if (!saved && !pending) {
      for (const input of form.querySelectorAll('input,select,textarea')) input.disabled = false;
      toggleFields();
    }
  }
});

form.addEventListener('reset',event => {
  if (saved || pending || sending) { event.preventDefault(); return; }
  if (!window.confirm('Clear all the answers on this page?')) { event.preventDefault(); return; }
  setTimeout(() => { toggleFields(); errorBox.hidden = true; status.textContent = ''; },0);
});
window.addEventListener('beforeunload',event => {
  if (!saved && (pending || sending || [...new FormData(form)].some(([key,value]) => key !== 'companyFax' && value))) { event.preventDefault(); event.returnValue = ''; }
});
for (const input of form.querySelectorAll('input[type="text"],input[type="url"],textarea')) input.maxLength = input.name === 'notes' ? 4000 : input.type === 'url' ? 2048 : 250;
toggleFields();
if (saved) finish();
else {
  remember();
  submit.disabled = !surveyConfig.endpoint;
  fetchChallenge().catch(() => { status.textContent = surveyConfig.endpoint ? 'If the service is slow to start, Submit will try connecting again.' : 'Submissions are not open yet. Please return later.'; });
}
