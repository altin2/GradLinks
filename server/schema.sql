-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.notices (
  poster_id uuid NOT NULL DEFAULT gen_random_uuid(),
  message text DEFAULT ''::text,
  required_degree text NOT NULL,
  required_skills ARRAY,
  required_work_years text,
  Title text,
  id uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  CONSTRAINT notices_pkey PRIMARY KEY (id),
  CONSTRAINT notices_poster_id_fkey FOREIGN KEY (poster_id) REFERENCES public.user_employer(id)
);
CREATE TABLE public.notifications (
  user_id uuid,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  sender_id uuid,
  notif_id uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  CONSTRAINT notifications_pkey PRIMARY KEY (notif_id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT notifications_user_id_fkey1 FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.universities (
  UKPRN bigint NOT NULL,
  PROVIDER_NAME text,
  VIEW_NAME text,
  CONSTRAINT universities_pkey PRIMARY KEY (UKPRN)
);
CREATE TABLE public.user_employer (
  id uuid NOT NULL,
  employer_id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_name character varying,
  isVerified boolean NOT NULL DEFAULT false,
  bio text,
  CONSTRAINT user_employer_pkey PRIMARY KEY (id),
  CONSTRAINT user_employer_id_fkey FOREIGN KEY (id) REFERENCES public.users(id)
);
CREATE TABLE public.user_grad (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  first_name text,
  last_name text,
  middle_name text,
  age smallint,
  bio_description text,
  degree_type text,
  work_years smallint NOT NULL DEFAULT '0'::smallint,
  skills_desc ARRAY NOT NULL DEFAULT '{}'::text[],
  attended_uni ARRAY,
  CONSTRAINT user_grad_pkey PRIMARY KEY (id),
  CONSTRAINT user_grad_id_fkey FOREIGN KEY (id) REFERENCES public.users(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL,
  email text,
  phone_number text,
  isgrad boolean NOT NULL DEFAULT false,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);