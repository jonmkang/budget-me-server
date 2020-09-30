CREATE TABLE budgets (
    budget_id SERIAL PRIMARY KEY,
    amount INTEGER NOT NULL,
    title TEXT NOT NULL,
    user_id INTEGER REFERENCES budget_user (user_id) ON UPDATE CASCADE,
    date_create TIMESTAMPTZ DEFAULT now() NOT NULL
)