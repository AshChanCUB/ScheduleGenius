CREATE TABLE users (
    USER_ID SERIAL PRIMARY KEY,
    FIRST_NAME VARCHAR(255) NOT NULL,
    LAST_NAME VARCHAR(255) NOT NULL,
    EMAIL VARCHAR(255) NOT NULL UNIQUE,
    PASSWORD_HASH VARCHAR(255) NOT NULL,
    SECURITY_QUESTION VARCHAR(255) NOT NULL,
    SECURITY_ANSWER_HASH VARCHAR(255) NOT NULL
    -- Additional fields as needed
);

CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    USER_ID INT REFERENCES users(USER_ID),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    event_type VARCHAR(100),
    location VARCHAR(255),
    url VARCHAR(255)
    -- Additional fields as needed
);

CREATE TABLE user_preferences (
    preference_id SERIAL PRIMARY KEY,
    USER_ID INT REFERENCES users(USER_ID),
    preference_type VARCHAR(100) NOT NULL,
    preference_value VARCHAR(255)
    -- Additional fields as needed
);