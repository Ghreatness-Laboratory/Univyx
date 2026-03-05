-- Enable pgcrypto extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  recovery_token,
  email_change_token_new,
  email_change
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'uniadmin@univyx.com',
  crypt('Admin2026!', gen_salt('bf')),
  now(),
  '{"first_name": "Admin", "last_name": "User"}'::jsonb,
  now(),
  now(),
  '',
  '',
  '',
  ''
);
