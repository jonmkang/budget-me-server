CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_title TEXT NOT NULL,
    date_created TIMESTAMPTZ DEFAULT now() NOT NULL
)