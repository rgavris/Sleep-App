-- Up
CREATE TABLE sleep_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    startTime TEXT NOT NULL,
    endTime TEXT NOT NULL,
    quality TEXT NOT NULL,
    notes TEXT
);

-- Down
DROP TABLE sleep_sessions;
