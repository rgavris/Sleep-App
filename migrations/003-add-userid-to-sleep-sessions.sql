-- Up
ALTER TABLE sleep_sessions ADD COLUMN userId INTEGER REFERENCES users(id);

-- Down
ALTER TABLE sleep_sessions DROP COLUMN userId;
