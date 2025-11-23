-- Tables: 
-- User
CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

-- Category
CREATE TABLE "Category" (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL
);

-- Expense
CREATE TABLE "Expense" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    amount NUMERIC NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    CONSTRAINT fk_expense_user FOREIGN KEY (user_id)
        REFERENCES "User"(id),
    CONSTRAINT fk_expense_category FOREIGN KEY (category_id)
        REFERENCES "Category"(id)
);

-- SavingGoal
CREATE TABLE "SavingGoal" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    target_amount NUMERIC NOT NULL,
    current_amount NUMERIC NOT NULL,
    deadline DATE,
    CONSTRAINT fk_savinggoal_user FOREIGN KEY (user_id)
        REFERENCES "User"(id)
);

-- SavingTransaction
CREATE TABLE "SavingTransaction" (
    id SERIAL PRIMARY KEY,
    saving_goal_id INTEGER NOT NULL,
    amount NUMERIC NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT fk_savingtransaction_goal FOREIGN KEY (saving_goal_id)
        REFERENCES "SavingGoal"(id)
);


-- Data: 
-- Users
INSERT INTO "User" (name, email, password_hash) VALUES
('Amar', 'amar@example.com', 'hashedpassword1'),
('John', 'john@example.com', 'hashedpassword2');

-- Categories
INSERT INTO "Category" (name, type) VALUES
('Food', 'expense'),
('Rent', 'expense'),
('Fuel', 'expense'),
('Salary', 'income'),
('Shopping', 'expense'),
('Gifts', 'expense');

-- Saving goals
INSERT INTO "SavingGoal" (user_id, title, target_amount, current_amount, deadline) VALUES
(1, 'New Laptop', 2000, 350, '2025-12-31'),
(1, 'Summer Trip', 1500, 200, '2025-07-10'),
(2, 'New Phone', 1200, 150, '2025-11-20');

-- Expenses
INSERT INTO "Expense" (user_id, category_id, amount, date, description) VALUES
(1, 1, 22.50, '2025-01-10', 'Groceries'),
(1, 2, 400.00, '2025-01-01', 'Monthly Rent'),
(1, 3, 60.00, '2025-01-05', 'Fuel refill'),
(2, 1, 12.00, '2025-01-03', 'Snacks'),
(2, 6, 50.00, '2025-01-07', 'Gift for friend'),
(2, 4, 1000.00, '2025-01-15', 'Salary Payment');

-- Saving transactions
INSERT INTO "SavingTransaction" (saving_goal_id, amount, date) VALUES
(1, 150, '2025-01-02'),
(1, 200, '2025-01-15'),
(2, 100, '2025-01-10'),
(3, 50,  '2025-01-05');
