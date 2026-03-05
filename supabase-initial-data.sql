-- Insert initial homepage stats
INSERT INTO homepage_stats (students, universities, events, tournaments)
VALUES (5000, 10, 50, 20)
ON CONFLICT DO NOTHING;
