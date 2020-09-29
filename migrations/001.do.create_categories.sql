CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    category_title TEXT NOT NULL,
    date_created DATE NOT NULL DEFAULT CURRENT_DATE
)