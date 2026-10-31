import pg from 'pg';
import { createSurveyHandler } from './handler.mjs';

const pool = new pg.Pool({connectionString:process.env.DATABASE_URL,max:2,idleTimeoutMillis:10000,connectionTimeoutMillis:10000});
pool.on('error', () => {});
const handler = createSurveyHandler({
  secret: process.env.SURVEY_SECRET,
  save: async record => {
    const client = await pool.connect();
    try {
      await client.query('begin');
      await client.query('set local role survey_submitter');
      const {rows} = await client.query('select survey_private.record_response($1::uuid,$2,$3,$4,$5::jsonb,$6,$7,$8,$9,$10) as result', [record.responseId,record.surveyVersion,record.variant,record.currency,JSON.stringify(record.answers),record.contactPermission,record.contactEmail,record.actor,record.payloadHash,record.isTest]);
      await client.query('commit');
      return rows[0].result;
    } catch (error) {
      await client.query('rollback').catch(() => {});
      console.error('Survey storage error', error.code || 'connection');
      throw error;
    } finally { client.release(); }
  },
});
export default {fetch:handler};
