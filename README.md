# BudgetMe Server

This contains scripts to set up a database useing PostgreSQL and sets up a server to be used with API requests

## Set up

Clone this repository to your local machine `git clone budget-me-server` <br>
cd into the cloned repository <br>
Make a fresh start of the git history for this project with `rm -rf .git & git init`

Install node dependencies `npm install`

Create a database for tables using PostgreSQL
Sample script : `psql CREATE DATABASE database_name`

Create .env file in the main path folder and add `DATABASE_URL="postgresql://username@localhost/database_name"` to path the server to the correct database.

From here, you can run `npm run migrate`, and it will create tables inside the database you created.

To seed the table, you must run the command `psql -U username -d database_name -f ./seed/seed.budget_me.sql`

This finishes the set up of the database on the local server.

## Scripts
Start the server with `npm run dev`

Run the tests `npm test`

## Deploying

When your new project is ready for deployment, add a new Heroku application with `heroku create`. This will make a new git remote called "heroku" and you can then `npm run deploy` which will push to this remote's master branch.

## API Documentation

### /categories/:user_id
User_id must be specified as a parameter for every request, it is defaulted to the demo_id of 1 to start.  When user registration is complete, it will use to the id of the user who is logged in.

When a GET request is made, all categories where user_id is equal to the user_id param is returned.
When a POST request is made, it will clear all cross scripting problems and add the category to the database.


#### /categories/:user_id/:category_name

Like before, user_id is a parameter and now category_name is the second parameter.

When a GET request is made, all categories with the name of :category_name will be returned.

When a DELETE request is made, all categories with the name will be deleted. (If there are bugs with this, category_name will be changed to a unique category_id)

When a PATCH request is made, the category found will be updated with a new given category name.

### /items/:user_id
User_id must be specified as a parameter for every request, it is defaulted to the demo_id of 1 to start.  When user registration is complete, it will use to the id of the user who is logged in.

When a GET request is made, all items where user_id is equal to the user_id param is returned.

When a POST request is made, it checks if the body has item_name, user_id, category_id, and amount, if one of these are not there, an error is sent.  If all these exist, the server attempts to add the cross scripting cleared item to the database.

#### /items/:user_id/:item_id
Like before, user_id is a parameter and now item_id is the second parameter.

When a GET request is made, the item is returned if an item with an id matching item_id is found.

When a PATCH request is made, the item is updated with cross scripting cleared new fields.

When a DELETE request is made, the item is deleted.

## /users

When a POST request is made, it checks the body if the email and password is valid.
    If a user has registered with an email already, an error is sent.
    Otherwise, it stores a hashed password with the email as a user_email in the database.

## /auth/login

When a POST request is made, it checks the body to see if the email and password exists.
    If either the email or password is incorrect it gives an error.
    If the user_email or password does not match the password in the database, an error is sent.
    Upon success, it creates a JSON web token and returns the token and user_id.




