BEGIN;

TRUNCATE 
    category, 
    budget_user,
    item
    RESTART IDENTITY CASCADE;

INSERT INTO budget_user(user_name, user_password)
VALUES
    ('Demo', 'Abcd123!');
    
INSERT INTO category(category_title, user_id)
VALUES  
    ('Bills', 1),
    ('Groceries', 1),
    ('Investments', 1),
    ('Pet Supplies', 1),
    ('Restaurants', 1);

INSERT INTO item(item_name, amount, category_id, user_id)
VALUES
    ('Le Gamin', 22, 5, 1),
    ('Pizza Prince', 18, 5, 1),
    ('Cafe Alula', 25, 5, 1),
    ('Electricity', 20, 1, 1),
    ('Internet', 30, 1, 1),
    ('H-Mart', 40, 2, 1),
    ('Whole Foods', 20, 2, 1),
    ('Cat food', 25, 4, 1),
    ('Cat litter', 35, 4, 1),
    ('Cat treats', 21, 4, 1),
    ('Robinhood', 22, 3, 1);

COMMIT;