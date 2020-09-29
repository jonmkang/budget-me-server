CREATE TABLE item (
    item_id SERIAL PRIMARY KEY,
    item_name TEXT NOT NULL,
    amount INTEGER NOT NULL,
    category_id INTEGER REFERENCES category (category_id) ON UPDATE CASCADE ON DELETE CASCADE,
    user_id INTEGER REFERENCES budget_user (user_id) ON UPDATE CASCADE,
    date_create DATE NOT NULL DEFAULT CURRENT_DATE
)