CREATE TABLE users (
    USER_ID SERIAL PRIMARY KEY,
    FIRST_NAME VARCHAR(255) NOT NULL,
    LAST_NAME VARCHAR(255) NOT NULL,
    EMAIL VARCHAR(255) NOT NULL UNIQUE,
    PASSWORD_HASH VARCHAR(255) NOT NULL,
    SECURITY_QUESTION VARCHAR(255) NOT NULL,
    SECURITY_ANSWER_HASH VARCHAR(255) NOT NULL
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
);

CREATE TABLE user_preferences (
    preference_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    event_type VARCHAR(100) NOT NULL,
    priority INT,
    event_label VARCHAR(100),
    focus_level VARCHAR(100),
    estimated_duration INT
);

CREATE TABLE user_label_weights (
    weight_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    label_name VARCHAR(100) NOT NULL,
    weight DECIMAL(3,2) NOT NULL
);

CREATE TABLE user_study_models (
    model_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    study_model VARCHAR(100) NOT NULL,
    pomodoro_length INT, -- For Pomodoro model
    break_length INT,    -- For Pomodoro model
    extended_breaks INT  -- For Pomodoro model
    -- Add more fields here for different study models if needed
);