create table if not exists user_profiles (
  user_id text primary key,
  full_name text not null default '',
  role text not null default 'USER',
  status text not null default 'ACTIVE',
  last_login_at timestamptz,
  terms_accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists quizzes (
  id text primary key,
  title text not null,
  slug text not null unique,
  description text not null default '',
  instructions text not null default '',
  category text not null default 'General',
  difficulty text not null default 'Intermediate',
  time_limit_seconds integer not null default 3600,
  passing_percentage integer not null default 70,
  feedback_mode text not null default 'EXAM',
  show_explanation boolean not null default true,
  show_score_immediately boolean not null default true,
  randomize_questions boolean not null default false,
  randomize_options boolean not null default true,
  allow_back_navigation boolean not null default true,
  allow_retake boolean not null default true,
  max_attempts integer,
  matching_scoring text not null default 'all_or_nothing',
  ordering_scoring text not null default 'all_or_nothing',
  dropdown_scoring text not null default 'per_blank',
  published boolean not null default false,
  active boolean not null default true,
  archived boolean not null default false,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists questions (
  id text primary key,
  quiz_id text not null references quizzes(id) on delete cascade,
  type text not null,
  stem text not null,
  instruction text not null default '',
  explanation text not null default '',
  difficulty text not null default 'Medium',
  points numeric not null default 1,
  required_answers integer,
  scoring_mode text not null default 'all_or_nothing',
  position integer not null default 0,
  status text not null default 'published',
  source_id text,
  needs_review boolean not null default false,
  review_note text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists questions_quiz_id_idx on questions (quiz_id);

create table if not exists question_versions (
  id text primary key,
  question_id text not null references questions(id) on delete cascade,
  version integer not null,
  snapshot jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists question_media (
  id text primary key,
  question_id text,
  url text not null,
  alt text not null default '',
  kind text not null default 'image',
  created_at timestamptz not null default now()
);

create table if not exists quiz_attempts (
  id text primary key,
  user_id text not null,
  quiz_id text not null references quizzes(id),
  attempt_number integer not null,
  mode text not null default 'EXAM',
  status text not null default 'IN_PROGRESS',
  started_at timestamptz not null default now(),
  expires_at timestamptz not null,
  submitted_at timestamptz,
  duration_seconds integer not null,
  time_used_seconds integer,
  score numeric,
  max_score numeric,
  percentage numeric,
  passed boolean,
  correct_count integer,
  incorrect_count integer,
  unanswered_count integer,
  question_order jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists quiz_attempts_user_idx on quiz_attempts (user_id);
create index if not exists quiz_attempts_quiz_idx on quiz_attempts (quiz_id);

create table if not exists attempt_questions (
  id text primary key,
  attempt_id text not null references quiz_attempts(id) on delete cascade,
  question_id text not null,
  position integer not null,
  marked boolean not null default false,
  option_order jsonb not null default '[]'::jsonb,
  snapshot jsonb not null,
  unique (attempt_id, question_id)
);
create index if not exists attempt_questions_attempt_idx on attempt_questions (attempt_id);

create table if not exists attempt_answers (
  id text primary key,
  attempt_id text not null references quiz_attempts(id) on delete cascade,
  question_id text not null,
  answer jsonb not null default '{}'::jsonb,
  saved_at timestamptz not null default now(),
  is_correct boolean,
  points_awarded numeric,
  unique (attempt_id, question_id)
);
create index if not exists attempt_answers_attempt_idx on attempt_answers (attempt_id);

create table if not exists password_reset_tokens (
  id text primary key,
  user_id text not null,
  email text not null,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz
);

create table if not exists audit_logs (
  id text primary key,
  actor_id text,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists audit_logs_created_idx on audit_logs (created_at desc);

create table if not exists import_jobs (
  id text primary key,
  created_by text not null,
  filename text not null,
  status text not null default 'parsed',
  report jsonb not null default '{}'::jsonb,
  records jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists app_settings (
  key text primary key,
  value jsonb not null
);
