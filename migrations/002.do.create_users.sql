CREATE TABLE budget_user (
    user_id SERIAL PRIMARY KEY,
    user_email TEXT NOT NULL,
    user_password TEXT NOT NULL,
);

ALTER TABLE category
    ADD COLUMN user_id INTEGER REFERENCES budget_user(user_id) ON DELETE SET NULL;