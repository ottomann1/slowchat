-- Create users
INSERT INTO users (name, total_fetches) VALUES
('Otto', 3),
('Old Salty Dog', 2);

-- Create messages
INSERT INTO messages (user_id, content, time) VALUES
((SELECT id FROM users WHERE name = 'Otto'), 'Ho ho how do you do', NOW() - INTERVAL '10 minutes'),
((SELECT id FROM users WHERE name = 'Otto'), 'Very nice app... I like it', NOW() - INTERVAL '8 minutes'),
((SELECT id FROM users WHERE name = 'Old Salty Dog'), 'Oh yes indeed it''s amazing.', NOW() - INTERVAL '5 minutes'),
((SELECT id FROM users WHERE name = 'Old Salty Dog'), 'I love this app', NOW() - INTERVAL '3 minutes'),
((SELECT id FROM users WHERE name = 'Old Salty Dog'), 'It''s so much more stressfree', NOW() - INTERVAL '2 minutes'),
((SELECT id FROM users WHERE name = 'Otto'), 'Wait I can''t see what you replied', NOW());

-- Create tokens
INSERT INTO tokens (user_id, daily_tokens, weekly_tokens) VALUES
((SELECT id FROM users WHERE name = 'Otto'), 1, 2),
((SELECT id FROM users WHERE name = 'Old Salty Dog'), 1, 2);

-- Create token_reset
INSERT INTO token_reset (last_daily_reset, last_weekly_reset) VALUES
(NOW(), NOW());

-- Create fetched messages
INSERT INTO fetched_messages (user_id, message_id) VALUES
((SELECT id FROM users WHERE name = 'Otto'), (SELECT id FROM messages WHERE content = 'Oh yes indeed it''s amazing.')),
((SELECT id FROM users WHERE name = 'Otto'), (SELECT id FROM messages WHERE content = 'I love this app')),
((SELECT id FROM users WHERE name = 'Otto'), (SELECT id FROM messages WHERE content = 'It''s so much more stressfree')),
((SELECT id FROM users WHERE name = 'Old Salty Dog'), (SELECT id FROM messages WHERE content = 'Ho ho how do you do')),
((SELECT id FROM users WHERE name = 'Old Salty Dog'), (SELECT id FROM messages WHERE content = 'Very nice app... I like it'));
