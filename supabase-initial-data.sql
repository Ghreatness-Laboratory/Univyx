-- Insert initial homepage stats
INSERT INTO homepage_stats (students, universities, events, tournaments)
VALUES (5000, 10, 50, 20)
ON CONFLICT DO NOTHING;

-- Create admin user
-- Email: uniadmin@univyx.com
-- Password: Admin2026!
-- Note: Run this in Supabase Dashboard > Authentication > Users > "Add user" manually
-- OR use the Supabase Auth API to create the user programmatically
