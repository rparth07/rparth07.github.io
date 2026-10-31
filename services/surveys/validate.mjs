import { SURVEY_VERSION, variants } from './schema.mjs';

export class InvalidSubmission extends Error {}
const fail = message => { throw new InvalidSubmission(message); };
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const cleanText = (value, maximum, name) => {
  if (typeof value !== 'string' || value.length > maximum || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) fail(`Please check ${name}.`);
  return value.trim();
};

export function validateSubmission(body) {
  if (!object(body)) fail('Please check your answers.');
  const allowed = ['responseId','surveyVersion','variant','currency','answers','contactPermission','contactEmail','challenge','companyFax'];
  if (Object.keys(body).some(key => !allowed.includes(key))) fail('Unexpected submission field.');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.responseId)) fail('Please refresh the survey and try again.');
  const definition = Object.hasOwn(variants, body.variant || '') && variants[body.variant];
  if (!definition || body.surveyVersion !== SURVEY_VERSION || body.currency !== definition.currency) fail('This survey has changed. Please refresh it before submitting.');
  if (!object(body.answers) || Object.keys(body.answers).some(key => !Object.hasOwn(definition.fields, key))) fail('Unexpected answer field.');
  if (body.companyFax !== '') fail('Please refresh the survey and try again.');
  const answers = {};
  for (const [name, field] of Object.entries(definition.fields)) {
    const raw = body.answers[name];
    if (raw === undefined || raw === '') {
      if (field.required) fail(`Please answer ${name === 'currentSituation' ? 'question 1' : name === 'businessType' ? 'question 2' : 'question 14'}.`);
      continue;
    }
    if (field.type === 'multiple') {
      if (!Array.isArray(raw) || raw.length > field.values.length || new Set(raw).size !== raw.length || raw.some(value => !field.values.includes(value))) fail(`Please check ${name}.`);
      if (raw.length) answers[name] = field.values.filter(value => raw.includes(value));
    } else if (field.type === 'enum') {
      if (!field.values.includes(raw)) fail(`Please check ${name}.`);
      answers[name] = raw;
    } else {
      const value = cleanText(raw, name === 'notes' ? 4000 : name === 'existingWebsiteUrl' ? 2048 : 250, name);
      if (value) answers[name] = value;
    }
  }
  if (answers.businessType !== 'Other' && answers.businessTypeOtherText) fail('Other business details do not match your business type.');
  if (answers.hasExistingWebsite !== 'Yes' && (answers.existingWebsiteUrl || answers.existingWebsiteSpend)) fail('Website details do not match your answer.');
  if (answers.existingWebsiteUrl) {
    let url;
    try { url = new URL(answers.existingWebsiteUrl); } catch { fail('Please enter a complete website address, starting with https:// or http://.'); }
    if (!['https:', 'http:'].includes(url.protocol) || !url.hostname || url.username || url.password) fail('Please enter a normal website address without sign-in details.');
  }
  if (typeof body.contactPermission !== 'boolean') fail('Please check the optional contact permission.');
  const email = cleanText(body.contactEmail, 254, 'your email address');
  if (body.contactPermission && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail('Please enter your email address if you would like to be contacted.');
  if (!body.contactPermission && email) fail('An email address requires optional contact permission.');
  if (typeof body.challenge !== 'string' || body.challenge.length > 1024) fail('Please try submitting again.');
  return {
    responseId: body.responseId,
    surveyVersion: SURVEY_VERSION,
    variant: body.variant,
    currency: definition.currency,
    answers,
    contactPermission: body.contactPermission,
    contactEmail: body.contactPermission ? email : null,
  };
}
