# Create Admin User

## Credentials
- **Email**: uniadmin@univyx.com
- **Password**: Admin2026!

## Method 1: Supabase Dashboard (Recommended)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard/project/jkhqrzsaswhbewlumtyc)
2. Navigate to **Authentication** > **Users**
3. Click **"Add user"** button
4. Select **"Create new user"**
5. Enter:
   - Email: `uniadmin@univyx.com`
   - Password: `Admin2026!`
   - Auto Confirm User: ✅ (check this)
6. Click **"Create user"**

## Method 2: Using Application

1. Start the dev server: `npm run dev`
2. Go to the registration page
3. Register with:
   - Email: `uniadmin@univyx.com`
   - Password: `Admin2026!`
   - First Name: `Admin`
   - Last Name: `User`
4. Confirm email if required

## Method 3: SQL (Advanced)

Run this in Supabase SQL Editor:

```sql
-- This creates a user in auth.users table
-- Note: Password must be hashed, so use Dashboard method instead
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
  updated_at
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
  now()
);
```

**⚠️ Warning**: Method 3 requires the `pgcrypto` extension and may not work correctly. Use Method 1 instead.

## Verify Admin User

After creation, login with:
- Email: `uniadmin@univyx.com`
- Password: `Admin2026!`
