create schema survey_private;
revoke all on schema survey_private from public;
create role survey_submitter nologin nosuperuser nocreatedb nocreaterole noinherit nobypassrls;
grant survey_submitter to survey_owner;
grant usage on schema survey_private to survey_submitter;

create table survey_private.responses (
 response_id uuid primary key,
 survey_version text not null,
 variant text not null check (variant in ('india','global')),
 currency text not null check ((variant='india' and currency='INR') or (variant='global' and currency='USD')),
 submitted_at timestamptz not null default now(),
 answers jsonb not null check (jsonb_typeof(answers)='object'),
 contact_permission boolean not null,
 contact_email text,
 payload_hash text not null,
 is_test boolean not null default false,
 check ((contact_permission and contact_email is not null) or (not contact_permission and contact_email is null))
);
alter table survey_private.responses enable row level security;
revoke all on survey_private.responses from public;

create table survey_private.rate_limits (
 bucket timestamptz not null,
 actor text not null,
 count integer not null,
 primary key (bucket,actor)
);
alter table survey_private.rate_limits enable row level security;
revoke all on survey_private.rate_limits from public;

create function survey_private.record_response(
 p_id uuid,p_version text,p_variant text,p_currency text,p_answers jsonb,
 p_contact boolean,p_email text,p_actor text,p_hash text,p_test boolean
) returns text language plpgsql security definer set search_path = pg_catalog as $$
declare previous_hash text; hourly_count integer; daily_count integer;
begin
 perform pg_advisory_xact_lock(193764823);
 select payload_hash into previous_hash from survey_private.responses where response_id=p_id;
 if found then
  if previous_hash=p_hash then return 'duplicate'; else return 'conflict'; end if;
 end if;
 select count into hourly_count from survey_private.rate_limits where bucket=date_trunc('hour',now()) and actor=p_actor;
 select count into daily_count from survey_private.rate_limits where bucket=date_trunc('day',now()) and actor='global';
 if coalesce(hourly_count,0)>=5 or coalesce(daily_count,0)>=200 then return 'rate_limited'; end if;
 insert into survey_private.responses(response_id,survey_version,variant,currency,answers,contact_permission,contact_email,payload_hash,is_test)
 values(p_id,p_version,p_variant,p_currency,p_answers,p_contact,p_email,p_hash,p_test);
 insert into survey_private.rate_limits(bucket,actor,count) values(date_trunc('hour',now()),p_actor,1)
 on conflict(bucket,actor) do update set count=survey_private.rate_limits.count+1;
 insert into survey_private.rate_limits(bucket,actor,count) values(date_trunc('day',now()),'global',1)
 on conflict(bucket,actor) do update set count=survey_private.rate_limits.count+1;
 delete from survey_private.rate_limits where bucket < now()-interval '7 days';
 return 'saved';
end;
$$;
revoke all on function survey_private.record_response(uuid,text,text,text,jsonb,boolean,text,text,text,boolean) from public;
grant execute on function survey_private.record_response(uuid,text,text,text,jsonb,boolean,text,text,text,boolean) to survey_submitter;

create view survey_private.response_export with (security_invoker=true) as select
response_id,
survey_version,
variant,
currency,
submitted_at,
is_test,
contact_permission,
case when coalesce(answers->>'businessName','') ~ '^[[:space:]]*[=+@-]' then chr(39)||coalesce(answers->>'businessName','') else coalesce(answers->>'businessName','') end as "businessName",
case when coalesce(answers->>'responderName','') ~ '^[[:space:]]*[=+@-]' then chr(39)||coalesce(answers->>'responderName','') else coalesce(answers->>'responderName','') end as "responderName",
case when coalesce(answers->>'country','') ~ '^[[:space:]]*[=+@-]' then chr(39)||coalesce(answers->>'country','') else coalesce(answers->>'country','') end as "country",
case when coalesce(answers->>'currentSituation','') ~ '^[[:space:]]*[=+@-]' then chr(39)||coalesce(answers->>'currentSituation','') else coalesce(answers->>'currentSituation','') end as "currentSituation",
case when coalesce(answers->>'businessType','') ~ '^[[:space:]]*[=+@-]' then chr(39)||coalesce(answers->>'businessType','') else coalesce(answers->>'businessType','') end as "businessType",
case when coalesce(answers->>'businessTypeOtherText','') ~ '^[[:space:]]*[=+@-]' then chr(39)||coalesce(answers->>'businessTypeOtherText','') else coalesce(answers->>'businessTypeOtherText','') end as "businessTypeOtherText",
case when coalesce(answers->>'goals','') ~ '^[[:space:]]*[=+@-]' then chr(39)||coalesce(answers->>'goals','') else coalesce(answers->>'goals','') end as "goals",
case when coalesce(answers->>'customerActions','') ~ '^[[:space:]]*[=+@-]' then chr(39)||coalesce(answers->>'customerActions','') else coalesce(answers->>'customerActions','') end as "customerActions",
case when coalesce(answers->>'content','') ~ '^[[:space:]]*[=+@-]' then chr(39)||coalesce(answers->>'content','') else coalesce(answers->>'content','') end as "content",
case when coalesce(answers->>'catalogSize','') ~ '^[[:space:]]*[=+@-]' then chr(39)||coalesce(answers->>'catalogSize','') else coalesce(answers->>'catalogSize','') end as "catalogSize",
case when coalesce(answers->>'buyFlow','') ~ '^[[:space:]]*[=+@-]' then chr(39)||coalesce(answers->>'buyFlow','') else coalesce(answers->>'buyFlow','') end as "buyFlow",
case when coalesce(answers->>'designLevel','') ~ '^[[:space:]]*[=+@-]' then chr(39)||coalesce(answers->>'designLevel','') else coalesce(answers->>'designLevel','') end as "designLevel",
case when coalesce(answers->>'selfManage','') ~ '^[[:space:]]*[=+@-]' then chr(39)||coalesce(answers->>'selfManage','') else coalesce(answers->>'selfManage','') end as "selfManage",
case when coalesce(answers->>'assets','') ~ '^[[:space:]]*[=+@-]' then chr(39)||coalesce(answers->>'assets','') else coalesce(answers->>'assets','') end as "assets",
case when coalesce(answers->>'extras','') ~ '^[[:space:]]*[=+@-]' then chr(39)||coalesce(answers->>'extras','') else coalesce(answers->>'extras','') end as "extras",
case when coalesce(answers->>'googleImportance','') ~ '^[[:space:]]*[=+@-]' then chr(39)||coalesce(answers->>'googleImportance','') else coalesce(answers->>'googleImportance','') end as "googleImportance",
case when coalesce(answers->>'timeline','') ~ '^[[:space:]]*[=+@-]' then chr(39)||coalesce(answers->>'timeline','') else coalesce(answers->>'timeline','') end as "timeline",
case when coalesce(answers->>'budget','') ~ '^[[:space:]]*[=+@-]' then chr(39)||coalesce(answers->>'budget','') else coalesce(answers->>'budget','') end as "budget",
case when coalesce(answers->>'budgetFlexibility','') ~ '^[[:space:]]*[=+@-]' then chr(39)||coalesce(answers->>'budgetFlexibility','') else coalesce(answers->>'budgetFlexibility','') end as "budgetFlexibility",
case when coalesce(answers->>'hasExistingWebsite','') ~ '^[[:space:]]*[=+@-]' then chr(39)||coalesce(answers->>'hasExistingWebsite','') else coalesce(answers->>'hasExistingWebsite','') end as "hasExistingWebsite",
case when coalesce(answers->>'existingWebsiteUrl','') ~ '^[[:space:]]*[=+@-]' then chr(39)||coalesce(answers->>'existingWebsiteUrl','') else coalesce(answers->>'existingWebsiteUrl','') end as "existingWebsiteUrl",
case when coalesce(answers->>'existingWebsiteSpend','') ~ '^[[:space:]]*[=+@-]' then chr(39)||coalesce(answers->>'existingWebsiteSpend','') else coalesce(answers->>'existingWebsiteSpend','') end as "existingWebsiteSpend",
case when coalesce(answers->>'notes','') ~ '^[[:space:]]*[=+@-]' then chr(39)||coalesce(answers->>'notes','') else coalesce(answers->>'notes','') end as "notes",
case when coalesce(contact_email,'') ~ '^[[:space:]]*[=+@-]' then chr(39)||contact_email else contact_email end as contact_email
from survey_private.responses;
revoke all on survey_private.response_export from public;
